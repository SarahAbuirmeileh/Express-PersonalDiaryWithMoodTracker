import mongoose from "mongoose";

const QuoteBackgroundColorSchema = new mongoose.Schema({
  backgroundColor: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
    enum: ["green", "purple"],
  },
});

const QuoteBackgroundColor = mongoose.model(
  "QuoteBackgroundColor",
  QuoteBackgroundColorSchema
);

export default QuoteBackgroundColor;
