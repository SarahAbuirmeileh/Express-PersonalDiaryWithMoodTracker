import { RequestHandler } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import User from '../../db/models/user.js';
import { Mood } from '../../db/index.js';
import { CustomError } from '../../utils/CustomError.js';

export const validateMoodCreation: RequestHandler = async (req, res, next) => {
  const mood = req.body || {};
  const errorList: string[] = [];

  const requiredFields = ["name", "emoji", "color", "score"];
  requiredFields.forEach((field) => {
    if (!mood[field] && mood[field] != 0) {
      errorList.push(`${field} is required.`);
    }
  });

  if (mood.name) {
    const existingMood = await Mood.findOne({ name: mood.name });
    if (existingMood) {
      errorList.push('Mood with this name already exists.');
    }
  }

  if (mood.score < 0 || mood.score > 4) {
    errorList.push('Mood score should be between 0-4');
  }

  if (errorList.length) {
    res.status(400).send({
      message: 'Mood creation failed',
      error: errorList
    });
    return;
  }

  next();
};

export const validateMoodUpdate: RequestHandler = async (req, res, next) => {
  const moodData = req.body || {};
  const id = req.params.id;

  const isValidId = mongoose.Types.ObjectId.isValid(id);
  const mood = isValidId ? await Mood.findById(id) : null;

  if (!mood) {
    res.status(404).send({
      message: 'Updating mood failed',
      error: 'Mood not found.'
    });
    return;
  }

  if (!moodData.name && !moodData.emoji && !moodData.color && moodData.score) {
    res.status(400).send({
      message: 'Updating mood failed',
      error: 'At least one field is required to update'
    });
    return;
  }

  if (moodData.name) {
    const existingMood = await Mood.findOne({ name: moodData.name });
    if (existingMood && !existingMood._id.equals(id)) {
      res.status(400).send({
        message: 'Updating mood failed',
        error: 'Mood with this name already exists.'
      });
      return;
    }
  }

  if (moodData.score) {
    if (moodData.score < 0 || moodData.score > 4) {
      res.status(400).send({
        message: 'Updating mood failed',
        error: 'Mood score should be between 0-4'
      });
      return;
    }
  }

  if (!moodData.user) {
    res.status(400).send({
      message: 'Updating mood failed',
      error: 'User is required'
    });
    return;
  }

  const isValidUser = mongoose.Types.ObjectId.isValid(moodData.user);
  const user = isValidUser ? await User.findById(moodData.user) : null;

  if (!user) {
    res.status(404).send({
      message: 'Updating mood failed',
      error: 'User does not exist.'
    });
    return;
  }

  next();
};

export const validateMoodDeletion: RequestHandler = async (req, res, next) => {
  const id = req.params.id;
  const isValid = mongoose.Types.ObjectId.isValid(id);
  const mood = isValid ? await Mood.findById(id) : null;

  if (!mood) {
    res.status(404).send({
      message: 'Deleting mood failed',
      error: 'Mood not found.'
    });
    throw new CustomError('Mood not found', 404);
  }

  next();
};
