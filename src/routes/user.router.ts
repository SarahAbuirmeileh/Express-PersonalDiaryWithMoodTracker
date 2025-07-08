import express from 'express';
import { createUser } from '../controllers/user.controller.js';
import { NSUser } from '../@types/user.types.js';
import { validateUser } from '../middlewares/validation/user.js';

const router = express.Router();

router.post('/signup', validateUser, async (req: NSUser.IUserRequest, res: express.Response) => {
  try {
    await createUser(req.body).then(dataObj=>{

      const {password, __v, ...data} = dataObj;
      res.status(201).send({
        message: "User added successfully!",
        data: data
      });

    }).catch(err=>{
      console.log("Error in adding user: ", err);
      res.status(500).send("Failed to add user");
    });
  } catch (err) {
    console.log("Error in adding user: ", err);
    res.status(500).send("Failed to add user!");
  }

});

export default router;