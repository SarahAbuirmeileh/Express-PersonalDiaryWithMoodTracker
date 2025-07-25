import Tag from '../db/models/tag.js';
import { CustomError } from '../utils/CustomError.js';
import { NSTag } from '../@types/tag.type.js';
import mongoose from 'mongoose';

const createTag = async (payload: NSTag.ITag) => {
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

const updateTag = async (payload: NSTag.IEditTag) => {
    try {
        let tag = await Tag.findOne({ _id: payload.id });

        if (tag) {
            tag.name = payload.name ?? tag.name;
            tag.emoji = payload.emoji ?? tag.emoji;
            tag.type = payload.type ?? tag.type;
            if (tag.user && payload.type === 'global') {
                const id = new mongoose.Types.ObjectId(tag.user);
                tag.user = id;
            }

            await tag.save();

            const tagData = tag.toObject();
            return tagData;
        }
    } catch (err) {
        const error = new CustomError('Error updating tag', 500);
        console.error("Error updating tag: ", err);

        throw error;
    }
}

const deleteTag = async (tagId: string) => {
    try {
        const tag = await Tag.findOneAndDelete({ _id: tagId });
    } catch (err) {

        const error = new CustomError('Error deleting tag', 500);
        console.error("Error deleting tag: ", err);

        throw error;
    }
}

const getTagsForUser = async (userId: string) => {
    try {
        const tags = await Tag.find({
            $or: [
            { type: 'global' },
            {  user: userId , type: 'custom' }
            ]
        });
        return tags.map(tag => tag.toObject());
        
    } catch (err) {

        const error = new CustomError('Error fetching tags for user', 500);
        console.error("Error fetching tags for user: ", err);   

        throw error;
    }
}

export {
    createTag,
    updateTag,
    deleteTag,
    getTagsForUser
}