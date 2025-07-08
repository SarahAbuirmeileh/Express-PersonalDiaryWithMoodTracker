import mongoose, { Schema } from "mongoose";

const TagSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    emoji: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['global', 'custom'],
        default: 'global',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: function (this: any) {
            return this.type === 'custom';
        },
    },
});

const Tag = mongoose.model('Tag', TagSchema);

export default Tag;