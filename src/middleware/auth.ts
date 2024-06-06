import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../types";
import { AuthRequest } from "../types";

const auth =
  (roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded as IUser;
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access Forbidden" });
      }
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid Token" });
    }
  };

export { auth };
