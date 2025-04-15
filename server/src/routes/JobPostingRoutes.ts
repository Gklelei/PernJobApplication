import verifyToken from "../middlewares/Auth";
import JobPostingController from "../controllers/JobPostingController";

import express from "express";

const router = express.Router();

router.post("/create", verifyToken, JobPostingController.createJobPosting);
router.get("/all", JobPostingController.AllJobPostings);

router.get("/:id", JobPostingController.GetJobPostingById);

router.put("/update/:id", verifyToken, JobPostingController.UpdateJobPosting);

router.delete(
  "/delete/:id",
  verifyToken,
  JobPostingController.DeleteJobPosting
);

export default router;
