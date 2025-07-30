import Quote from "../db/models/quote.js";
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

const updateQuote = async (payload: NSQuote.IEditQuote) => {
  try {
    let quote = await Quote.findOne({ _id: payload.id });

    if (quote) {
      quote.text = payload.text ?? quote.text;
      quote.author = payload.author ?? quote.author;

      await quote.save();

      const quoteData = quote.toObject();
      return quoteData;
    } else {
      throw new CustomError("Quote not found", 404);
    }
  } catch (err) {
    const error = new CustomError("Error updating quote", 500);
    console.error("Error updating quote: ", err);
    throw error;
  }
};

const deleteQuote = async (quoteId: string) => {
  try {
    const quote = await Quote.findOneAndDelete({ _id: quoteId });
    if (!quote) {
      throw new CustomError("Quote not found", 404);
    }
  } catch (err) {
    console.error("Error deleting quote: ", err);
    throw new CustomError("Error deleting quote", 500);
  }
};

export { getAllQuotes, createQuote, updateQuote, deleteQuote };
