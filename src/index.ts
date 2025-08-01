import express from 'express';
import cors from 'cors';
import { connectDB } from './db/connection.js';
import userRouter from './routes/user.router.js';
import tagRouter from './routes/tag.router.js';
import moodRouter from './routes/mood.router.js';
import diaryRouter from './routes/diary.router.js';
import quoteBgColorRouter from './routes/quoteBgColor.router.js';
import quoteBackgroundImageRouter from './routes/quoteBackgroundImage.router.js';
import quoteRouter from './routes/quote.router.js';
import cookieParser from 'cookie-parser';
import { authenticate } from './middlewares/auth/authenticate.js';

const app = express();
const port: number = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/users', userRouter);
app.use('/tags', authenticate, tagRouter);
app.use('/moods', moodRouter);
app.use('/diaries', diaryRouter);
app.use('/quote-bg-color', quoteBgColorRouter);
app.use('/quote-bg-image', quoteBackgroundImageRouter);
app.use('/quotes', quoteRouter);

app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send('Hello world!');
});

// Catch all unmatched routes
app.all(/.*/, (req: express.Request, res: express.Response) => {
  res.status(404).send('Not found!');
});


app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
  connectDB();
});
