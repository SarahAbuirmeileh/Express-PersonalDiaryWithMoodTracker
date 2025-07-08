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

const quote = mongoose.model('quote', QuoteSchema);

export default quote;