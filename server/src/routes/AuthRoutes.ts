import { Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import verifyToken from "../middlewares/Auth";

import express from "express";

const router = express.Router();

router.post("/login", AuthController.UserLogin);
router.post("/register", AuthController.UserRegistration);
router.post("/signout", (req: Request, res: Response) => {
  res.cookie("Bearer", "", {
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout Success!" });
  return;
});
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).json({ userId: req.userId });
  return;
});

export default router;
