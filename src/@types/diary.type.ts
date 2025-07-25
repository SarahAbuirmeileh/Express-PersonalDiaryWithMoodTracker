import express from "express";
import { ObjectId } from "mongoose";
import mongoose from 'mongoose';

export namespace NSDiary {

    export interface IDiary {
        _id: mongoose.Types.ObjectId;
        id: number;
        title: string;
        type: string[];
        notes: string[];
        state: number;
        image?: string[];
        audio?: string[];
    }

    export interface IDiaryCreateRequest extends express.Request<{}, {}, IDiary, {}> { }

    export interface IEditDiary {
        _id: mongoose.Types.ObjectId;
        id: number;
        title?: string;
        type?: string[]| ObjectId[];
        notes?: string[];
        state?: number;
        image?: string[];
        audio?: string[];
    }

    export interface IDiaryUpdateRequest extends express.Request<{ id: string }, {}, IEditDiary, {}> { }

}