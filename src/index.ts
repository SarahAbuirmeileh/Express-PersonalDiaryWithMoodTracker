import express from "express";
import cors from "cors";
import { connectDB } from "./db/connection.js";
import userRouter from "./routes/user.router.js";
import tagRouter from "./routes/tag.router.js";
import quoteBackgroundImageRouter from "./routes/quoteBackgroundImage.router.js";

import quoteRouter from "./routes/quote.router.js";

import cookieParser from "cookie-parser";
import { authenticate } from "./middlewares/auth/authenticate.js";

const app = express();
const port: number = 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/tags", authenticate, tagRouter);
app.use("/quote-bg-image", quoteBackgroundImageRouter);
app.use("/quotes", quoteRouter);

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send("Hello world!");
});

// Catch all routes
app.all("/{*notFound}", (req: express.Request, res: express.Response) => {
  res.status(404).send("Not found!");
});

app.listen(port, () => {
  console.log(`Hello express app listening on port ${port}`);
  connectDB();
});
