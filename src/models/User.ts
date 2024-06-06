import { Schema, model, Document } from "mongoose";

import { IUser } from "../types";
const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Client", "Freelancer"], required: true },
});

export const User = model<IUser>("User", userSchema);
