const express = require("express");
const router = express.Router();

const {
  getProjects,
  createProject,
  deleteProject,
} = require("../controllers/projectController");

const { protect } = require("../middlewares/authMiddleware");


router.route("/")
  .get(getProjects)
  .post(protect, createProject);

router.route("/:id")
  .delete(protect, deleteProject);

module.exports = router;
