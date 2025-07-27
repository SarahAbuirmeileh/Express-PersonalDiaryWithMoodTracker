import express from "express";
import {
  createDiary,
  deleteDiary,
  getDiariesForUser,
  getDiaryByID,
  updateDiary,
  getAllDiaries,
} from "../controllers/diary.controller.js";
import {
  validateDiaryCreation,
  validateDiaryDeletion,
  validateDiaryUpdate,
  validateDiaryExistance,
} from "../middlewares/validation/diary.js";
import { authorize } from "../middlewares/auth/authorize.js";
import { NSDiary } from "../@types/diary.type.js";
import mongoose from "mongoose";
import { authenticate } from "../middlewares/auth/authenticate.js";


const router = express.Router();

router.post(
  "/", authenticate,
  validateDiaryCreation,
  async (req: NSDiary.IDiaryCreateRequest, res: express.Response) => {
    try {
      const diary = await createDiary(req.body);
      const { __v, ...data } = diary;
      res.status(201).send({
        message: "Diary added successfully!",
        data,
      });
    } catch (err) {
      console.error("Error adding diary:", err);
      res.status(500).send({
        message: "Failed to add diary",
        error: "Internal Server Error",
      });
    }
  }
);


router.put("/:id", authenticate, authorize("diaryOwnership"), validateDiaryUpdate, async (req, res) => {
  try {
    const diaryId = new mongoose.Types.ObjectId(req.params.id);
    const diary = await updateDiary({ ...req.body, _id: diaryId });
    res.status(200).send({
      message: "Diary updated successfully!",
      data: diary,
    });
  } catch (err) {
    console.error("Error updating diary:", err);
    res.status(500).send({
      message: "Failed to update diary",
      error: "Internal Server Error",
    });
  }
});


router.delete("/:id", authenticate, authorize("diaryOwnership"), validateDiaryDeletion, async (req, res) => {
  try {
    await deleteDiary(req.params.id);
    res.status(200).send({
      message: "Diary deleted successfully!",
    });
  } catch (err) {
    console.error("Error deleting diary:", err);
    res.status(500).send({
      message: "Failed to delete diary",
      error: "Internal Server Error",
    });
  }
});


router.get("/:id", authenticate, validateDiaryExistance, async (req, res) => {
  try {
    const diary = await getDiaryByID(req.params.id);
    res.status(200).send({
      message: "Diary fetched successfully!",
      data: diary,
    });
  } catch (err) {
    console.error("Error getting diary:", err);
    res.status(500).send({
      message: "Failed to get diary",
      error: "Internal Server Error",
    });
  }
});


router.get("/", async (req, res) => {
  try {
    const diary = await getAllDiaries();
    res.status(200).send({
      message: "Diary fetched successfully!",
      data: diary,
    });
  } catch (err) {
    console.error("Error getting diary:", err);
    res.status(500).send({
      message: "Failed to get diary",
      error: "Internal Server Error",
    });
  }
});


router.get("/user/:id", authenticate, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);

    const diaries = await getDiariesForUser(userId);

    if (!diaries || diaries.length === 0) {
      res.status(404).send({
        message: "No diaries found for the user.",
        error: "User has no diaries.",
      });
    }

    res.status(200).send({
      message: "User diaries fetched successfully!",
      data: diaries,
    });
  } catch (err) {
    console.error("Error getting user diaries:", err);
    res.status(500).send({
      message: "Failed to get user diaries",
      error: "Internal Server Error",
    });
  }
});


export default router;
