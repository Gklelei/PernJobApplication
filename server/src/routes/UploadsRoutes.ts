import express from "express";
import multer from "multer";
import UploadsController from "../controllers/UploadsController";
import verifyToken from "../middlewares/Auth";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

router.post(
  "/upload-cv",
  upload.single("file"),
  verifyToken,
  UploadsController.UploadAndUpdateCv
);
router.post(
  "/upload-cover-letter",
  upload.single("file"),
  verifyToken,
  UploadsController.UploadAndUpdateCoverLetter
);
router.post(
  "/upload-profile-image",
  upload.single("file"),
  verifyToken,
  UploadsController.UploadAndUpdateProfileImage
);

export default router;
