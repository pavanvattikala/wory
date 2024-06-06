import { Schema, model, Document } from "mongoose";

import { IProjectTag } from "../types";

const projectTagSchema = new Schema<IProjectTag>({
  name: { type: String, required: true, unique: true },
});

export const ProjectTag = model<IProjectTag>("ProjectTag", projectTagSchema);
