"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { TECH_OPTIONS, TECH_STACK } from "@/components/tech-config";
import type { Project, ProjectFormInput } from "@/types/project";

const emptyForm: ProjectFormInput = {
  title: "",
  description: "",
  tech: [],
  github: "",
  demo: "",
  image_url: "",
};

export function AdminDashboard() {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState<ProjectFormInput>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id,title,description,tech,github,demo,image_url,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setProjects(data ?? []);
  }, [supabase]);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);

      if (currentUser) {
        await fetchProjects();
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
      } else {
        setProjects([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProjects, supabase]);

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
      };

      const result = editingId
        ? await supabase.from("projects").update(payload).eq("id", editingId)
        : await supabase.from("projects").insert(payload);

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
                {projects.length} {projects.length === 1 ? "project" : "projects"} in Supabase.
              </p>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-[#111111] p-8 text-gray-400">
              No projects yet.
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-gray-800 bg-[#111111] p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm text-gray-400">{project.description}</p>
                    <p className="mt-3 text-xs text-[#2ec4b6]">{project.tech.join(", ")}</p>
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
      </div>
    </main>
  );
}
