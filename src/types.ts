import { Document, Types } from "mongoose";
import { Request } from "express";

// user Type
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "Client" | "Freelancer";
}

// jwt payload type
export interface JwtPayload {
  id: string;
  role: "Client" | "Freelancer";
}

// project Type
export interface IProject extends Document {
  title: string;
  description: string;
  client: Types.ObjectId;
  tags: Types.ObjectId[];
}

// project tag Type
export interface IProjectTag extends Document {
  name: string;
}

// Auth Request Type
export interface AuthRequest extends Request {
  user?: IUser;
}
