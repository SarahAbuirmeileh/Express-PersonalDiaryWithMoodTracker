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

const QuoteBackgroundColor = mongoose.model('QuoteBackgroundColor', QuoteBackgroundColorSchema);

export default QuoteBackgroundColor;