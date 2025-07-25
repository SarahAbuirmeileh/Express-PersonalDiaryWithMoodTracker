import express from 'express';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: mongoose.Types.ObjectId | string;
        email?: string;
        name?: string;
      };
    }
  }
}
