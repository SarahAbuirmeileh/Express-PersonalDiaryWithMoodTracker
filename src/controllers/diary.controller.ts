import Diary from '../db/models/diary.js';
import { NSDiary } from '../@types/diary.type.js';
import { CustomError } from '../utils/CustomError.js';
import Tag from '../db/models/tag.js';

const createDiary = async (payload: NSDiary.IDiary) => {
    try {
        const newDiary = new Diary(payload);
        await newDiary.save();
        return newDiary.toObject();
    } catch (err) {
        console.error("Error creating diary:", err);
        throw new CustomError('Error creating diary', 500);
    }
};

const getDiaryByID = async (id: string) => {
    try {
        const diary = await Diary.findOne({ _id : id });
        if (!diary) {
            throw new CustomError('Diary not found', 404);
        }
        return diary.toObject();
    } catch (err) {
        console.error("Error fetching diarys:", err);
        throw new CustomError(`Error fetching diarys`, 500);
    }
};

const updateDiary = async (payload: NSDiary.IEditDiary) => {
    const { _id, ...updateData } = payload;
    try {
        const diary = await Diary.findByIdAndUpdate(_id, updateData, { new: true });
        if (!diary) {
            throw new CustomError("Diary not found.", 404);
        }
        return diary;
    } catch (err) {
        console.error("Error updating diary:", err);
        throw new CustomError("Updating diary failed", 500);
    }
};


const deleteDiary = async (id: string) => {
    try {
        const diary = await Diary.findByIdAndDelete(id);
        if (diary)
            return { message: 'Diary deleted successfully' + diary };
    } catch (err) {
        console.error("Error deleting diary:", err);
        throw new CustomError('Error deleting diary', 500);
    }
};

const getDiarysForUser = async (userId: string) => {
    try {
        const diarys = await Diary.find({
            userId
        });
        return diarys.map(diary => diary.toObject());

    } catch (err) {
        const error = new CustomError('Error fetching diarys for user', 500);
        console.error("Error fetching diary for user: ", err);
        throw error;
    }
}

const getAllDiarys = async () => {
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
    getDiarysForUser,
    getAllDiarys,
}