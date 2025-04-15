import express from "express";
import JobApplicationControllers from "../controllers/JobApplicationControllers";
import verifyToken from "../middlewares/Auth";

const router = express.Router();

router.post(
  "/create/:id",
  verifyToken,
  JobApplicationControllers.CreateJobApplication
);

router.get("/all", JobApplicationControllers.GetAllJobApplicationsWithDetails);
router.delete("/delete/:id", JobApplicationControllers.DeleteJobApplication);
router.put("/update/:id", JobApplicationControllers.UpdateJobApplicationStatus);
router.get("/:id", JobApplicationControllers.GetJobApplicationById);
export default router;
