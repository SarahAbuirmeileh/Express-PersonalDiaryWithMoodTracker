import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
    },
});

const Quote = mongoose.model('Quote', QuoteSchema);

export default Quote;