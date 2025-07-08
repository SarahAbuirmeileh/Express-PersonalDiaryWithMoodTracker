import mongoose from "mongoose";

const QuoteBackgroundColorSchema = new mongoose.Schema({
    backgroundColor: {
        type: String,
        required: true
    },
    textColor: {
        type: String,
        required: true,
    },
});

const quoteBackgroundColor = mongoose.model('quoteBackgroundColor', QuoteBackgroundColorSchema);

export default quoteBackgroundColor;