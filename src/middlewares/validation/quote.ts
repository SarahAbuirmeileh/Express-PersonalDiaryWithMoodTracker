import express from "express";

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

export { validateQutoeCreation };
