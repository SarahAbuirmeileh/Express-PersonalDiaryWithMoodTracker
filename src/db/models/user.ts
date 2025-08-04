import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String,
        required: false,
    },
    diaries: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Diary',
        }
    ],
    customMoodEmojis: {
        type: Map,
        of: String,
        default: () => ({
            delighted: "face-grin-hearts",
            happy: "face-smile-beam",
            neutral: "face-smile",
            sad: "face-frown",
            miserable: "face-sad-cry",
        }),
        require: false,
    },
});

const User = mongoose.model('User', UserSchema);

export default User;