import express from 'express';
import { createUser, login } from '../controllers/user.controller.js';
import { NSUser } from '../@types/user.types.js';
import { validateUserCreation, validateUserLogin } from '../middlewares/validation/user.js';
import { COOKIE_MAX_AGE, COOKIE_NAME, COOKIE_SAME_SITE } from '../constants/token.js';
import { authenticate } from '../middlewares/auth/authenticate.js';

const router = express.Router();

router.post('/signup', validateUserCreation, (req: NSUser.IUserCreateRequest, res: express.Response) => {
  createUser(req.body).then(dataObj => {

    const { password, __v, ...data } = dataObj;
    res.status(201).send({
      message: "User added successfully!",
      data: data
    });

  }).catch(err => {
    console.error("Error in adding user: ", err);
    res.status(500).send("Failed to add user");
  });

});

router.post('/login', validateUserLogin, (req: NSUser.IUserCreateRequest, res: express.Response) => {
  login(req.body?.email, req.body?.password)
    .then(dataObj => {
      res.cookie(COOKIE_NAME, dataObj.token, {
        httpOnly: true,
        maxAge: COOKIE_MAX_AGE,
        sameSite: COOKIE_SAME_SITE
      });

      const { password, __v, ...data } = dataObj.user;
      res.status(201).send({
        message: "User logged in successfully!",
        data: data
      });
    })
    .catch(err => {
      console.error("Error in logging in user: ", err.message);
      res.status(500).send({
        message: "Failed to log in user",
        error: (err.status === 400 ? err.message : "Internal Server Error")
      });
    });
});

router.get("/logout", authenticate, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.cookie(COOKIE_NAME, '', {
    maxAge: -1
  })
  res.send({ message: "You logged out successfully !" });
});

export default router;