import express from 'express';
import cors from 'cors';
import { connectDB } from './db/connection.js';

const app = express();
const port: number = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send("Hello world!");
});

// Catch all routes
app.all('/{*notFound}', (req: express.Request, res: express.Response) => {
  res.status(404).send("Not found!");
});

app.listen(port, () => {
  console.log(`Hello express app listening on port ${port}`)
  connectDB();
});