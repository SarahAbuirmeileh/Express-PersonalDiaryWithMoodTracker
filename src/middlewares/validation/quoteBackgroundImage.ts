import express from "express";
import mongoose from "mongoose";
import { QuoteBackgroundImage } from "../../db/index.js";

const validateBgImageCreation = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { backgroundImage } = req.body;

  if (!backgroundImage) {
    res.status(400).json({
      message: "Invalid request",
      error: "backgroundImage is required ",
    });
    return;
  }

  if (typeof backgroundImage !== "string") {
    res.status(400).json({
      message: "Invalid request",
      error: "backgroundImage must be a string",
    });
    return;
  }

  next();
};

const validateBgImageUpdate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  const { backgroundImage } = req.body;

  const isValidId = mongoose.Types.ObjectId.isValid(id);
  const image = isValidId ? await QuoteBackgroundImage.findById(id) : null;

  if (!image) {
    return res.status(404).json({
      message: "Updating background image failed",
      error: "Background image not found.",
    });
  }
  if (!backgroundImage) {
    res.status(400).json({
      message: "Invalid request",
      error: "backgroundImage is required ",
    });
    return;
  }

  if (typeof backgroundImage !== "string") {
    res.status(400).json({
      message: "Invalid request",
      error: "backgroundImage must be a string",
    });
    return;
  }

  next();
};

export { validateBgImageCreation, validateBgImageUpdate };
