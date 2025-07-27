import Mood from '../db/models/mood.js';
import { NSMood } from '../@types/mood.type.js';
import { CustomError } from '../utils/CustomError.js';

const createMood = async (payload: NSMood.IMood) => {
    try {
        const newMood = new Mood(payload);
        await newMood.save();
        return newMood.toObject();
    } catch (err) {
        console.error("Error creating mood:", err);
        throw new CustomError('Error creating mood', 500);
    }
};

const getAllMoods = async () => {
    try {
        const moods = await Mood.find();
        return moods.map((mood) => mood.toObject());
    } catch (err) {
        console.error("Error fetching moods:", err);
        throw new CustomError('Error fetching moods', 500);
    }
};

const getMoodByName = async (name: string) => {
    try {
        const mood = await Mood.findOne({ name });
        if (!mood) {
            throw new CustomError('Mood not found', 404);
        }
        return mood.toObject();
    } catch (err) {
        console.error("Error fetching moods:", err);
        throw new CustomError(`Error fetching moods`, 500);
    }
};

const updateMood = async (payload: NSMood.IEditMood) => {
    const { id, ...updateData } = payload;
    try {
        const mood = await Mood.findByIdAndUpdate(id, updateData, { new: true });
        if(mood) 
            return mood;
    } catch (err) {
        console.error("Error updating mood:", err);
        throw new CustomError('Error updating mood', 500);
    }
};

const deleteMood = async (id: string) => {
    try {
        const mood = await Mood.findByIdAndDelete(id);
        if(mood)
            return  mood;
    } catch (err) {
        console.error("Error deleting mood:", err);
        throw new CustomError('Error deleting mood', 500);
    }
};

const getMoodsForUser = async (userId: string) => {
    try {
        const moods = await Mood.find({
            userId
        });
        return moods.map(mood => mood.toObject());

    } catch (err) {
        const error = new CustomError('Error fetching moods for user', 500);
        console.error("Error fetching mood for user: ", err);
        throw error;
    }
}

export {
    createMood,
    updateMood,
    getAllMoods,
    getMoodByName,
    deleteMood,
    getMoodsForUser
}