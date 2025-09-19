import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import app from './app';

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
