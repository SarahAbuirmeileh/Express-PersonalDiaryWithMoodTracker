import bcrypt from 'bcrypt';
import { NSUser } from '../@types/user.types.js';
import User from '../db/models/user.js';
import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/CustomError.js';

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
            const error = new CustomError('User already exists', 400);
            throw error;
        }

        const newUser = new User(payload);
        await newUser.save();

        const userData = newUser.toObject();
        return userData;

    } catch (err) {
        const error: any = new Error('Error creating user');
        console.error("Error creating user: ", err);
        
        error.status = 500;
        throw error;
    }
};

const login = async (email: string, password: string) => {
    let user;
    try {
        user = await User.findOne({
            email
        }).lean();
    } catch (err) {
        const error = new CustomError('Error finding user', 500);
        throw error;
    }

    if (user && user.password) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new CustomError('Invalid email or password', 400);
            throw error;
        }
        const token = jwt.sign(
            { email, name: user.name, id: user._id },
            process.env.SECRET_KEY || '',
            {
                expiresIn: "1d"
            }
        );
        return { token, user };
    } else {
        const error = new CustomError('No user with this email!', 404);
        throw error;
    }
}

export {
    createUser,
    login,
};