import { RequestHandler } from 'express';
import mongoose, { ObjectId } from 'mongoose';
import User from '../../db/models/user.js';
import { Mood } from '../../db/index.js';
import { NSMood } from '../../@types/mood.type.js';
import { CustomError } from '../../utils/CustomError.js';

export const validateMoodCreation: RequestHandler = async (req, res, next) => {
  const mood = req.body || {};
  const errorList: string[] = [];

  const requiredFields = ["name", "emoji", "color"];
  requiredFields.forEach((field) => {
    if (!mood[field]) {
      errorList.push(`${field} is required.`);
    }
  });

  if (mood.name) {
    const existingMood = await Mood.findOne({ name: mood.name });
    if (existingMood) {
      errorList.push('Mood with this name already exists.');
    }
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
  if (!moodData.name && !moodData.emoji && !moodData.color) {
    throw new CustomError('At least one field is required to update', 400);
  }
  if (!mood) {
    res.status(404).send({
      message: 'Updating mood failed',
      error: 'Mood not found.'
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
    res.status(400).send({
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

export const validateUserExistence: RequestHandler = async (req, res, next) => {
  const userId = req.params.id;
  const isValid = mongoose.Types.ObjectId.isValid(userId);
  const user = isValid ? await User.findById(userId) : null;

  if (!user) {
    res.status(404).send({
      message: 'Moods retrieval failed',
      error: 'User not found.'
    });
    return;
  }

  next();
};



