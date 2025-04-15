import { Request, Response } from "express";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../drizzle/db";
import { JobApplications, JobPosting, users } from "../drizzle/db/schema";

export const CreateJobApplication = async (req: Request, res: Response) => {
  try {
    const { id: jobId } = req.params;
    const userId = req.userId;

    if (!jobId || !userId) {
      res.status(400).json({ message: "Missing jobId or userId" });
      return;
    }

    // Check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (user.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if job exists
    const job = await db
      .select()
      .from(JobPosting)
      .where(eq(JobPosting.id, jobId))
      .limit(1);
    if (job.length === 0) {
      res.status(404).json({ message: "Job not found" });
      return;
    }

    // Check if the user already applied for this job
    const existing = await db
      .select()
      .from(JobApplications)
      .where(
        and(
          eq(JobApplications.userId, userId),
          eq(JobApplications.jobId, jobId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      res
        .status(409)
        .json({ message: "You have already applied for this job" });
      return;
    }

    // Create job application
    await db.insert(JobApplications).values({
      userId,
      jobId,
    });

    // Optionally increment user's applications count
    await db
      .update(users)
      .set({ applications: (user[0].applications || 0) + 1 })
      .where(eq(users.id, userId));

    res.status(201).json({ message: "Job application submitted successfully" });
    return;
  } catch (error) {
    console.error("Error creating job application:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const GetAllJobApplicationsWithDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const applications = await db
      .select({
        applicationId: JobApplications.id,
        jobId: JobPosting.id,
        jobTitle: JobPosting.title,
        jobDescription: JobPosting.description,
        userId: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        candidate: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
        userEmail: users.email,
        appliedDate: JobApplications.createdAt,
        position: JobPosting.title,
        department: JobPosting.department,
        status: JobApplications.status,
        resumeUrl: users.cvUrl,
        coverLetterUrl: users.coverLetterUrl,
      })
      .from(JobApplications)
      .innerJoin(users, eq(JobApplications.userId, users.id))
      .innerJoin(JobPosting, eq(JobApplications.jobId, JobPosting.id));

    res.status(200).json(applications);
    return;
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
const GetJobApplicationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Missing Job Application Id" });
    return;
  }

  try {
    const jobApplication = await db
      .select({
        applicationId: JobApplications.id,
        jobId: JobPosting.id,
        userId: users.id,
        appliedDate: JobApplications.createdAt,
        position: JobPosting.title,
        department: JobPosting.department,
        status: JobApplications.status,
        resumeUrl: users.cvUrl,
        coverLetterUrl: users.coverLetterUrl,
        sallary: JobPosting.salary,
        type: JobPosting.type,
        qualifications: JobPosting.qualifications,
        skills: JobPosting.skills,
      })
      .from(JobApplications)
      .innerJoin(users, eq(JobApplications.userId, users.id))
      .innerJoin(JobPosting, eq(JobApplications.jobId, JobPosting.id))
      .where(eq(JobApplications.id, id));

    if (jobApplication.length === 0) {
      res.status(404).json({ message: "Job application not found" });
      return;
    }
    res.status(200).json({ data: jobApplication });
    return;
  } catch (error) {
    console.log({ error: error });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const DeleteJobApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Application Id Required" });
    return;
  }
  try {
    const [existingApplication] = await db
      .select()
      .from(JobApplications)
      .where(eq(JobApplications.id, id))
      .limit(1);

    if (!existingApplication) {
      res.status(404).json({ message: "Job Application Not Found" });
      return;
    }
    await db.delete(JobApplications).where(eq(JobApplications.id, id));
    res.status(200).json({ message: "Job Application Deleted" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

const UpdateJobApplicationStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id && !status) {
    res.status(400).json({ message: "Application Id Or Status Is Missing" });
    return;
  }
  try {
    const [existingApplication] = await db
      .select()
      .from(JobApplications)
      .where(eq(JobApplications.id, id))
      .limit(1);

    if (!existingApplication) {
      res.status(404).json({ message: "Job Application Not Found" });
      return;
    }

    const data: any = {};
    if (status) data.status = status;

    await db
      .update(JobApplications)
      .set(data)
      .where(eq(JobApplications.id, id));

    res.status(200).json({ message: "Job Application updated Succecifully" });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export default {
  CreateJobApplication,
  GetAllJobApplicationsWithDetails,
  DeleteJobApplication,
  UpdateJobApplicationStatus,
  GetJobApplicationById,
};
