import mongoose, { Schema } from "mongoose";

const Diarieschema = new Schema({
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
    audios: {
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
            ref: 'Tag',
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const Diary = mongoose.model('Diary', Diarieschema);

export default Diary;
