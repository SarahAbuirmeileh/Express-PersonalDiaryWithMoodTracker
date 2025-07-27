import { RequestHandler } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import User from '../../db/models/user.js';
import { Diary } from '../../db/index.js';
import { NSDiary } from '../../@types/diary.type.js';
import { CustomError } from '../../utils/CustomError.js';

export const validateDiaryCreation: RequestHandler = async (req, res, next) => {
    const diary = req.body || {};
    const errorList: string[] = [];
    if (!diary.title && !diary.mood && !diary.tags && !diary.images && !diary.audio && !diary.notes) {
        errorList.push('At least one field is required to create');
    }

    if (errorList.length) {
        res.status(400).send({
            message: 'Diary creation failed',
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
            message: 'Updating diary failed',
            error: 'Diary not found.'
        });
        return;
    }
    if (!diaryData.title && !diaryData.mood && !diaryData.tags && !diaryData.images && !diaryData.audio && !diaryData.notes) {
        throw new CustomError('At least one field is required to update', 400);
    }

    if (!diaryData.user) {
        res.status(400).send({
            message: 'Updating diary failed',
            error: 'User is required'
        });
        return;
    }

    const isValidUser = mongoose.Types.ObjectId.isValid(diaryData.user);
    const user = isValidUser ? await User.findById(diaryData.user) : null;

    if (!user) {
        res.status(400).send({
            message: 'Updating diary failed',
            error: 'User does not exist.'
        });
        return;
    }


    next();
};


export const validateDiaryDeletion: RequestHandler = async (req, res, next) => {
    try {
        const diaryId = req.params._id;
        const userId = req.user?._id;



        if (!mongoose.Types.ObjectId.isValid(diaryId)) {
            res.status(400).send({
                message: 'Deleting diary failed',
                error: 'Invalid diary ID.'
            });
            return;
        }

        const diary = await Diary.findById(diaryId);
        if (!diary) {
            res.status(404).send({
                message: 'Deleting diary failed',
                error: 'Dirary Not Found.'
            });
            return;
        }
        if (!userId) {
            res.status(401).send({
                message: 'Deleting diary failed',
                error: 'User is required to delete the diary'
            });
            return;
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete diary', error: 'Internal server error' });
    }
};


export const validateDiaryExistance: RequestHandler = async (req, res, next) => {
    try {
        const diaryId = req.params._id;

        if (!mongoose.Types.ObjectId.isValid(diaryId)) {
            res.status(400).send({
                message: 'Invalid diary',
                error: 'Invalid diary ID.'
            });
            return;
        }
        const diary = await Diary.findById(diaryId);
        if (!diary) {
            res.status(400).send({
                message: 'Diary not found',
                error: 'Diary not found'
            });
            return;
        }
    }
    catch (err) {
        console.error(err);
        res.status(400).send({
            message: 'Failed to find diary',
            error: 'Internal server error.'
        });
        return;
    }
    next();
};

