import mongoose from "mongoose";

const QuoteBackgroundImageSchema = new mongoose.Schema({
    backgroundImage: {
        type: String,
        required: true
    }
});

const QuoteBackgroundImage = mongoose.model('QuoteBackgroundImage', QuoteBackgroundImageSchema);

export default QuoteBackgroundImage;