"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Plus, Trash2 } from "lucide-react";
import { DEFAULT_PORTFOLIO_CONTENT } from "@/lib/content-defaults";
import { createClient } from "@/utils/supabase/client";
import { TECH_OPTIONS, TECH_STACK } from "@/components/tech-config";
import type { PortfolioContent } from "@/types/content";
import type { Project, ProjectFormInput } from "@/types/project";

const emptyForm: ProjectFormInput = {
  title: "",
  description: "",
  tech: [],
  github: "",
  demo: "",
  image_url: "",
};

type SupabaseError = {
  code?: string;
  message?: string;
};

type AdminSection = "projects" | "hero" | "about" | "experience" | "tech";

export function AdminDashboard() {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState<ProjectFormInput>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [content, setContent] = useState<PortfolioContent>(DEFAULT_PORTFOLIO_CONTENT);
  const [activeSection, setActiveSection] = useState<AdminSection>("projects");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);

  const adminSections: { id: AdminSection; label: string }[] = [
    { id: "projects", label: "Projects" },
    { id: "hero", label: "Hero" },
    { id: "about", label: "About me" },
    { id: "experience", label: "Experience" },
    { id: "tech", label: "Tech stack" },
  ];

  const imagePreview = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }

    return formData.image_url;
  }, [formData.image_url, imageFile]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const mergeContent = useCallback((savedContent?: Partial<PortfolioContent> | null) => {
    return {
      hero: {
        ...DEFAULT_PORTFOLIO_CONTENT.hero,
        ...(savedContent?.hero ?? {}),
      },
      about: savedContent?.about?.length
        ? savedContent.about
        : DEFAULT_PORTFOLIO_CONTENT.about,
      experience: savedContent?.experience?.length
        ? savedContent.experience
        : DEFAULT_PORTFOLIO_CONTENT.experience,
      techStack: savedContent?.techStack?.length
        ? savedContent.techStack
        : DEFAULT_PORTFOLIO_CONTENT.techStack,
    };
  }, []);

  const fetchContent = useCallback(async () => {
    const { data, error } = await supabase
      .from("portfolio_content")
      .select("content")
      .eq("id", "main")
      .maybeSingle();

    if (error) {
      if ((error as SupabaseError).code === "42P01") {
        setContent(DEFAULT_PORTFOLIO_CONTENT);
        setMessage("Run the updated Supabase SQL to enable portfolio content editing.");
        return;
      }

      setMessage(error.message);
      return;
    }

    setContent(mergeContent(data?.content as Partial<PortfolioContent> | null));
  }, [mergeContent, supabase]);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id,title,description,tech,github,demo,image_url,sort_order,created_at,updated_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      if ((error as SupabaseError).code === "42703") {
        const fallback = await supabase
          .from("projects")
          .select("id,title,description,tech,github,demo,image_url,created_at,updated_at")
          .order("created_at", { ascending: false });

        if (fallback.error) {
          setMessage(fallback.error.message);
          return;
        }

        setProjects(
          (fallback.data ?? []).map((project, index) => ({
            ...project,
            sort_order: index,
          })),
        );
        setMessage("Run the updated Supabase SQL to enable drag-and-drop ordering.");
        return;
      }

      setMessage(error.message);
      return;
    }

    setProjects(
      (data ?? []).map((project, index) => ({
        ...project,
        sort_order: project.sort_order ?? index,
      })),
    );
  }, [supabase]);

  useEffect(() => {
    const loadSession = async () => {
      const authResult = await Promise.race([
        supabase.auth.getUser(),
        new Promise<{ data: { user: User | null }; error: Error }>((resolve) => {
          window.setTimeout(
            () =>
              resolve({
                data: { user: null },
                error: new Error("Supabase auth took too long to respond."),
              }),
            5000,
          );
        }),
      ]);

      const currentUser = authResult.data.user;

      setUser(currentUser);

      if (currentUser) {
        await Promise.all([fetchProjects(), fetchContent()]);
      } else if ("error" in authResult && authResult.error) {
        setMessage(authResult.error.message);
      }

      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        void fetchProjects();
        void fetchContent();
      } else {
        setProjects([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchContent, fetchProjects, supabase]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setSaving(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSaving(false);

    if (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProjects([]);
  };

  const toggleTech = (tech: string) => {
    setFormData((current) => ({
      ...current,
      tech: current.tech.includes(tech)
        ? current.tech.filter((item) => item !== tech)
        : [...current.tech, tech],
    }));
  };

  const uploadImage = async () => {
    if (!imageFile) {
      return formData.image_url;
    }

    const extension = imageFile.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage.from("project-images").upload(path, imageFile, {
      cacheControl: "31536000",
      upsert: false,
    });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      const imageUrl = await uploadImage();

      const payload = {
        title: formData.title,
        description: formData.description,
        tech: formData.tech,
        github: formData.github || null,
        demo: formData.demo || null,
        image_url: imageUrl || null,
        sort_order: editingId ? projects.find((project) => project.id === editingId)?.sort_order ?? 0 : projects.length,
      };

      let result = editingId
        ? await supabase.from("projects").update(payload).eq("id", editingId)
        : await supabase.from("projects").insert(payload);

      if (result.error && (result.error as SupabaseError).code === "42703") {
        const payloadWithoutSortOrder = {
          title: payload.title,
          description: payload.description,
          tech: payload.tech,
          github: payload.github,
          demo: payload.demo,
          image_url: payload.image_url,
        };
        result = editingId
          ? await supabase.from("projects").update(payloadWithoutSortOrder).eq("id", editingId)
          : await supabase.from("projects").insert(payloadWithoutSortOrder);
      }

      if (result.error) {
        throw result.error;
      }

      setMessage(editingId ? "Project updated." : "Project created.");
      setFormData(emptyForm);
      setImageFile(null);
      setEditingId(null);
      await fetchProjects();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save project.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setImageFile(null);
    setFormData({
      title: project.title,
      description: project.description,
      tech: project.tech ?? [],
      github: project.github ?? "",
      demo: project.demo ?? "",
      image_url: project.image_url ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (project: Project) => {
    const confirmed = window.confirm(`Delete "${project.title}"?`);

    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from("projects").delete().eq("id", project.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Project deleted.");
    await fetchProjects();
  };

  const saveContent = async () => {
    setMessage(null);
    setSaving(true);

    const { error } = await supabase.from("portfolio_content").upsert({
      id: "main",
      content,
    });

    setSaving(false);

    if (error) {
      if ((error as SupabaseError).code === "42P01") {
        setMessage("Run the updated Supabase SQL to enable portfolio content editing.");
        return;
      }

      setMessage(error.message);
      return;
    }

    setMessage("Portfolio content updated.");
  };

  const updateAboutParagraph = (index: number, value: string) => {
    setContent((current) => ({
      ...current,
      about: current.about.map((paragraph, paragraphIndex) =>
        paragraphIndex === index ? value : paragraph,
      ),
    }));
  };

  const updateExperiencePoint = (experienceIndex: number, pointIndex: number, value: string) => {
    setContent((current) => ({
      ...current,
      experience: current.experience.map((experience, index) =>
        index === experienceIndex
          ? {
              ...experience,
              points: experience.points.map((point, currentPointIndex) =>
                currentPointIndex === pointIndex ? value : point,
              ),
            }
          : experience,
      ),
    }));
  };

  const addExperience = () => {
    setContent((current) => ({
      ...current,
      experience: [
        ...current.experience,
        {
          role: "New role",
          company: "Company",
          period: "2026 - Present",
          points: ["Describe your impact."],
        },
      ],
    }));
  };

  const removeExperience = (experienceIndex: number) => {
    setContent((current) => ({
      ...current,
      experience: current.experience.filter((_, index) => index !== experienceIndex),
    }));
  };

  const addTechGroup = () => {
    setContent((current) => ({
      ...current,
      techStack: [...current.techStack, { title: "New group", tech: ["New technology"] }],
    }));
  };

  const updateTechGroup = (groupIndex: number, value: string) => {
    setContent((current) => ({
      ...current,
      techStack: current.techStack.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              tech: value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            }
          : group,
      ),
    }));
  };

  const persistProjectOrder = async (orderedProjects: Project[]) => {
    const updates = orderedProjects.map((project, index) =>
      supabase.from("projects").update({ sort_order: index }).eq("id", project.id),
    );

    const results = await Promise.all(updates);
    const failedUpdate = results.find((result) => result.error);

    if (failedUpdate?.error) {
      if ((failedUpdate.error as SupabaseError).code === "42703") {
        setMessage("Run the updated Supabase SQL before saving project order.");
        await fetchProjects();
        return;
      }

      setMessage(failedUpdate.error.message);
      await fetchProjects();
      return;
    }

    setMessage("Project order updated.");
  };

  const moveProject = async (targetProjectId: string) => {
    if (!draggedProjectId || draggedProjectId === targetProjectId) {
      return;
    }

    const fromIndex = projects.findIndex((project) => project.id === draggedProjectId);
    const toIndex = projects.findIndex((project) => project.id === targetProjectId);

    if (fromIndex === -1 || toIndex === -1) {
      return;
    }

    const reorderedProjects = [...projects];
    const [movedProject] = reorderedProjects.splice(fromIndex, 1);
    reorderedProjects.splice(toIndex, 0, movedProject);

    const normalizedProjects = reorderedProjects.map((project, index) => ({
      ...project,
      sort_order: index,
    }));

    setProjects(normalizedProjects);
    setDraggedProjectId(null);
    await persistProjectOrder(normalizedProjects);
  };

  if (loading) {
    return <div className="min-h-screen bg-black p-8 text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#173835_0%,#0f0f0f_35%,#000_100%)] px-8 text-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-6 rounded-2xl border border-gray-800 bg-[#111111]/95 p-8 shadow-2xl shadow-black/40"
        >
          <div>
            <p className="text-sm uppercase tracking-widest text-[#2ec4b6]">Portfolio Admin</p>
            <h1 className="mt-2 text-3xl font-bold">Sign in</h1>
            <p className="mt-3 text-sm text-gray-400">
              Manage projects, images, links and stack tags from Supabase.
            </p>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#1a1a1a] p-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-[#1a1a1a] p-3"
            required
          />

          {message ? <p className="text-sm text-red-400">{message}</p> : null}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-[#2ec4b6] px-6 py-3 font-semibold text-black transition hover:bg-[#1f9d8f] disabled:opacity-60"
          >
            {saving ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-8 text-white md:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-gray-800 bg-[#111111] p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-[#2ec4b6]">Portfolio Admin</p>
            <h1 className="mt-2 text-3xl font-bold">Projects</h1>
            <p className="mt-2 text-sm text-gray-400">
              Signed in as <span className="text-gray-200">{user.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:border-[#2ec4b6] hover:text-[#2ec4b6]"
            >
              View Site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-red-500/15 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {adminSections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeSection === section.id
                  ? "border-[#2ec4b6] bg-[#2ec4b6] text-black"
                  : "border-gray-800 bg-[#111111] text-gray-300 hover:border-[#2ec4b6]"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {activeSection === "projects" ? (
          <>
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 rounded-2xl border border-gray-800 bg-[#111111] p-6 shadow-2xl shadow-black/30 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-8"
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-200">
                Project title
              </label>
              <input
                id="title"
                name="title"
                placeholder="Hivee, GuitarLA, CRM Dashboard..."
                value={formData.title}
                onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                className="w-full rounded-xl border border-gray-700 bg-[#1a1a1a] p-3.5 text-white outline-none transition focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="description" className="text-sm font-medium text-gray-200">
                  Description
                </label>
                <span className="text-xs text-gray-500">{formData.description.length} chars</span>
              </div>
              <textarea
                id="description"
                name="description"
                placeholder="Short, clear summary of what the project does and what you built."
                value={formData.description}
                onChange={(event) =>
                  setFormData({ ...formData, description: event.target.value })
                }
                className="min-h-36 w-full resize-y rounded-xl border border-gray-700 bg-[#1a1a1a] p-3.5 text-white outline-none transition focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="github" className="text-sm font-medium text-gray-200">
                  GitHub URL
                </label>
                <input
                  id="github"
                  name="github"
                  placeholder="https://github.com/..."
                  value={formData.github}
                  onChange={(event) => setFormData({ ...formData, github: event.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-[#1a1a1a] p-3.5 text-white outline-none transition focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="demo" className="text-sm font-medium text-gray-200">
                  Live demo URL
                </label>
                <input
                  id="demo"
                  name="demo"
                  placeholder="https://..."
                  value={formData.demo}
                  onChange={(event) => setFormData({ ...formData, demo: event.target.value })}
                  className="w-full rounded-xl border border-gray-700 bg-[#1a1a1a] p-3.5 text-white outline-none transition focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20"
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-black/20 p-5">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-200">Technologies</p>
                  <p className="text-xs text-gray-500">Choose the tags shown on the public card.</p>
                </div>
                <span className="text-xs text-[#2ec4b6]">
                  {formData.tech.length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {TECH_OPTIONS.map((tech) => {
                  const isActive = formData.tech.includes(tech);

                  return (
                    <button
                      type="button"
                      key={tech}
                      onClick={() => toggleTech(tech)}
                      className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all duration-200 ${
                        isActive
                          ? "border-[#2ec4b6] bg-[#2ec4b6] text-black shadow-lg shadow-[#2ec4b6]/10"
                          : "border-gray-700 bg-[#1a1a1a] text-gray-300 hover:border-[#2ec4b6] hover:text-white"
                      }`}
                    >
                      {TECH_STACK[tech].icon}
                      {tech}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-5 rounded-2xl border border-gray-800 bg-[#0d0d0d] p-5">
            <div>
              <p className="text-sm font-medium text-gray-200">Project image</p>
              <p className="mt-1 text-xs text-gray-500">
                Upload a file to Supabase Storage or paste an external URL.
              </p>
            </div>

            <div
              className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-gray-800 bg-[#1a1a1a] bg-cover bg-center text-center text-sm text-gray-500"
              style={imagePreview ? { backgroundImage: `url(${imagePreview})` } : undefined}
            >
              {!imagePreview ? <span>No image selected</span> : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="image_url" className="text-sm font-medium text-gray-200">
                Image URL
              </label>
              <input
                id="image_url"
                name="image_url"
                placeholder="https://..."
                value={formData.image_url}
                onChange={(event) => setFormData({ ...formData, image_url: event.target.value })}
                className="w-full rounded-xl border border-gray-700 bg-[#1a1a1a] p-3 text-sm text-white outline-none transition focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20"
              />
            </div>

            <label className="block cursor-pointer rounded-xl border border-dashed border-gray-700 bg-[#1a1a1a] p-4 text-center transition hover:border-[#2ec4b6]">
              <span className="block text-sm font-medium text-gray-200">
                {imageFile ? imageFile.name : "Choose image file"}
              </span>
              <span className="mt-1 block text-xs text-gray-500">PNG, JPG or WebP</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                className="sr-only"
              />
            </label>

            {message ? (
              <p className="rounded-xl border border-[#2ec4b6]/25 bg-[#2ec4b6]/10 p-3 text-sm text-[#2ec4b6]">
                {message}
              </p>
            ) : null}

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-[#2ec4b6] px-8 py-3 font-semibold text-black transition hover:bg-[#1f9d8f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update Project" : "Create Project"}
              </button>

              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData(emptyForm);
                    setImageFile(null);
                  }}
                  className="w-full rounded-xl border border-gray-700 px-8 py-3 font-semibold text-white transition hover:border-gray-500"
                >
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </aside>
        </form>

        <div className="mt-12 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Existing Projects</h2>
              <p className="mt-1 text-sm text-gray-500">
                Drag projects to choose what appears first on the public site.
              </p>
            </div>
            <span className="hidden rounded-full border border-gray-800 bg-[#111111] px-3 py-1 text-xs text-gray-400 sm:inline">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-[#111111] p-8 text-gray-400">
              No projects yet.
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                draggable
                onDragStart={() => setDraggedProjectId(project.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => void moveProject(project.id)}
                onDragEnd={() => setDraggedProjectId(null)}
                className={`rounded-2xl border bg-[#111111] p-5 transition ${
                  draggedProjectId === project.id
                    ? "border-[#2ec4b6] opacity-60"
                    : "border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-xl border border-gray-800 bg-[#1a1a1a] text-sm text-gray-500 active:cursor-grabbing"
                      title="Drag to reorder"
                    >
                      {project.sort_order + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <p className="mt-2 max-w-2xl text-sm text-gray-400">
                        {project.description}
                      </p>
                      <p className="mt-3 text-xs text-[#2ec4b6]">{project.tech.join(", ")}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(project)}
                      className="rounded-lg bg-[#2ec4b6] px-4 py-2 text-black"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project)}
                      className="rounded-lg bg-red-500 px-4 py-2 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
          </>
        ) : null}

        {activeSection === "hero" ? (
          <section className="rounded-2xl border border-gray-800 bg-[#111111] p-6 shadow-2xl shadow-black/30 lg:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Hero</h2>
              <p className="mt-1 text-sm text-gray-500">Edit the first section visitors see.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                ["name", "Name"],
                ["title", "Title"],
                ["githubUrl", "GitHub URL"],
                ["linkedinUrl", "LinkedIn URL"],
                ["imageUrl", "Profile image URL"],
              ].map(([field, label]) => (
                <label key={field} className="flex flex-col gap-2 text-sm font-medium text-gray-200">
                  {label}
                  <input
                    value={content.hero[field as keyof typeof content.hero]}
                    onChange={(event) =>
                      setContent((current) => ({
                        ...current,
                        hero: { ...current.hero, [field]: event.target.value },
                      }))
                    }
                    className="w-full rounded-xl border border-gray-700 bg-[#1a1a1a] p-3.5 text-white outline-none transition focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20"
                  />
                </label>
              ))}

              <label className="flex flex-col gap-2 text-sm font-medium text-gray-200 md:col-span-2">
                Description
                <textarea
                  value={content.hero.description}
                  onChange={(event) =>
                    setContent((current) => ({
                      ...current,
                      hero: { ...current.hero, description: event.target.value },
                    }))
                  }
                  className="min-h-32 w-full resize-y rounded-xl border border-gray-700 bg-[#1a1a1a] p-3.5 text-white outline-none transition focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => void saveContent()}
              disabled={saving}
              className="mt-6 rounded-xl bg-[#2ec4b6] px-8 py-3 font-semibold text-black transition hover:bg-[#1f9d8f] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Hero"}
            </button>
          </section>
        ) : null}

        {activeSection === "about" ? (
          <section className="rounded-2xl border border-gray-800 bg-[#111111] p-6 shadow-2xl shadow-black/30 lg:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">About me</h2>
                <p className="mt-1 text-sm text-gray-500">Each textarea becomes one paragraph.</p>
              </div>
              <button
                type="button"
                onClick={() => setContent((current) => ({ ...current, about: [...current.about, ""] }))}
                className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:border-[#2ec4b6]"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            <div className="space-y-4">
              {content.about.map((paragraph, index) => (
                <div key={index} className="flex gap-3">
                  <textarea
                    value={paragraph}
                    onChange={(event) => updateAboutParagraph(index, event.target.value)}
                    className="min-h-28 w-full resize-y rounded-xl border border-gray-700 bg-[#1a1a1a] p-3.5 text-white outline-none transition focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20"
                  />
                  <button
                    type="button"
                    aria-label="Remove paragraph"
                    onClick={() =>
                      setContent((current) => ({
                        ...current,
                        about: current.about.filter((_, paragraphIndex) => paragraphIndex !== index),
                      }))
                    }
                    className="h-11 rounded-lg bg-red-500/15 px-3 text-red-300 transition hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => void saveContent()}
              disabled={saving}
              className="mt-6 rounded-xl bg-[#2ec4b6] px-8 py-3 font-semibold text-black transition hover:bg-[#1f9d8f] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save About"}
            </button>
          </section>
        ) : null}

        {activeSection === "experience" ? (
          <section className="rounded-2xl border border-gray-800 bg-[#111111] p-6 shadow-2xl shadow-black/30 lg:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Experience</h2>
                <p className="mt-1 text-sm text-gray-500">Edit jobs and bullet points.</p>
              </div>
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:border-[#2ec4b6]"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            <div className="space-y-5">
              {content.experience.map((experience, experienceIndex) => (
                <div key={experienceIndex} className="rounded-xl border border-gray-800 bg-black/20 p-5">
                  <div className="mb-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeExperience(experienceIndex)}
                      className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {(["role", "company", "period"] as const).map((field) => (
                      <input
                        key={field}
                        value={experience[field]}
                        placeholder={field}
                        onChange={(event) =>
                          setContent((current) => ({
                            ...current,
                            experience: current.experience.map((item, index) =>
                              index === experienceIndex
                                ? { ...item, [field]: event.target.value }
                                : item,
                            ),
                          }))
                        }
                        className="w-full rounded-xl border border-gray-700 bg-[#1a1a1a] p-3.5 text-white outline-none transition focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20"
                      />
                    ))}
                  </div>

                  <div className="mt-4 space-y-3">
                    {experience.points.map((point, pointIndex) => (
                      <div key={pointIndex} className="flex gap-3">
                        <input
                          value={point}
                          onChange={(event) =>
                            updateExperiencePoint(experienceIndex, pointIndex, event.target.value)
                          }
                          className="w-full rounded-xl border border-gray-700 bg-[#1a1a1a] p-3.5 text-white outline-none transition focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20"
                        />
                        <button
                          type="button"
                          aria-label="Remove point"
                          onClick={() =>
                            setContent((current) => ({
                              ...current,
                              experience: current.experience.map((item, index) =>
                                index === experienceIndex
                                  ? {
                                      ...item,
                                      points: item.points.filter(
                                        (_, currentPointIndex) => currentPointIndex !== pointIndex,
                                      ),
                                    }
                                  : item,
                              ),
                            }))
                          }
                          className="rounded-lg bg-red-500/15 px-3 text-red-300 transition hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        setContent((current) => ({
                          ...current,
                          experience: current.experience.map((item, index) =>
                            index === experienceIndex
                              ? { ...item, points: [...item.points, ""] }
                              : item,
                          ),
                        }))
                      }
                      className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:border-[#2ec4b6]"
                    >
                      Add point
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => void saveContent()}
              disabled={saving}
              className="mt-6 rounded-xl bg-[#2ec4b6] px-8 py-3 font-semibold text-black transition hover:bg-[#1f9d8f] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Experience"}
            </button>
          </section>
        ) : null}

        {activeSection === "tech" ? (
          <section className="rounded-2xl border border-gray-800 bg-[#111111] p-6 shadow-2xl shadow-black/30 lg:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Tech stack</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Use comma-separated technologies. Supabase is now in Databases by default.
                </p>
              </div>
              <button
                type="button"
                onClick={addTechGroup}
                className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:border-[#2ec4b6]"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            <div className="space-y-4">
              {content.techStack.map((group, groupIndex) => (
                <div key={groupIndex} className="grid gap-4 rounded-xl border border-gray-800 bg-black/20 p-5 md:grid-cols-[220px_minmax(0,1fr)_auto]">
                  <input
                    value={group.title}
                    onChange={(event) =>
                      setContent((current) => ({
                        ...current,
                        techStack: current.techStack.map((item, index) =>
                          index === groupIndex ? { ...item, title: event.target.value } : item,
                        ),
                      }))
                    }
                    className="rounded-xl border border-gray-700 bg-[#1a1a1a] p-3.5 text-white outline-none transition focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20"
                  />
                  <input
                    value={group.tech.join(", ")}
                    onChange={(event) => updateTechGroup(groupIndex, event.target.value)}
                    className="rounded-xl border border-gray-700 bg-[#1a1a1a] p-3.5 text-white outline-none transition focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20"
                  />
                  <button
                    type="button"
                    aria-label="Remove group"
                    onClick={() =>
                      setContent((current) => ({
                        ...current,
                        techStack: current.techStack.filter((_, index) => index !== groupIndex),
                      }))
                    }
                    className="rounded-lg bg-red-500/15 px-3 text-red-300 transition hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => void saveContent()}
              disabled={saving}
              className="mt-6 rounded-xl bg-[#2ec4b6] px-8 py-3 font-semibold text-black transition hover:bg-[#1f9d8f] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Tech Stack"}
            </button>
          </section>
        ) : null}

        {activeSection !== "projects" && message ? (
          <p className="mt-6 rounded-xl border border-[#2ec4b6]/25 bg-[#2ec4b6]/10 p-3 text-sm text-[#2ec4b6]">
            {message}
          </p>
        ) : null}
      </div>
    </main>
  );
}
