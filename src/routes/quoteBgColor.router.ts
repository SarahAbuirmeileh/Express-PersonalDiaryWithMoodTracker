import express from "express";
import {
  addColor,
  listColors,
  updateColor,
  deleteColor,
} from "../controllers/quoteBgColor.controller.js";
import { authenticate } from "../middlewares/auth/authenticate.js";

const router = express.Router();

router.post("/", authenticate, (req: express.Request, res: express.Response) => {
  addColor(req.body)
    .then((color) => {
      res.status(201).send({
        message: "Color added successfully!",
        data: color,
      });
    })
    .catch((err: any) => {
      console.error("Error adding color:", err);
      const status = err.status || 500;
      const errorMessage =
        status === 500 ? "Internal server error" : err.message || "Failed to add color";
      res.status(status).send({
        message: "Failed to add color",
        error: errorMessage,
      });
    });
});

router.get("/", (req: express.Request, res: express.Response) => {
  listColors()
    .then((colors) => {
      res.status(200).send({
        message: "Colors fetched successfully!",
        data: colors,
      });
    })
    .catch((err: any) => {
      console.error("Error listing colors:", err);
      const status = err.status || 500;
      const errorMessage =
        status === 500 ? "Internal server error" : err.message || "Failed to fetch colors";
      res.status(status).send({
        message: "Failed to fetch colors",
        error: errorMessage,
      });
    });
});

router.put("/:id", authenticate, (req: express.Request, res: express.Response) => {
  updateColor(req.params.id, req.body)
    .then((color) => {
      res.status(200).send({
        message: "Color updated successfully!",
        data: color,
      });
    })
    .catch((err: any) => {
      console.error("Error updating color:", err);
      const status = err.status || 500;
      const errorMessage =
        status === 500 ? "Internal server error" : err.message || "Failed to update color";
      res.status(status).send({
        message: "Failed to update color",
        error: errorMessage,
      });
    });
});

router.delete("/:id", authenticate, (req: express.Request, res: express.Response) => {
  deleteColor(req.params.id)
    .then(() => {
      res.status(200).send({
        message: "Color deleted successfully!",
      });
    })
    .catch((err: any) => {
      console.error("Error deleting color:", err);
      const status = err.status || 500;
      const errorMessage =
        status === 500 ? "Internal server error" : err.message || "Failed to delete color";
      res.status(status).send({
        message: "Failed to delete color",
        error: errorMessage,
      });
    });
});

export default router;
