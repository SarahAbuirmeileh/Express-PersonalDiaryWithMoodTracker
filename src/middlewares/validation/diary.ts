import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import User from '../../db/models/user.js';
import { Diary, Tag } from '../../db/index.js';
import { CustomError } from '../../utils/CustomError.js';

export const validateDiaryCreation: RequestHandler = async (req, res, next) => {
    const diary = req.body || {};
    const errorList: string[] = [];

    if (!diary.user) {
        res.status(401).send({
            massage: "Diary creation failed",
            error: "User should be sent"
        })
        return;
    }

    const user = User.findById({ _id: diary.user });
    if (!user) {
        res.status(404).send({
            massage: "Diary creation failed",
            error: "User not found"
        })
        return;
    }

    if (!diary.title && !diary.mood && !diary.tags && !diary.images && !diary.audio && !diary.notes) {
        errorList.push("At least one field is required to create");
    }

    if (diary.tags && diary.tags.length !== 0) {
        const tags: string[] = diary.tags;

        for (const tag of tags) {
            const isValidId = mongoose.Types.ObjectId.isValid(tag);
            const tagDoc = isValidId ? await Tag.findById(tag) : null;

            if (tagDoc) {
                if (tagDoc.type === "custom") {
                    if (res.locals?.user?.id !== tagDoc?.user) {
                        errorList.push(`You do not have permission to use this tag`);
                    }
                }
            } else {
                errorList.push(`Tag not found`);
            }
        }
    }

    if (errorList.length) {
        res.status(400).send({
            message: "Diary creation failed",
            error: errorList
        });
        return;
    }

    next();
};

export const validateDiaryUpdate: RequestHandler = async (req, res, next) => {
    const diaryData = req.body || {};
    const id = req.params.id;

    const isValidId = mongoose.Types.ObjectId.isValid(id);
    const diary = isValidId ? await Diary.findById(id) : null;
    if (!diary) {
        res.status(404).send({
            message: "Updating diary failed",
            error: "Diary not found."
        });
        return;
    }
    if (!diaryData.title && !diaryData.mood && !diaryData.tags && !diaryData.images && !diaryData.audio && !diaryData.notes) {
        throw new CustomError("At least one field is required to update", 400);
    }

    if (!diaryData.user) {
        res.status(400).send({
            message: "Updating diary failed",
            error: "User is required"
        });
        return;
    }

    const isValidUser = mongoose.Types.ObjectId.isValid(diaryData.user);
    const user = isValidUser ? await User.findById(diaryData.user) : null;

    if (!user) {
        res.status(400).send({
            message: "Updating diary failed",
            error: "User does not exist."
        });
        return;
    }

    if (diary.tags && diary.tags.length !== 0) {
        const tags = diary.tags;

        for (const tag of tags) {
            const isValidId = mongoose.Types.ObjectId.isValid(tag);
            const tagDoc = isValidId ? await Tag.findById(tag) : null;

            if (!tagDoc) {
                res.status(404).send({
                    message: "Updating diary failed",
                    error: "Tag not found"
                });
                return;
            } else {
                if (tagDoc.type === "custom") {
                    if (res.locals?.user?.id !== tagDoc?.user) {
                        res.status(403).send({
                            message: "Updating diary failed",
                            error: "You don't have permission access this tag"
                        });
                        return;
                    }
                }
            }
        }
    }

    next();
};

export const validateDiaryDeletion: RequestHandler = async (req, res, next) => {
    try {
        const diaryId = req.params._id;
        const userId = req.user?._id;

        const isValidId = !mongoose.Types.ObjectId.isValid(diaryId);

        const diary = isValidId ? await Diary.findById(diaryId) : null;
        if (!diary) {
            res.status(404).send({
                message: "Deleting diary failed",
                error: "Diary not found."
            });
            return;
        }

        if (!userId) {
            res.status(401).send({
                message: "Deleting diary failed",
                error: "User is required to delete the diary"
            });
            return;
        }
        const isValidUserId = mongoose.Types.ObjectId.isValid(userId);
        const user = isValidUserId ? await User.findById(isValidUserId) : null;

        if (!user) {
            res.status(404).send({
                message: "Deleting diary failed",
                error: "User not found."
            });
            return;
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete diary", error: "Internal server error" });
    }
};


export const validateDiaryExistence: RequestHandler = async (req, res, next) => {
    try {
        const diaryId = req.params._id;

        const isValidId = mongoose.Types.ObjectId.isValid(diaryId);
        const diary = isValidId ? await Diary.findById(diaryId) : null;
        if (!diary) {
            res.status(400).send({
                message: "Diary not found",
                error: "Diary not found"
            });
            return;
        }
    }
    catch (err) {
        console.error(err);
        res.status(400).send({
            message: "Failed to find diary",
            error: "Internal server error."
        });
        return;
    }
    next();
};

