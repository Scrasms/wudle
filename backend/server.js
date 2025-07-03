import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config({
  path: '.env'
});
const port = process.env.APP_PORT || 5000;

const app = express();
app.use(cors());

app.get("/word", async (req, res) => {
      try {
        const response = await fetch(`https://random-word-api.vercel.app/api?words=1`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to fetch word"});
    }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
