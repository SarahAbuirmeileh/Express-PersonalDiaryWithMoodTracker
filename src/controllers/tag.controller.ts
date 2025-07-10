import { NSTracker } from '../@types/user.types.js';
import Tag from '../db/models/tag.js';
import { CustomError } from '../utils/CustomError.js';

const createTag = async (payload: NSTracker.ITag) => {
    try {

        const existingTag = await Tag.findOne({ name: payload.name });
        if (existingTag) {
            const error = new CustomError('Tag already exists', 400);
            throw error;
        }

        const newTag = new Tag(payload);
        await newTag.save();

        const tagData = newTag.toObject();
        return tagData;

    } catch (err) {
        const error: any = new CustomError('Error creating tag', 500);
        console.error("Error creating tag: ", err);
        
        throw error;
    }
};

export{
    createTag,
}