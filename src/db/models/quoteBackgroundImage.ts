import mongoose from "mongoose";

const QuoteBackgroundImageSchema = new mongoose.Schema({
    backgroundImage: {
        type: String,
        required: true
    }
});

const quoteBackgroundImage = mongoose.model('quoteBackgroundImage', QuoteBackgroundImageSchema);

export default quoteBackgroundImage;