import express from 'express';
import * as EmailValidator from 'email-validator';
import { isValidPassword } from '../../utils/validation.js';
import User from '../../db/models/user.js';
import bcrypt from 'bcrypt';

const validateUserCreation = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = req.body || {};
  const errorList: string[] = [];

  const requiredFields = ["name", "email", "password"];
  requiredFields.forEach((field) => {
    if (!user[field]) {
      errorList.push(`${field} is required.`);
    }
  });

  if (!EmailValidator.validate(user.email)) {
    errorList.push('Email is not valid.');
  }

  errorList.push(...isValidPassword(user.password));

  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    errorList.push('Email is already in use.');
  }

  if (errorList.length) {
    res.status(400).send({
      message: 'User creation failed',
      error: errorList
    });
  } else {
    next();
  }
};

const validateUserLogin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = req.body || {};
  const errorList: string[] = [];

  const requiredFields = ["email", "password"];
  requiredFields.forEach((field) => {
    if (!user[field]) {
      errorList.push(`${field} is required.`);
    }
  });

  if (errorList.length) {
    res.status(400).send({
      message: 'User login failed',
      error: errorList
    });
  } else {
    next();
  }
};

const validateUserUpdate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { email, password, currentPassword } = req.body;
  const errorList: string[] = [];
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404).send({
      massage: "Failed to update user",
      error: "User not found"
    })
    return;
  }

  if (email) {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      errorList.push("Email is already in use.");
    }

    if (!EmailValidator.validate(email)) {
      errorList.push("Email is not valid.");
    }
  }

  if (password) {
    if (!currentPassword) {
      errorList.push("Current password is required to change the password.");
    } else {

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        errorList.push("Current password is incorrect.");
      }

      const validationErrors = isValidPassword(password);
      errorList.push(...validationErrors);
    }
  }

  if (errorList.length > 0) {
    res.status(400).send({
      message: "User update failed",
      error: errorList,
    });
    return;
  } else {
    next();
  }
};

export {
  validateUserCreation,
  validateUserLogin,
  validateUserUpdate
}