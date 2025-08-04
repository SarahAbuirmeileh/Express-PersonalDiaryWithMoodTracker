import Diary from '../db/models/diary.js';
import { NSDiary } from '../@types/diary.type.js';
import { CustomError } from '../utils/CustomError.js';

import mongoose from 'mongoose';

const toObjectId = (id: string | mongoose.Types.ObjectId) =>
    typeof id === "string" ? new mongoose.Types.ObjectId(id) : id;

const toObjectIdArray = (arr: (string | mongoose.Types.ObjectId)[]) =>
    arr.map(toObjectId);

const createDiary = async (payload: NSDiary.IDiary) => {
    try {
        const {
            date,
            user,
            notes,
            images,
            audios,
            mood,
            tags,
            title,
        } = payload;

        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);


        const existingDiary = await Diary.findOne({
            user,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        const tagsObjectIds = tags ? toObjectIdArray(tags) : [];

        if (existingDiary) {
            if (notes && notes.length > 0) {
                existingDiary.notes = [...new Set([...(existingDiary.notes || []), ...notes])];
            }
            if (images && images.length > 0) {
                existingDiary.images = [...new Set([...(existingDiary.images || []), ...images])];
            }
            if (audios && audios.length > 0) {
                existingDiary.audios = [...new Set([...(existingDiary.audios || []), ...audios])];
            }
            if (mood !== undefined) existingDiary.mood = mood;

            if (tagsObjectIds.length > 0) {
                existingDiary.tags = [...new Set([...(existingDiary.tags || []), ...tagsObjectIds])];
            }
            if (title) existingDiary.title = title;

            await existingDiary.save();
            return existingDiary.toObject();
        }

        const newDiary = new Diary({
            ...payload,
            user,
            tags: tagsObjectIds,
            date: now,
        });

        await newDiary.save();
        return newDiary.toObject();

    } catch (err) {
        console.error("Error creating/updating today's diary:", err);
        throw new CustomError('Error creating/updating diary', 500);
    }
};




const getDiaryByID = async (id: string) => {
    try {
        const diary = await Diary.findOne({ _id: id });
        if (diary) {
            return diary.toObject();
        }
    } catch (err) {
        console.error("Error fetching diaries:", err);
        throw new CustomError(`Error fetching diaries`, 500);
    }
};


const updateDiary = async (payload: NSDiary.IEditDiary) => {
    const { _id, ...updateData } = payload;
    try {
        const diary = await Diary.findByIdAndUpdate(_id, updateData, { new: true });
        if (diary) {
            return diary;
        }
    } catch (err) {
        console.error("Error updating diary:", err);
        throw new CustomError("Updating diary failed", 500);
    }
};


const deleteDiary = async (id: string) => {
    try {
        const diary = await Diary.findByIdAndDelete(id);
        if (diary)
            return diary;
    } catch (err) {
        console.error("Error deleting diary:", err);
        throw new CustomError('Error deleting diary', 500);
    }
};


const getDiariesForUser = async (userId: string) => {
    try {
        const diaries = await Diary.find({
            user: userId
        });
        return diaries.map(diary => diary.toObject());

    } catch (err) {
        const error = new CustomError('Error fetching diaries for user', 500);
        console.error("Error fetching diary for user: ", err);
        throw error;
    }
}


const getAllDiaries = async () => {
    try {
        const diary = await Diary.find();
        return diary.map((diary) => diary.toObject());
    } catch (err) {
        console.error("Error fetching diary:", err);
        throw new CustomError('Error fetching diary', 500);
    }
};
export {
    createDiary,
    updateDiary,
    getDiaryByID,
    deleteDiary,
    getDiariesForUser,
    getAllDiaries,
}