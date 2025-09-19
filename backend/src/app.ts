import express from 'express';
import cors from 'cors';
import checkUrlRouter from './api/checkUrl';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', checkUrlRouter);

export default app;
