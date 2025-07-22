// Add endpoints to manage quote background images:
// POST /quote-bg-image: Upload or link a background image.
// GET /quote-bg-image: Get list of images.
// PUT /quote-bg-image/:id: Update image link.
// DELETE /quote-bg-image/:id: Delete image.
import express from "express";
import { getAllQuoteBgImages } from "../controllers/quoteBackgroundImage.controller.js";

const router = express.Router();

router.get("/quote-bg-image", async (req, res) => {
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
