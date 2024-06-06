import { Types } from "mongoose";
import { Response } from "express";
import { AuthRequest } from "../types";
import { ProjectTag } from "../models/ProjectTag";
const addTagsIfNotExist =
  (tags: Types.ObjectId[]) => async (req: AuthRequest, res: Response) => {
    try {
      // Map tags to their IDs, creating new ones if they don't exist
      const tagsWithIds = await Promise.all(
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
      return tagsWithIds;
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };

export default addTagsIfNotExist;
