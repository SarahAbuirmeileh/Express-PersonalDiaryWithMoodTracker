import QuoteBackgroundImage from "../db/models/quoteBackgroundImage";
import { CustomError } from "../utils/CustomError";

const getAllQuoteBgImages = async () => {
  try {
    const images = await QuoteBackgroundImage.find({});
    return images.map((img) => img.toObject());
  } catch (err) {
    console.error("Error fetching background images:", err);
    throw new CustomError("Error fetching background images", 500);
  }
};

export { getAllQuoteBgImages };
