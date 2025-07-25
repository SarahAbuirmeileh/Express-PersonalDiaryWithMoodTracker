import { RequestHandler } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import User from '../../db/models/user.js';
import { Diary } from '../../db/index.js';
import { NSDiary } from '../../@types/diary.type.js';
import { CustomError } from '../../utils/CustomError.js';

export const validateDiaryCreation: RequestHandler = async (req, res, next) => {
    const diary = req.body || {};
    const errorList: string[] = [];
    if (!diary.title && !diary.state && !diary.type && !diary.images && !diary.audio && !diary.notes) {
        errorList.push('At least one field is required to update');
    }

    if (diary.id) {
        const existingDiary = await Diary.findOne({ id: diary.id });
        if (existingDiary) {
            errorList.push('Diary with this name already exists.');
        }
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
    if (!diaryData.title && !diaryData.state && !diaryData.type && !diaryData.images && !diaryData.audio && !diaryData.notes) {
        throw new CustomError('At least one field is required to update', 400);
    }
    if (!diary) {
        res.status(404).send({
            message: 'Updating diary failed',
            error: 'Diary not found.'
        });
        return;
    }

    if (diaryData.id) {
        const existingDiary = await Diary.findOne({ id: diaryData.id });
        if (existingDiary && !existingDiary._id.equals(id)) {
            res.status(400).send({
                message: 'Updating diary failed',
                error: 'Diary with this name already exists.'
            });
            return;
        }
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
    const diaryId = req.params.id;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated.' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(diaryId)) {
      res.status(400).json({ message: 'Invalid diary ID.' });
      return;
    }

    const diary = await Diary.findById(diaryId);
    if (!diary) {
      res.status(404).json({ message: 'Diary not found.' });
      return;
    }

    if (diary.user.toString() !== userId.toString()) {
      res.status(403).json({ message: 'Not authorized to delete this diary.' });
      return;
    }

    next(); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



export const validateUserExistence: RequestHandler = async (req, res, next) => {
    const userId = req.params.id;
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    const user = isValid ? await User.findById(userId) : null;

    if (!user) {
        res.status(404).send({
            message: 'Diarys retrieval failed',
            error: 'User not found.'
        });
        return;
    }

    next();
};



