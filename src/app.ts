import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/project";

dotenv.config();

const app = express();

//parse JSON request bodies
app.use(express.json());

// parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api", projectRoutes);

const startServer = async () => {
  try {
    //get mongoose uri string
    var uri = process.env.MONGO_URI ?? "";
    if (uri == "") {
      throw new Error("MONGO_URI is not set");
    }
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

startServer();

export default app;
