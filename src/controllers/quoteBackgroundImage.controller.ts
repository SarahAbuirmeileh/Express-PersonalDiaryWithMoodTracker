import QuoteBackgroundImage from "../db/models/quoteBackgroundImage.js";
import { CustomError } from "../utils/CustomError.js";

const getAllQuoteBgImages = async () => {
  try {
    const images = await QuoteBackgroundImage.find({});
    return images.map((img) => img.toObject());
  } catch (err) {
    console.error("Error fetching background images:", err);
    throw new CustomError("Error fetching background images", 500);
  }
};

const createQuoteBgImage = async (imageUrl: string) => {
  try {
    const image = new QuoteBackgroundImage({ backgroundImage: imageUrl });
    await image.save();
    return image.toObject();
  } catch (err) {
    console.error("Error creating background image:", err);
    throw new CustomError("Error creating background image", 500);
  }
};

const updateQuoteBgImage = async (id: string, newUrl: string) => {
  try {
    const image = await QuoteBackgroundImage.findById(id);
    if (!image) throw new CustomError("Background image not found", 404);

    image.backgroundImage = newUrl;
    await image.save();
    return image.toObject();
  } catch (err) {
    console.error("Error updating background image:", err);
    throw new CustomError("Error updating background image", 500);
  }
};

const deleteQuoteBgImage = async (id: string) => {
  try {
    const result = await QuoteBackgroundImage.findByIdAndDelete(id);
    if (!result) throw new CustomError("Background image not found", 404);
  } catch (err) {
    console.error("Error deleting background image:", err);
    throw new CustomError("Error deleting background image", 500);
  }
};

export {
  getAllQuoteBgImages,
  createQuoteBgImage,
  updateQuoteBgImage,
  deleteQuoteBgImage,
};
