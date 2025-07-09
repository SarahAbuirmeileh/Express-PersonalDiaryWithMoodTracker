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
            ref: 'diary',
        }
    ],
});

const User = mongoose.model('User', UserSchema);

export default User;