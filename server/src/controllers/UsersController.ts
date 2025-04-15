import { Request, Response } from "express";
import { db } from "../drizzle/db";
import { JobApplications, JobPosting, users } from "../drizzle/db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";

const GetAllUsers = async (req: Request, res: Response) => {
  try {
    const role = req.role;
    if (role !== "admin") {
      res.status(401).json({ message: "UnAuthorized" });
      return;
    }
    const AllUsers = await db.select().from(users);

    res.status(200).json({ data: AllUsers });
    return;
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const GetUsersJobApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const applications = await db
      .select({
        id: JobApplications.id,
        title: JobPosting.title,
        department: JobPosting.department,
        appliedDate: JobApplications.createdAt,
        type: JobPosting.type,
        status: JobApplications.status,
        cv: users.cvUrl,
        coverLetter: users.coverLetterUrl,
        jobDescription: JobPosting.description,
        skills: JobPosting.skills,
        sallary: JobPosting.salary,
        qualifications: JobPosting.qualifications,
      })
      .from(JobApplications)
      .innerJoin(JobPosting, eq(JobApplications.jobId, JobPosting.id))
      .innerJoin(users, eq(JobApplications.userId, users.id))
      .where(eq(JobApplications.userId, userId));

    res.status(200).json({ data: applications });
    return;
  } catch (error) {
    console.error("Error fetching user job applications:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

const UserChangePassword = async (req: Request, res: Response) => {
  const { password, newPassword } = req.body;

  if (!password && !newPassword) {
    res.status(400).json({ message: "Password & New Password is required" });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ message: "UnAuthorized!" });
      return;
    }

    const isOldPwdMatch = await compare(password, user.password);
    if (!isOldPwdMatch) {
      res.status(400).json({ message: "The current password do not match" });
      return;
    }
    const pwdHash = await hash(newPassword, 10);

    await db
      .update(users)
      .set({
        ...user,
        password: pwdHash,
      })
      .where(eq(users.id, user.id));
    res.status(201).json({ message: "Password Upadted" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server Error" });
    return;
  }
};

const AdminUserChangePassword = async (req: Request, res: Response) => {
  const { userId, password, newPassword } = req.body;
  const role = req.role;
  const requesterId = req.userId; // the logged-in user's ID

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required." });
  }

  const targetUserId = role === "admin" ? userId : requesterId;

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (role !== "admin") {
      // Regular users must verify their current password
      if (!password) {
        return res
          .status(400)
          .json({ message: "Current password is required." });
      }

      const isMatch = await compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "The current password is incorrect." });
      }
    }

    const hashedPwd = await hash(newPassword, 10);

    await db
      .update(users)
      .set({
        ...user,
        password: hashedPwd,
      })
      .where(eq(users.id, targetUserId));

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default {
  GetAllUsers,
  GetUsersJobApplications,
  UserChangePassword,
  AdminUserChangePassword,
};
