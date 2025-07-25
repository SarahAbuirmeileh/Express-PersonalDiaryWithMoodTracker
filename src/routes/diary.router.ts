import express from 'express';
import {
  createDiary,
  deleteDiary,
  getDiarysForUser,
  getDiaryByID,
  updateDiary,
  getAllDiarys
} from '../controllers/diary.controller.js';
import {
  validateDiaryCreation,
  validateDiaryDeletion,
  validateDiaryUpdate,
} from '../middlewares/validation/diary.js'
import { authorize } from '../middlewares/auth/authorize.js';
import { NSDiary } from '../@types/diary.type.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', validateDiaryCreation, async (req: NSDiary.IDiaryCreateRequest, res: express.Response) => {
  try {
    console.log("Received body:", req.body);

    const diary = await createDiary(req.body);
    const { __v, ...data } = diary;
    res.status(201).send({
      message: "Diary added successfully!",
      data
    });
  } catch (err) {
    console.error("Error adding diary:", err);
    res.status(500).send({
      message: "Failed to add diary",
      error: "Internal Server Error"
    });
  }
});



router.put('/:id', validateDiaryUpdate, async (req, res) => {
  try {
    const diaryId = new mongoose.Types.ObjectId(req.params.id);
    const diary = await updateDiary({ ...req.body, _id: diaryId });
    res.status(200).send({
      message: "Diary updated successfully!",
      data: diary
    });
  } catch (err) {
    console.error("Error updating diary:", err);
    res.status(500).send({
      message: "Failed to update diary",
      error: "Internal Server Error"
    });
  }
});

router.delete('/:id', validateDiaryDeletion, async (req, res) => {
  try {
    await deleteDiary(req.params.id);
    res.status(200).send({
      message: "Diary deleted successfully!"
    });
  } catch (err) {
    console.error("Error deleting diary:", err);
    res.status(500).send({
      message: "Failed to delete diary",
      error: "Internal Server Error"
    });
  }
});

router.get('/:name', async (req, res) => {
  try {
    const diary = await getDiaryByID(req.params.name);
    res.status(200).send({
      message: "Diary fetched successfully!",
      data: diary
    });
  } catch (err) {
    console.error("Error getting diary:", err);
    res.status(500).send({
      message: "Failed to get diary",
      error: "Internal Server Error"
    });
  }
});
router.get('/', async (req, res) => {
  try {
    const diary = await getAllDiarys();
    res.status(200).send({
      message: "Diary fetched successfully!",
      data: diary
    });
  } catch (err) {
    console.error("Error getting diary:", err);
    res.status(500).send({
      message: "Failed to get diary",
      error: "Internal Server Error"
    });
  }
});

export default router;
