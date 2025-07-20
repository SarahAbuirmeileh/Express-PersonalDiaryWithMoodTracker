import Quote from "../db/models/quote";
import { CustomError } from "../utils/CustomError.js";
import { NSQuote } from "../@types/quote.type.js";

const getAllQuotes = async () => {
  try {
    const quotes = await Quote.find({});
    return quotes.map((q) => q.toObject());
  } catch (err) {
    console.error("Error fetching quotes:", err);
    throw new CustomError("Error fetching quotes", 500);
  }
};

const createQuote = async (payload: NSQuote.IQuote) => {
  try {
    const newQuote = new Quote(payload);
    await newQuote.save();
    return newQuote.toObject();
  } catch (err) {
    console.error("Error creating quote:", err);
    throw new CustomError("Error creating quote", 500);
  }
};

export { getAllQuotes, createQuote };
