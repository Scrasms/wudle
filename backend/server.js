import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// load the environment variables from the .env file
dotenv.config({
  path: '.env'
});

const app = express();

// make server listen on some port
((port = process.env.APP_PORT || 5000) => {
  app.listen(port, () => console.log(`> Listening on port ${port}`));
})();