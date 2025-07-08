import bcrypt from 'bcrypt';
import { NSUser } from '../@types/user.types.js';
import User from '../db/models/user.js';

const createUser = async (payload: NSUser.IUser) => {
    try {
        const hashedPassword = await new Promise<string>((resolve, reject) => {
            bcrypt.hash(payload.password, 10, (err, hash) => {
                if (err) reject(new Error('Error hashing password'));
                else resolve(hash);
            });
        });

        payload.password = hashedPassword;

        const existingUser = await User.findOne({ email: payload.email });
        if (existingUser) {
            const error = new Error('User already exists');
            (error as any).status = 400;
            throw error;
        }

        const newUser = new User(payload);
        await newUser.save();

        const userData = newUser.toObject();
        return userData;

    } catch (err) {
        const error: any = new Error('Error creating user');
        error.status = 400;
        throw error;
    }
};

export {
    createUser,
};
