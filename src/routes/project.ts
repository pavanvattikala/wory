import { Router, Request, Response, NextFunction } from "express";
import { Project } from "../models/Project";
import { auth } from "../middleware/auth";
import { ProjectTag } from "../models/ProjectTag";
import { AuthRequest, IProject, IProjectTag, IUser } from "../types";
import addTagsIfNotExist from "../utils/tagHelper";

const router = Router();

router.post(
  "/project",
  auth(["Client"]),
  async (req: AuthRequest, res: Response) => {
    const { title, description, tags } = req.body as IProject;

    // check if tittle alredy exists
    const projectExist = await Project.findOne({ title: title });
    if (projectExist) {
      return res.status(400).json({ message: "Project already exists" });
    }

    const tagIds = await addTagsIfNotExist(tags)(req, res);

    // Create and save the project
    const project = new Project({
      title,
      description,
      client: req.user?.id,
      tags: tagIds,
    });
    await project.save();
    res.status(201).json(project);
  }
);

router.get(
  "/projects",
  auth(["Client", "Freelancer"]),
  async (req: AuthRequest, res: Response) => {
    try {
      const projects = await Project.find().populate("tags");
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.delete(
  "/project/:id",
  auth(["Client"]),
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // authorize the client
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.client.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    try {
      await Project.findByIdAndDelete(id);
      res.json({ message: "Project removed" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.put("/project/:id", auth(["Client"]), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { title, description, tags } = req.body as IProject;

  const tagIds = await addTagsIfNotExist(tags)(req, res);

  try {
    const project = await Project.findByIdAndUpdate(
      id,
      { title, description, tags: tagIds },
      { new: true }
    );
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get(
  "/projects/tags",
  auth(["Client", "Freelancer"]),
  async (req: Request, res: Response) => {
    const { tags } = req.query;

    // tags are speared by commas
    if (!tags) return res.status(400).json({ message: "Tags are required" });

    // split the tags by commas and add ids to the array
    const tagsArray = (tags as string).split(",");

    // find tag ids from the database
    const tagIds = await ProjectTag.find({ name: { $in: tagsArray } });

    try {
      // Find projects that have at least one of the provided tags
      const projects = await Project.find({
        tags: { $in: tagIds },
      }).populate("tags");

      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export default router;
