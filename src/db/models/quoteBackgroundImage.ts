import mongoose from "mongoose";

const QuoteBackgroundImageSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
    enum: ["yellow", "green", "purple"],
  },
});

const QuoteBackgroundImage = mongoose.model(
  "QuoteBackgroundImage",
  QuoteBackgroundImageSchema
);

export default QuoteBackgroundImage;
