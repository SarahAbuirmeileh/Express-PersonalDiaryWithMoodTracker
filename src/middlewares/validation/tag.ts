import express from 'express';
import Tag from '../../db/models/tag.js';
import User from '../../db/models/user.js';
import { NSTag } from '../../@types/tag.type.js';
import mongoose from 'mongoose';

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

    const validTagTypes: NSTag.tagType[] = ['global', 'custom'];
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

const validateTagUpdate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const tagData = req.body || {};
    const id = req.params.id

    const isValid = mongoose.Types.ObjectId.isValid(id);
    const tag = isValid ? await Tag.findById(id) : null;

    if (!tag) {
        res.status(404).send({
            message: 'Updating tag failed',
            error: 'Tag not found.'
        });
        return;
    }

    if (tagData.name) {

        const existingTag = await Tag.findOne({ name: tagData.name });
        if (existingTag) {
            res.status(400).send({
                message: 'Updating tag failed',
                error: 'Tag with this name already exists.'
            });
            return;
        }
    }

    const validTagTypes: NSTag.tagType[] = ['global', 'custom'];
    if (tagData.type && !validTagTypes.includes(tagData.type)) {
        res.status(400).send({
            message: 'Updating tag failed',
            error: 'Invalid tag type.'
        });
        return;
    }

    if (tagData.type === 'custom') {
        if (!tagData.user) {
            res.status(400).send({
                message: 'Updating tag failed',
                error: 'user is required when type is custom.'
            });
            return;
        } else {

            const isValid = mongoose.Types.ObjectId.isValid(tagData.user);
            const user = isValid ? await User.findById(tagData.user) : null;

            if (!user) {
                res.status(400).send({
                    message: 'Updating tag failed',
                    error: 'User does not exist.'
                });
                return;
            }
            next();
        }
    }
}

const validateTagDeletion = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const id = req.params.id;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    const tag = isValid ? await Tag.findById(id) : null; 

    if (!tag) {
        res.status(404).send({
            message: 'Deleting tag failed',
            error: 'Tag not found.'
        });
    } else {
        next();
    }
};


export {
    validateTagCreation,
    validateTagUpdate,
    validateTagDeletion
}