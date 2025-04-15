import { Request, Response } from "express";
import { db } from "../drizzle/db";
import { users } from "../drizzle/db/schema";
import { eq } from "drizzle-orm";

interface updateType {
  role: "admin" | "user";
}

export const UpdateUserProfile = async (req: Request, res: Response) => {
  const { role, id, firstName, lastName, gender } = req.body;
  const userRole = req.role;
  const requesterId = req.userId;

  // Determine which user's data we're updating
  const targetUserId = userRole === "admin" ? id : requesterId;

  // Validate inputs
  if (userRole === "admin") {
    if (!role || !id) {
      res
        .status(400)
        .json({ message: "Role and user ID are required for admin updates." });
      return;
    }
  } else {
    if (!firstName && !lastName && !gender) {
      res.status(400).json({
        message:
          "At least one field (first name, last name, gender) must be provided.",
      });
      return;
    }
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const dataToUpdate: Partial<typeof user> = {};

    // Admins can update roles (and optionally names/gender)
    if (userRole === "admin" && role) {
      dataToUpdate.role = role;
    }

    // Anyone (including admins) can update basic profile fields
    if (firstName) dataToUpdate.firstName = firstName;
    if (lastName) dataToUpdate.lastName = lastName;
    if (gender) dataToUpdate.gender = gender;

    // Only update if there's something to update
    if (Object.keys(dataToUpdate).length === 0) {
      res.status(400).json({ message: "No valid fields provided for update." });
      return;
    }

    await db.update(users).set(dataToUpdate).where(eq(users.id, targetUserId));

    res.status(200).json({ message: "User updated successfully." });
    return;
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

const DeleteUserProfile = async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ message: "All Fields are required" });
    return;
  }
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    await db.delete(users).where(eq(users.id, id));

    res.status(200).json({ message: "Account Deleted Succecifully" });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const GetLoggedInUser = async (req: Request, res: Response) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role,
        gender: users.gender,
        imageUrl: users.imageUrl,
        cvUrl: users.cvUrl,
        coverLetterUrl: users.coverLetterUrl,
        plan: users.plan,
        applications: users.applications,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, req.userId))
      .limit(1);
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default {
  DeleteUserProfile,
  GetLoggedInUser,
  UpdateUserProfile,
};
