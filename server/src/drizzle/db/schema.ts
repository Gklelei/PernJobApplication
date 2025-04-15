import {
  mysqlEnum,
  mysqlTable,
  varchar,
  text,
  timestamp,
  int,
} from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";

export const ROLES = mysqlEnum("user_roles", ["user", "admin"]);

export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .unique()
    .$default(() => randomUUID()),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: text({ enum: ["user", "admin"] })
    .default("user")
    .notNull(),

  //  OPTIONAL FIELDS TO BE UPDATED VIA THE USERPROFILE PAGE

  gender: varchar("gender", { length: 255, enum: ["male", "female"] }),
  imageUrl: varchar("image_url", { length: 255 }),
  cvUrl: varchar("cv_url", { length: 255 }),
  coverLetterUrl: varchar("cover_letter_url", { length: 255 }),
  plan: varchar("plan", { length: 255, enum: ["free", "premium"] }).default(
    "free"
  ),
  applications: int("applications").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const JobPosting = mysqlTable("job_posting", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .unique()
    .$default(() => randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  location: text("location", { enum: ["remote", "onsite"] }).default("onsite"),
  status: text("status", { enum: ["open", "closed", "paused"] }).default(
    "open"
  ),
  requirements: text("requirements").notNull(),
  responsibilities: text("responsibilities").notNull(),
  qualifications: text("qualifications").notNull(),
  skills: text("skills").notNull(),
  department: varchar("department", {
    length: 255,
    enum: [
      "cardiology",
      "emergency",
      "pediatrics",
      "radiology",
      "oncology",
      "orthopedics",
      "gynecology",
      "obstetrics",
      "neurology",
      "urology",
      "gastroenterology",
      "dermatology",
      "psychiatry",
      "surgery",
      "internal_medicine",
      "ophthalmology",
      "anesthesiology",
      "pathology",
      "nephrology",
      "pulmonology",
      "pharmacy",
      "nutrition",
      "dentistry",
      "physiotherapy",
      "ent",
      "admin",
      "laboratory",
      "it_support",
      "maintenance",
      "cleaning",
      "records",
      "billing",
    ],
  }).notNull(),
  type: text("type", {
    enum: ["full-time", "part-time", "contract", "locum"],
  }).notNull(),
  experience: varchar("experience", {
    length: 255,
    enum: ["intern", "entry", "mid", "senior", "lead"],
  }).notNull(),
  salary: varchar("salary", { length: 255 }).notNull(),
  deadline: timestamp("deadline").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const JobApplications = mysqlTable("job_applications", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$default(() => randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  jobId: varchar("job_id", { length: 255 })
    .references(() => JobPosting.id, { onDelete: "cascade" })
    .notNull(),
  status: varchar("status", {
    length: 255,
    enum: ["Applied", "Interview", "Screening", "Rejected", "Accepted"],
  }).default("Accepted"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// export const Uploads = mysqlTable("uploads", {
//   id: varchar("id", { length: 255 })
//     .primaryKey()
//     .$default(() => randomUUID()),
//   cv: bytea,
// });
