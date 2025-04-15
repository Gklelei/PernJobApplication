import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      role: string;
    }
  }
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["Bearer"];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;
    req.role = (decoded as JwtPayload).role;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

export default verifyToken;
