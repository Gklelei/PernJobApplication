// USER REGISTRATION CONTROLLER

import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { db } from "../drizzle/db";
import { users } from "../drizzle/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const UserRegistration = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      res.status(400).json({ message: "User with email already exists" });
      return;
    }

    const hashedPassword = await hash(password, 10);

    await db.insert(users).values({
      email,
      firstName,
      password: hashedPassword,
      lastName,
      role,
    });

    res.status(201).json({ message: "User registered successfully" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const UserLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      res.status(404).json({ message: "User with email does not exist" });
      return;
    }

    const isPwd = await compare(password, user.password);

    if (!isPwd) {
      res.status(500).json({ message: "Invalid Credentials" });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("Bearer", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });
    res.status(200).json({ message: "User logged in successfully" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server Error" });
  }
};

export default {
  UserRegistration,
  UserLogin,
};
