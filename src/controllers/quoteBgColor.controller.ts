import QuoteBackgroundColor from "../db/models/quoteBackgroundColor.js";
import { CustomError } from "../utils/CustomError.js";
import { NSQuoteColor } from "../@types/quoteColor.types.js";

const addColor = async (payload: NSQuoteColor.IQuoteColorPayload) => {
  try {
    if (!payload.backgroundColor || !payload.theme) {
      throw new CustomError("Both backgroundColor and theme are required", 400);
    }

    const newColor = new QuoteBackgroundColor(payload);
    await newColor.save();

    return newColor.toObject();
  } catch (err) {
    console.error("Error adding color:", err);
    if (err instanceof CustomError) throw err;
    throw new CustomError("Failed to add color", 500);
  }
};

const listColors = async () => {
  try {
    const colors = await QuoteBackgroundColor.find();
    return colors;
  } catch (err) {
    console.error("Error listing colors:", err);
    if (err instanceof CustomError) throw err;
    throw new CustomError("Failed to fetch colors", 500);
  }
};

const updateColor = async (
  id: string,
  data: NSQuoteColor.IQuoteColorUpdate
) => {
  try {
    const updatedColor = await QuoteBackgroundColor.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedColor) {
      throw new CustomError("Color not found", 404);
    }

    return updatedColor.toObject();
  } catch (err) {
    console.error("Error updating color:", err);
    if (err instanceof CustomError) throw err;
    throw new CustomError("Failed to update color", 500);
  }
};

const deleteColor = async (id: string) => {
  try {
    const deleted = await QuoteBackgroundColor.findByIdAndDelete(id);
    if (!deleted) {
      throw new CustomError("Color not found", 404);
    }
  } catch (err) {
    console.error("Error deleting color:", err);
    if (err instanceof CustomError) throw err;
    throw new CustomError("Failed to delete color", 500);
  }
};

export { addColor, listColors, updateColor, deleteColor };
