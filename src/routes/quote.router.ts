import express from "express";
import { getAllQuotes } from "../controllers/quote.controller.js";
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
