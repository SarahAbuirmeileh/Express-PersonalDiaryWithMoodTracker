import express from "express";
import mongoose from "mongoose";
import { Quote } from "../../db/index.js";

const validateQutoeCreation = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const quote = req.body || {};
  const errorList: string[] = [];

  const requiredFields = ["text", "author"];
  requiredFields.forEach((field) => {
    if (!quote[field]) {
      errorList.push(`${field} is required.`);
    } else if (typeof quote[field] !== "string") {
      errorList.push(`${field} must be a string.`);
    }
  });
  if (errorList.length) {
    res.status(400).send({
      message: "Quote creation failed",
      error: errorList,
    });
  } else {
    next();
  }
};

const validateQutoeUpdate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const quoteData = req.body || {};
  const id = req.params.id;
  const isValid = mongoose.Types.ObjectId.isValid(id);
  const quote = isValid ? await Quote.findById(id) : null;

  if (!quote) {
    res.status(404).send({
      message: "Updating quote failed",
      error: "Quote not found.",
    });
    return;
  }
  const errorList: string[] = [];
  const fieldsToValidate = ["text", "author"];
  const hasAtLeastOneField = fieldsToValidate.some(
    (field) => field in quoteData
  );

  if (!hasAtLeastOneField) {
    res.status(400).send({
      message: "Updating quote failed",
      error: "At least one of 'text' or 'author' must be provided.",
    });
    return;
  }

  fieldsToValidate.forEach((field) => {
    if (field in quoteData) {
      if (typeof quoteData[field] !== "string") {
        errorList.push(`${field} must be a string.`);
      }
    }
  });

  if (errorList.length) {
    res.status(400).send({
      message: "Updating quote failed",
      error: errorList,
    });
    return;
  }

  next();
};

const validateQuoteDeletion = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const id = req.params.id;
  const isValid = mongoose.Types.ObjectId.isValid(id);
  const quote = isValid ? await Quote.findById(id) : null;

  if (!quote) {
    res.status(404).send({
      message: "Deleting quote failed",
      error: "Quote not found.",
    });
  } else {
    next();
  }
};
export { validateQutoeCreation, validateQutoeUpdate, validateQuoteDeletion };
