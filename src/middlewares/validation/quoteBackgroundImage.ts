import express from "express";
import mongoose from "mongoose";
import { QuoteBackgroundImage } from "../../db/index.js";

const allowedThemes = ["green", "purple"];

const validateBgImageCreation = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { backgroundImage, theme } = req.body;

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
  if (!theme) {
    res.status(400).json({
      message: "Invalid request",
      error: "theme is required ",
    });
    return;
  }
  if (!allowedThemes.includes(theme)) {
    res.status(400).json({
      message: "Invalid request",
      error: `theme must be one of: ${allowedThemes.join(
        ", "
      )}`,
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
  const { backgroundImage, theme } = req.body;

  const isValidId = mongoose.Types.ObjectId.isValid(id);
  const image = isValidId ? await QuoteBackgroundImage.findById(id) : null;

  if (!image) {
    res.status(404).json({
      message: "Updating background image failed",
      error: "Background image not found.",
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
  if (!allowedThemes.includes(theme)) {
    res.status(400).json({
      message: "Invalid request",
      error: `theme must be one of: ${allowedThemes.join(", ")}`,
    });
    return;;
  }

  next();
};

const validateBgImageDeletion = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  const image = isValidId ? await QuoteBackgroundImage.findById(id) : null;

  if (!image) {
    res.status(404).send({
      message: "Deleting background image failed",
      error: "background image  not found.",
    });
  } else {
    next();
  }
};

export {
  validateBgImageCreation,
  validateBgImageUpdate,
  validateBgImageDeletion,
};
