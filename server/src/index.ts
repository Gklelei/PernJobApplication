import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoutes from "./routes/AuthRoutes";
import UsersRoutes from "./routes/UsersRoutes";
import JobPostingRoutes from "./routes/JobPostingRoutes";
import userProfile from "./routes/userProfile";
import JobApplicationRoutes from "./routes/JobApplicationRoutes";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { v2 as cloudinary } from "cloudinary";
import UploadsRoutes from "./routes/UploadsRoutes";
import { createClient } from "@supabase/supabase-js";

// EXPRESS INITIALIZER
const app = express();
// PORT DEF
const PORT = process.env.PORT || 3030;

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// MIDDLEWARES
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());

// HEALTH CHECKER
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("Healthy");
});

// ROUTES
// AUTH ROUTES
app.use("/api/auth", AuthRoutes);
// USER PROFILE ROUTES
app.use("/api/profile", userProfile);
// JOB POSTING ROUTES
app.use("/api/job", JobPostingRoutes);
// IMAGES/FILES UPLOADS
// USERS ROUTE
app.use("/api/users", UsersRoutes);

app.use("/api/uploads", UploadsRoutes);

// JOB POSTING APPLICATION ROUTES
app.use("/api/application", JobApplicationRoutes);
// PORT LISTENER

export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
