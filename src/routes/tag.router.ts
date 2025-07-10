import express from 'express';
import { createTag, updateTag } from '../controllers/tag.controller.js';
import { validateTagCreation, validateTagUpdate } from '../middlewares/validation/tag.js';
import { NSTag } from '../@types/tag.type.js';

const router = express.Router();

router.post('/', validateTagCreation, (req: NSTag.ITagCreateRequest, res: express.Response) => {
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

router.put('/:id', validateTagUpdate, (req: NSTag.ITagUpdateRequest, res: express.Response) => {
  try {
    updateTag({ ...req.body, id: req.params.id }).then(data => {

      res.status(200).send({
        message: "Tag updated successfully!",
        data: data
      });

    }).catch(err => {
      console.error("Error in updating tag: ", err);
      res.status(500).send({
        message: "Failed to update tag",
        error: "Internal Server Error"
      });
    });

  } catch (err) {
    console.error("Error in updating tag: ", err);
    res.status(500).send({
      message: "Failed to update tag",
      error: "Internal Server Error"
    });
  }

});

export default router;