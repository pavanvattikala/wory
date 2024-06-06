import { Router, Request, Response, NextFunction } from "express";
import { Project } from "../models/Project";
import { auth } from "../middleware/auth";
import { ProjectTag } from "../models/ProjectTag";
import { AuthRequest, IProject, IUser } from "../types";

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

    try {
      // Map tags to their IDs, creating new ones if they don't exist
      const tagIds = await Promise.all(
        tags.map(async (tag) => {
          const existingTag = await ProjectTag.findOne({
            name: tag.toString(),
          });
          if (!existingTag) {
            const newTag = new ProjectTag({ name: tag.toString() });
            await newTag.save();
            return newTag._id;
          } else {
            return existingTag._id;
          }
        })
      );

      // Print tag IDs
      console.log(tagIds);

      // Create and save the project
      const project = new Project({
        title,
        description,
        client: req.user?.id,
        tags: tagIds,
      });
      await project.save();
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
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

export default router;
