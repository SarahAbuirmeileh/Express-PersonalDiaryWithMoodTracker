import express from "express";

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
      error: "backgroundImage  must be a string",
    });
    return;
  }

  next();
};

export { validateBgImageCreation };
