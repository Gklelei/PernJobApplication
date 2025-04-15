import { Request, Response } from "express";
import { supabase } from "..";
import { db } from "../drizzle/db";
import { users } from "../drizzle/db/schema";
import { eq } from "drizzle-orm";

const upload = async (file: Express.Multer.File) => {
  const uniqueFileName = `pdfs/${Date.now()}-${file.originalname}`;
  const { data, error } = await supabase.storage
    .from("south-rift") // ✅ replace with your bucket name
    .upload(uniqueFileName, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload Error:", error);
  }

  const { data: publicUrl } = supabase.storage
    .from("south-rift")
    .getPublicUrl(uniqueFileName);

  return {
    publicUrl: publicUrl.publicUrl,
    path: data?.path,
  };
};

const UploadAndUpdateCv = async (req: Request, res: Response) => {
  try {
    console.log(req.userId);
    const cvUrl = await upload(req.file as Express.Multer.File);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId))
      .limit(1);

    if (!user) {
      res.status(401).json({ message: "UnAuthorized" });
      return;
    }

    await db
      .update(users)
      .set({
        cvUrl: cvUrl.publicUrl,
      })
      .where(eq(users.id, req.userId));
    res.status(200).json({ message: "Cv Uploaded Succecifully" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
const UploadAndUpdateCoverLetter = async (req: Request, res: Response) => {
  try {
    const coverLetterUrl = await upload(req.file as Express.Multer.File);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId))
      .limit(1);

    if (!user) {
      res.status(401).json({ message: "UnAuthorized" });
      return;
    }

    await db
      .update(users)
      .set({
        coverLetterUrl: coverLetterUrl.publicUrl,
      })
      .where(eq(users.id, req.userId));
    res.status(200).json({ message: "Cover Letter Uploaded Succecifully" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
const UploadAndUpdateProfileImage = async (req: Request, res: Response) => {
  try {
    const imageUrl = await upload(req.file as Express.Multer.File);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId))
      .limit(1);

    if (!user) {
      res.status(401).json({ message: "UnAuthorized" });
      return;
    }

    await db
      .update(users)
      .set({
        imageUrl: imageUrl.publicUrl,
      })
      .where(eq(users.id, req.userId));
    res.status(200).json({ message: "Profile Image Uploaded Succecifully" });
    return;
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default {
  UploadAndUpdateCv,
  UploadAndUpdateCoverLetter,
  UploadAndUpdateProfileImage,
};
