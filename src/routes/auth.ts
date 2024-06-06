import { Router, Request, Response } from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { IUser } from "../types";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  var { username, email, password, role } = req.body as IUser;

  // username validation
  if (!username)
    return res.status(400).json({ message: "Username is required" });

  // email validation
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ message: "Invalid email" });

  // password validation
  if (!password)
    return res.status(400).json({ message: "Password is required" });

  // if role is not provided, set it to "Client"
  const validRoles = ["Client", "Freelancer"];
  if (!role || !validRoles.includes(role)) role = "Client";

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body as IUser;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
