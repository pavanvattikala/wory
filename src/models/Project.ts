import { Schema, model, Document, Types } from "mongoose";
import { IProject } from "../types";

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  client: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "ProjectTag" }],
});

export const Project = model<IProject>("Project", projectSchema);
