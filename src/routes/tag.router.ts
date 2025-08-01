import express from 'express';
import { createTag, deleteTag, getTagById, getTagsForUser, updateTag } from '../controllers/tag.controller.js';
import { validateTagCreation, validateTagDeletion, validateTagExistence, validateTagUpdate, validateUserExistence } from '../middlewares/validation/tag.js';
import { NSTag } from '../@types/tag.type.js';
import { authorize } from '../middlewares/auth/authorize.js';

const router = express.Router();

router.post('/', validateTagCreation, (req: NSTag.ITagCreateRequest, res: express.Response) => {
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
});

router.put('/:id', authorize("TagOwnership"), validateTagUpdate, (req: NSTag.ITagUpdateRequest, res: express.Response) => {
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

});

router.get('/:id', validateTagExistence, (req: express.Request, res: express.Response) => {
  const id = req.params.id;

  getTagById(id).then((data) => {
    res.status(200).send({
      message: "Tag fetched successfully!",
      data
    });
  }).catch(err => {
    console.error("Error in fetching tag: ", err);
    res.status(500).send({
      message: "Failed to fetched tag",
      error: "Internal Server Error"
    });
  });

});

router.delete('/:id', authorize("TagOwnership"), validateTagDeletion, (req: express.Request, res: express.Response) => {
  const id = req.params.id;

  deleteTag(id).then(() => {
    res.status(200).send({
      message: "Tag deleted successfully!"
    });
  }).catch(err => {
    console.error("Error in deleting tag: ", err);
    res.status(500).send({
      message: "Failed to delete tag",
      error: "Internal Server Error"
    });
  });

});

router.get('/user/:id', validateUserExistence, (req: express.Request, res: express.Response) => {
  const userId = req.params.id;

  getTagsForUser(userId).then(tags => {
    res.status(200).send({
      message: "Tags fetched successfully!",
      data: tags
    });
  }).catch(err => {
    console.error("Error in fetching tags: ", err);
    res.status(500).send({
      message: "Failed to fetch tags",
      error: "Internal Server Error"
    });
  });
});

export default router;