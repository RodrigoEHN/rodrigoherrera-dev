"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
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
      <main className="flex min-h-screen items-center justify-center bg-black px-8 text-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-6 rounded-2xl border border-gray-800 bg-[#111111] p-8"
        >
          <div>
            <p className="text-sm uppercase tracking-widest text-[#2ec4b6]">Admin</p>
            <h1 className="mt-2 text-3xl font-bold">Sign in</h1>
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
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500">{user.email}</p>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-800 bg-[#111111] p-8"
        >
          <input
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={(event) => setFormData({ ...formData, title: event.target.value })}
            className="w-full rounded-lg border border-gray-700 bg-[#1a1a1a] p-3"
            required
          />

          <textarea
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={(event) => setFormData({ ...formData, description: event.target.value })}
            className="min-h-32 w-full rounded-lg border border-gray-700 bg-[#1a1a1a] p-3"
            required
          />

          <div>
            <p className="mb-4 text-center text-gray-400">Select Technologies</p>
            <div className="flex flex-wrap justify-center gap-4">
              {TECH_OPTIONS.map((tech) => {
                const isActive = formData.tech.includes(tech);

                return (
                  <button
                    type="button"
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
                      isActive
                        ? "border-[#2ec4b6] bg-[#2ec4b6] text-black"
                        : "border-gray-700 bg-[#1a1a1a] text-gray-300 hover:border-[#2ec4b6]"
                    }`}
                  >
                    {TECH_STACK[tech].icon}
                    {tech}
                  </button>
                );
              })}
            </div>
          </div>

          <input
            name="github"
            placeholder="GitHub URL"
            value={formData.github}
            onChange={(event) => setFormData({ ...formData, github: event.target.value })}
            className="w-full rounded-lg border border-gray-700 bg-[#1a1a1a] p-3"
          />

          <input
            name="demo"
            placeholder="Live Demo URL"
            value={formData.demo}
            onChange={(event) => setFormData({ ...formData, demo: event.target.value })}
            className="w-full rounded-lg border border-gray-700 bg-[#1a1a1a] p-3"
          />

          <input
            name="image_url"
            placeholder="Image URL or upload a file below"
            value={formData.image_url}
            onChange={(event) => setFormData({ ...formData, image_url: event.target.value })}
            className="w-full rounded-lg border border-gray-700 bg-[#1a1a1a] p-3"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-gray-700 bg-[#1a1a1a] p-3"
          />

          {message ? <p className="text-sm text-[#2ec4b6]">{message}</p> : null}

          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#2ec4b6] px-8 py-3 font-semibold text-black transition hover:bg-[#1f9d8f] disabled:opacity-60"
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
                className="rounded-lg bg-gray-700 px-8 py-3 font-semibold text-white transition hover:bg-gray-600"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-semibold">Existing Projects</h2>

          {projects.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-[#0f0f0f] p-6 text-gray-400">
              No projects yet.
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-gray-800 bg-[#0f0f0f] p-6"
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
