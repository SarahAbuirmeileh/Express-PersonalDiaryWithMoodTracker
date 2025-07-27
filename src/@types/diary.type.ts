import express from "express";
import { ObjectId } from "mongoose";
import mongoose from 'mongoose';

export namespace NSDiary {

    export interface IDiary {
        _id: mongoose.Types.ObjectId;
        date: number;
        title: string;
        tags: string[];
        notes?: string[];
        mood: number;
        image?: string[];
        audio?: string[];
    }

    export interface IDiaryCreateRequest extends express.Request<{}, {}, IDiary, {}> { }

    export interface IEditDiary {
        _id: mongoose.Types.ObjectId;
        date: number;
        title?: string;
        tags?: string[]| ObjectId[];
        notes?: string[];
        mood?: number;
        image?: string[];
        audio?: string[];
    }

    export interface IDiaryUpdateRequest extends express.Request<{ id: string }, {}, IEditDiary, {}> { }

}