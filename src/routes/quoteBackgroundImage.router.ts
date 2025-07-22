// Add endpoints to manage quote background images:
// POST /quote-bg-image: Upload or link a background image.
// GET /quote-bg-image: Get list of images.
// PUT /quote-bg-image/:id: Update image link.
// DELETE /quote-bg-image/:id: Delete image.
import express from "express";
import {
  getAllQuoteBgImages,
  createQuoteBgImage,
} from "../controllers/quoteBackgroundImage.controller.js";
import { authenticate } from "../middlewares/auth/authenticate.js";
import { validateBgImageCreation } from "../middlewares/validation/quoteBackgroundImage.js";

const router = express.Router();

router.get(
  "/quote-bg-image",
  async (req: express.Request, res: express.Response) => {
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
  }
);

router.post(
  "/quote-bg-image",
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
