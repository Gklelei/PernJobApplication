import { Request, Response } from "express";
import { JobPosting } from "../drizzle/db/schema";
import { db } from "../drizzle/db";
import { eq } from "drizzle-orm";

const createJobPosting = async (req: Request, res: Response) => {
  const userRole = req.role;
  console.log({ userRole });
  if (userRole !== "admin") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const {
    title,
    description,
    location,
    status,
    requirements,
    responsibilities,
    qualifications,
    skills,
    department,
    type,
    experience,
    salary,
    deadline,
  } = req.body;

  if (
    !title ||
    !description ||
    !location ||
    !status ||
    !requirements ||
    !responsibilities ||
    !qualifications ||
    !skills ||
    !department ||
    !type ||
    !experience ||
    !salary ||
    !deadline
  ) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    await db.insert(JobPosting).values({
      deadline: new Date(deadline),
      department,
      description,
      experience,
      qualifications,
      requirements,
      responsibilities,
      salary,
      skills,
      title,
      type,
      location,
      status,
    });
    res.status(201).json({ message: "Job posting created Succecifluy" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

const AllJobPostings = async (req: Request, res: Response) => {
  try {
    const Jobs = await db.select().from(JobPosting);
    res.status(200).json({ data: Jobs });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

const GetJobPostingById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(404).json({ message: "Job posting id is required" });
    return;
  }
  try {
    const [jobPosting] = await db
      .select()
      .from(JobPosting)
      .where(eq(JobPosting.id, id))
      .limit(1);

    if (!jobPosting) {
      res.status(404).json({ message: "Job posting not found" });
      return;
    }
    res.status(200).json({ data: jobPosting });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const UpdateJobPosting = async (req: Request, res: Response) => {
  const userRole = req.role;
  console.log({ userRole });
  if (userRole !== "admin") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { id } = req.params;

  if (!id) {
    res.status(404).json({ message: "Job posting id is required" });
    return;
  }
  const {
    title,
    description,
    location,
    status,
    requirements,
    responsibilities,
    qualifications,
    skills,
    department,
    type,
    experience,
    salary,
    deadline,
  } = req.body;

  if (
    !title &&
    !description &&
    !location &&
    !status &&
    !requirements &&
    !responsibilities &&
    !qualifications &&
    !skills &&
    !department &&
    !type &&
    !experience &&
    !salary &&
    !deadline
  ) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const updateData: any = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (location) updateData.location = location;
    if (status) updateData.status = status;
    if (requirements) updateData.requirements = requirements;
    if (responsibilities) updateData.responsibilities = responsibilities;
    if (qualifications) updateData.qualifications = qualifications;
    if (skills) updateData.skills = skills;
    if (department) updateData.department = department;
    if (type) updateData.type = type;
    if (experience) updateData.experience = experience;
    if (salary) updateData.salary = salary;
    if (deadline) {
      const parsedDeadline = new Date(deadline);
      if (isNaN(parsedDeadline.getTime())) {
        res.status(400).json({ message: "Invalid deadline format" });
        return;
      }
      updateData.deadline = parsedDeadline;
    }
    await db.update(JobPosting).set(updateData).where(eq(JobPosting.id, id));

    res.status(200).json({ message: "Job posting updated successfully" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server Error" });
  }
};

const DeleteJobPosting = async (req: Request, res: Response) => {
  const userRole = req.role;
  console.log({ userRole });
  if (userRole !== "admin") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const { id } = req.params;

  if (!id) {
    res.status(404).json({ message: "Job posting id is required" });
    return;
  }

  try {
    await db.delete(JobPosting).where(eq(JobPosting.id, id));
    res.status(200).json({ message: "Job posting deleted successfully" });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createJobPosting,
  AllJobPostings,
  GetJobPostingById,
  UpdateJobPosting,
  DeleteJobPosting,
};
