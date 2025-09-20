import express from 'express';
import app from './checkUrl.js';

const wrapper = express();
wrapper.use('/api', app);

export default wrapper;
