import express from "express";
import {
  getAllQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
} from "../controllers/quote.controller.js";
import { NSQuote } from "../@types/quote.type.js";
import {
  validateQutoeCreation,
  validateQutoeUpdate,
  validateQuoteDeletion,
} from "../middlewares/validation/quote.js";
import { authenticate } from "../middlewares/auth/authenticate.js";

const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const quotes = await getAllQuotes();
    res.status(200).json({
      message: "Quotes fetched successfully!",
      data: quotes,
    });
  } catch (err) {
    console.error("Error fetching quotes:", err);
    res.status(500).json({
      message: "Failed to fetch quotes",
      error: "Internal Server Error",
    });
  }
});

router.post(
  "/",
  authenticate,
  validateQutoeCreation,
  async (req: express.Request, res: express.Response) => {
    try {
      const payload = req.body as NSQuote.IQuote;
      const quote = await createQuote(payload);
      const { __v, ...data } = quote;

      res.status(201).json({
        message: "Quote added successfully!",
        data: data,
      });
    } catch (err) {
      console.error("Error in adding quote:", err);
      res.status(500).json({
        message: "Failed to add quote",
        error: "Internal Server Error",
      });
    }
  }
);

router.put(
  "/:id",
  authenticate,
  validateQutoeUpdate,
  (req: NSQuote.IQuoteUpdateRequest, res: express.Response) => {
    updateQuote({ ...req.body, id: req.params.id })
      .then((data) => {
        res.status(200).send({
          message: "Quote updated successfully!",
          data: data,
        });
      })
      .catch((err) => {
        console.error("Error in updating Quote: ", err);
        res.status(500).send({
          message: "Failed to update quote",
          error: "Internal Server Error",
        });
      });
  }
);

router.delete(
  "/:id",
  authenticate,
  validateQuoteDeletion,
  (req: express.Request, res: express.Response) => {
    const id = req.params.id;

    deleteQuote(id)
      .then(() => {
        res.status(200).send({
          message: "Quote deleted successfully!",
        });
      })
      .catch((err) => {
        console.error("Error in deleting quote: ", err);
        res.status(500).send({
          message: "Failed to delete quote",
          error: "Internal Server Error",
        });
      });
  }
);

export default router;
