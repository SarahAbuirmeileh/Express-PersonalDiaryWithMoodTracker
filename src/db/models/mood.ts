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

const Mood = mongoose.model('Mood', MoodSchema);

export default Mood;