import mongoose from "mongoose";

const MoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    emoji: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
});

const mood = mongoose.model('mood', MoodSchema);

export default mood;