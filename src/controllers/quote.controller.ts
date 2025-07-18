import Quote from "../db/models/quote";
import { CustomError } from "../utils/CustomError.js";

const getAllQuotes = async () => {
  try {
    const quotes = await Quote.find({});
    return quotes.map((q) => q.toObject());
  } catch (err) {
    console.error("Error fetching quotes:", err);
    throw new CustomError("Error fetching quotes", 500);
  }
};

export { getAllQuotes };
