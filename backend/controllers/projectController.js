const Project = require("../models/Project");

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 */
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a project
 * @route   POST /api/projects
 */

const createProject = async (req, res) => {
  try {
    const { title, description, tech, github, demo, image } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const project = await Project.create({
      title,
      description,
      tech,
      github,
      demo,
      image,
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 */
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();

    res.json({ message: "Project removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getProjects,
  createProject,
  deleteProject,
};
