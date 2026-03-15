import { useState, useEffect } from "react";
import { TECH_STACK } from "../constants/techConfig";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech: [],
    github: "",
    demo: "",
    image: "",
  });

  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // ===============================
  // FETCH PROJECTS
  // ===============================
  const fetchProjects = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ===============================
  // FORM HANDLERS
  // ===============================
  const toggleTech = (tech) => {
    setFormData((prev) => {
      const exists = prev.tech.includes(tech);

      return {
        ...prev,
        tech: exists
          ? prev.tech.filter((t) => t !== tech)
          : [...prev.tech, tech],
      };
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let imageUrl = formData.image;

    // ====================================
    // SUBIR IMAGEN A CLOUDINARY
    // ====================================
    if (formData.image instanceof File) {

      const imageData = new FormData();
      imageData.append("image", formData.image);

      const uploadRes = await fetch(
        `${import.meta.env.VITE_API_URL}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imageData,
        }
      );

      if (!uploadRes.ok) {
        throw new Error("Image upload failed");
      }

      const uploadResult = await uploadRes.json();

      imageUrl = uploadResult.url;
    }

    // ====================================
    // CREAR OBJETO FINAL DEL PROYECTO
    // ====================================
    const projectData = {
      ...formData,
      image: imageUrl,
    };

    const url = editingId
      ? `${import.meta.env.VITE_API_URL}/projects/${editingId}`
      : `${import.meta.env.VITE_API_URL}/projects`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!res.ok) {
      throw new Error("Failed to save project");
    }

    alert(editingId ? "Project updated ✅" : "Project created ✅");

    setFormData({
      title: "",
      description: "",
      tech: [],
      github: "",
      demo: "",
      image: "",
    });

    setEditingId(null);
    fetchProjects();

  } catch (error) {
    alert(error.message);
  }
};


  // ===============================
  // DELETE MODAL LOGIC
  // ===============================
  const handleDeleteClick = (id) => {
    setProjectToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/projects/${projectToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowDeleteModal(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      tech: project.tech,
      github: project.github,
      demo: project.demo,
      image: project.image,
    });

    setEditingId(project._id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-[#111111] p-8 rounded-2xl border border-gray-800"
        >
          <input
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-700"
          />

          <textarea
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-700"
          />

          {/* TECH SELECTOR */}
          <div className="flex flex-col items-center">
            <p className="mb-4 text-gray-400">Select Technologies</p>

            <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
              {Object.keys(TECH_STACK).map((tech) => {
                const isActive = formData.tech.includes(tech);

                return (
                  <button
                    type="button"
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm
                      border transition-all duration-200
                      ${
                        isActive
                          ? "bg-[#2ec4b6] text-black border-[#2ec4b6]"
                          : "bg-[#1a1a1a] text-gray-300 border-gray-700 hover:border-[#2ec4b6]"
                      }
                    `}
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
            onChange={handleChange}
            className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-700"
          />

          <input
            name="demo"
            placeholder="Live Demo URL"
            value={formData.demo}
            onChange={handleChange}
            className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-700"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({
                ...formData,
                image: e.target.files[0],
              })
            }
            className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-gray-700"
          />


          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#2ec4b6] px-8 py-3 rounded-lg text-black font-semibold"
            >
              {editingId ? "Update Project" : "Create Project"}
            </button>
          </div>
        </form>

        {/* ================= PROJECT LIST ================= */}
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-semibold">Existing Projects</h2>

          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-[#0f0f0f] p-6 rounded-xl border border-gray-800 relative"
            >
              <button
                onClick={() => handleDeleteClick(project._id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                ✕
              </button>

              <pre className="text-green-400 text-xs overflow-x-auto">
                {JSON.stringify(project, null, 2)}
              </pre>

              <button
                onClick={() => handleEdit(project)}
                className="mt-4 px-4 py-2 bg-[#2ec4b6] text-black rounded-lg"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#111111] p-8 rounded-2xl border border-gray-800 w-96">
            <h2 className="text-xl font-semibold mb-4">
              Delete Project
            </h2>

            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;