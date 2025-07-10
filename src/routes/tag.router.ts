import express from 'express';
import { NSTracker } from '../@types/user.types.js';
import { createTag } from '../controllers/tag.controller.js';
import { validateTagCreation } from '../middlewares/validation/tag.js';

const router = express.Router();

router.post('/', validateTagCreation, (req: NSTracker.ITagCreateRequest, res: express.Response) => {
  try {
    createTag(req.body).then(dataObj => {

      const { __v, ...data } = dataObj;
      res.status(201).send({
        message: "Tag added successfully!",
        data: data
      });

    }).catch(err => {
      console.error("Error in adding tag: ", err);
      res.status(500).send({
        message: "Failed to add tag",
        error: "Internal Server Error"
      });
    });
  } catch (err) {
    console.error("Error in adding tag: ", err);
    res.status(500).send({
      message: "Failed to add tag",
      error: "Internal Server Error"
    });
  }

});

export default router;