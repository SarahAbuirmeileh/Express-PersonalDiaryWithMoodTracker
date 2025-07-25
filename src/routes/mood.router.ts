import express from 'express';
import {
  createMood,
  deleteMood,
  getAllMoods,
  getMoodByName,
  updateMood
} from '../controllers/mood.controller.js';
import {
  validateMoodCreation,
  validateMoodDeletion,
  validateMoodUpdate
} from '../middlewares/validation/mood.js';
import { authorize } from '../middlewares/auth/authorize.js';
import { NSMood } from '../@types/mood.type.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', validateMoodCreation, async (req: NSMood.IMoodCreateRequest, res: express.Response) => {
  try {
    const mood = await createMood(req.body);
    const { __v, ...data } = mood;
    res.status(201).send({
      message: "Mood added successfully!",
      data
    });
  } catch (err) {
    console.error("Error adding mood:", err);
    res.status(500).send({
      message: "Failed to add mood",
      error: "Internal Server Error"
    });
  }
});

router.put('/:id', validateMoodUpdate, async (req: NSMood.IMoodUpdateRequest, res: express.Response) => {
  try {
    const mood = await updateMood({ ...req.body, id: req.params.id });
    res.status(200).send({
      message: "Mood updated successfully!",
      data: mood
    });
  } catch (err) {
    console.error("Error updating mood:", err);
    res.status(500).send({
      message: "Failed to update mood",
      error: "Internal Server Error"
    });
  }
});

router.delete('/:id', validateMoodDeletion, async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    await deleteMood(req.params.id);
    res.status(200).send({
      message: "Mood deleted successfully!"
    });
  } catch (err) {
    console.error("Error deleting mood:", err);
    res.status(500).send({
      message: "Failed to delete mood",
      error: "Internal Server Error"
    });
  }
});

router.get('/:name', async (req, res) => {
  try {
    const mood = await getMoodByName(req.params.name);
    res.status(200).send({
      message: "Mood fetched successfully!",
      data: mood
    });
  } catch (err) {
    console.error("Error getting mood:", err);
    res.status(500).send({
      message: "Failed to get mood",
      error: "Internal Server Error"
    });
  }
});
router.get('/', async (req, res) => {
  try {
    const mood = await getAllMoods();
    res.status(200).send({
      message: "Mood fetched successfully!",
      data: mood
    });
  } catch (err) {
    console.error("Error getting mood:", err);
    res.status(500).send({
      message: "Failed to get mood",
      error: "Internal Server Error"
    });
  }
});

export default router;
