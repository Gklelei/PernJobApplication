import { Router } from "express";
import verifyToken from "../middlewares/Auth";
import UsersController from "../controllers/UsersController";

const router = Router();

router.get("/all", verifyToken, UsersController.GetAllUsers);
router.get(
  "/applications",
  verifyToken,
  UsersController.GetUsersJobApplications
);
router.put("/forget-password", verifyToken, UsersController.UserChangePassword);

export default router;
