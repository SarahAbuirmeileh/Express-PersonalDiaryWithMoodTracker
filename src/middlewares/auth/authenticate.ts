import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { COOKIE_NAME } from '../../constants/token.js';
import User from '../../db/models/user.js';

const authenticate = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {

    const token = req.cookies[COOKIE_NAME] || '';
    let tokenIsValid: JwtPayload | null | string;

    try {
        tokenIsValid = jwt.verify(token, process.env.SECRET_KEY || '');
    } catch (error) {
        tokenIsValid = null;
    }

    if (tokenIsValid) {
        const decoded = tokenIsValid as JwtPayload;

        const user = await User.findOne({
            name: decoded.name, email: decoded.email, _id: decoded.id
        });

        if (user) {
            res.locals.user = user;
            next();
        } else {
            res.status(401).send({
                error: 'Authentication failed!'
            });
        }
    } else {
        res.status(401).send({
            error: 'Authentication failed!'
        });
    }
}

export {
    authenticate
}
