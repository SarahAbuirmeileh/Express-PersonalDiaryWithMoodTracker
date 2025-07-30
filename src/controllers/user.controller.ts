import bcrypt from 'bcrypt';
import { NSUser } from '../@types/user.types.js';
import User from '../db/models/user.js';
import jwt from 'jsonwebtoken';
import { CustomError } from '../utils/CustomError.js';
import { isValidPassword } from "../utils/validation.js";

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
    const error: any = new CustomError('Error creating user', 500);
    console.error("Error creating user: ", err);

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
    const error = new CustomError('Login failed', 404);
    throw error;
  }
}

const getUserById = async (id: string) => {
  try {
    const user = await User.findById(id).select("-password -__v");
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return user;
  } catch (err) {
    console.error("Error getting user:", err);
    throw new CustomError("Error getting user", 500);
  }
};

const updateUser = async (id: string, data: Partial<NSUser.IUser>) => {
  try {

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select("-password -__v");

    if (!updatedUser) {
      throw new CustomError("User not found", 404);
    }

    return updatedUser;
  } catch (err) {
    console.error("Error updating user:", err);
    if (err instanceof CustomError) throw err;
    throw new CustomError("Error updating user", 500);
  }
};

const deleteUser = async (id: string) => {
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    throw new CustomError("Error deleting user", 500);
  }
};

export {
  createUser,
  login,
  getUserById,
  updateUser,
  deleteUser
};