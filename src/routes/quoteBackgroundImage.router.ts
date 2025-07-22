import express from "express";
import {
  getAllQuoteBgImages,
  createQuoteBgImage,
  updateQuoteBgImage,
  deleteQuoteBgImage,
} from "../controllers/quoteBackgroundImage.controller.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import {
  validateBgImageCreation,
  validateBgImageUpdate,
  validateBgImageDeletion,
} from "../middlewares/validation/quoteBackgroundImage.js";

const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const images = await getAllQuoteBgImages();
    res.status(200).json({
      message: "Background images fetched successfully",
      data: images,
    });
  } catch (err) {
    console.error("Error fetching background images:", err);
    res.status(500).json({
      message: "Failed to fetch background images",
      error: "Internal Server Error",
    });
  }
});

router.post(
  "/",
  authenticate,
  validateBgImageCreation,
  async (req: express.Request, res: express.Response) => {
    try {
      const { backgroundImage } = req.body;
      const newImage = await createQuoteBgImage(backgroundImage);
      const { __v, ...data } = newImage;

      res.status(201).json({
        message: "Background image added successfully!",
        data: data,
      });
    } catch (err) {
      console.error("Error adding background image:", err);
      res.status(500).json({
        message: "Failed to add background image",
        error: "Internal Server Error",
      });
    }
  }
);

router.put(
  "/:id",
  authenticate,
  validateBgImageUpdate,
  async (req: express.Request, res: express.Response) => {
    try {
      const { backgroundImage } = req.body;
      const id = req.params.id;

      const updated = await updateQuoteBgImage(id, backgroundImage);
      const { __v, ...data } = updated;

      res.status(200).json({
        message: "Background image updated successfully!",
        data: data,
      });
    } catch (err) {
      console.error("Error updating background image:", err);
      res.status(500).json({
        message: "Failed to update background image",
        error: "Internal Server Error",
      });
    }
  }
);

router.delete(
  "/:id",
  authenticate,
  validateBgImageDeletion,
  async (req, res) => {
    try {
      const id = req.params.id;
      await deleteQuoteBgImage(id);

      res.status(200).json({
        message: "Background image deleted successfully!",
      });
    } catch (err) {
      console.error("Error deleting background image:", err);
      res.status(500).json({
        message: "Failed to delete background image",
        error: "Internal Server Error",
      });
    }
  }
);
export default router;
