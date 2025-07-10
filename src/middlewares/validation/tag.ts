import express from 'express';
import Tag from '../../db/models/tag.js';
import { NSTracker } from '../../@types/user.types.js';
import User from '../../db/models/user.js';

const validateTagCreation = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const tag = req.body || {};
    const errorList: string[] = [];

    const requiredFields = ["name", "emoji", "type"];
    requiredFields.forEach((field) => {
        if (!tag[field]) {
            errorList.push(`${field} is required.`);
        }
    });

    const existingTag = await Tag.findOne({ name: tag.name });
    if (existingTag) {
        errorList.push('Tag with this name already exists.');
    }

    const validTagTypes: NSTracker.tagType[] = ['global', 'custom'];
    if (tag.type && !validTagTypes.includes(tag.type)) {
        errorList.push('Invalid tag type.');
    }

    if (tag.type === 'custom') {
        if (!tag.user) {
            errorList.push('user is required when type is custom.');
        } else {
            const userExists = await User.findById(tag.user);
            if (!userExists) {
                errorList.push('User does not exist.');
            }
        }
    }

    if (errorList.length) {
        res.status(400).send({
            message: 'Tag creation failed',
            error: errorList
        });
    } else {
        next();
    }
};

export {
    validateTagCreation
}