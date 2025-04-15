import { Request, Response } from "express";
import verifyToken from "../middlewares/Auth";
import express from "express";
import UserProfileController from "../controllers/UserProfileController";
import multer from "multer";
import "dotenv/config";
import { supabase } from "..";

const router = express.Router();

router.put("/update", verifyToken, UserProfileController.UpdateUserProfile);

router.get("/user", verifyToken, UserProfileController.GetLoggedInUser);

router.delete("/delete", verifyToken, UserProfileController.DeleteUserProfile);

router.get("/role", verifyToken, (req: Request, res: Response) => {
  try {
    const role = req.role;
    if (!role) {
      res.status(401).json({ message: "UnAuthorized" });
      return;
    }
    res.status(200).json({ role });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
