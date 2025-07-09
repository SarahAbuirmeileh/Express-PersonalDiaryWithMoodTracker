import mongoose, { Schema } from "mongoose";

const DiarySchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    title: {
        type: String,
        required: false,
    },
    notes: {
        type: [String],
        required: false,
    },
    images: {
        type: [String],
        required: false,
    },
    voices: {
        type: [String],
        required: false,
    },
    mood: {
        type: Number,
        required: false,
        default: 2, // neutral
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: 'tag',
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
});

const Diary = mongoose.model('Diary', DiarySchema);

export default Diary;
