import express from 'express';
import * as EmailValidator from 'email-validator';
import { isValidPassword } from '../../utils/validation.js';
import User from '../../db/models/user.js';

const validateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = req.body;
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
        res.status(400).send({ message: 'User creation failed', errors: errorList });
    } else {
        next();
    }
};

export{
    validateUser,
}