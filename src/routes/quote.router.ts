import express from "express";
import { getAllQuotes, createQuote } from "../controllers/quote.controller.js";
import { NSQuote } from "../@types/quote.type.js";

const router = express.Router();

// Create API endpoints for managing motivational quotes:
// POST /quotes: Add a new quote (text, author).
// GET /quotes: Retrieve list of quotes (pagination optional).
// PUT /quotes/:id: Edit a quote.
// DELETE /quotes/:id: Delete a quote.

router.get("/quotes", async (req: express.Request, res: express.Response) => {
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

router.post("/quotes", async (req: express.Request, res: express.Response) => {
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
});
