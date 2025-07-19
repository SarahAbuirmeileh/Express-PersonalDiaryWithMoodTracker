import express from 'express';
import { createUser,deleteUser,getUserById,login,updateUser, } from '../controllers/user.controller.js';
import { NSUser } from '../@types/user.types.js';
import { validateUserCreation, validateUserLogin } from '../middlewares/validation/user.js';
import { COOKIE_MAX_AGE, COOKIE_NAME, COOKIE_SAME_SITE } from '../constants/token.js';
import { authenticate } from '../middlewares/auth/authenticate.js';
import { authorize } from "../middlewares/auth/authorize.js";
import { validateUserUpdate } from "../middlewares/validation/user.js";
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

router.get("/:id", authenticate, authorize("userOwnership"), (req: express.Request, res: express.Response) => {
    const userId = req.params.id;
    getUserById(userId)
      .then((user) => {
        res.status(200).send({
          message: "User fetched successfully!",
          data: user,
        });
      })
      .catch((err) => {
        console.error("Error fetching user:", err);  
        res.status(500).send({
          message: "Failed to fetch user",
          error: "Internal server error", 
        });
      });
  }
);

router.put("/:id", authenticate, authorize("userOwnership"), validateUserUpdate, (req: express.Request, res: express.Response) => {
    const userId = req.params.id;
    updateUser(userId, req.body)
      .then((user) => {
        res.status(200).send({
          message: "User updated successfully!",
          data: user,
        });
      })
      .catch((err: any) => {
        const status = err.status || 500;
        const errorMessage =
          status === 500 ? "Internal server error" : err.message;

        res.status(status).send({
          message: "Failed to update user",
          error: errorMessage,
        });
      });
  }
);


router.delete("/:id", authenticate,authorize("userOwnership"), (req: express.Request, res: express.Response) => {
    const userId = req.params.id;
    deleteUser(userId)
      .then(() => {
        res.status(200).send({
          message: "User deleted successfully!",
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Failed to delete user",
          error: "Internal server error", 
        });
      });
  }
);

export default router;