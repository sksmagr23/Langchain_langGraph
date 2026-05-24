import "dotenv/config";
import express from "express";
import cors from "cors";
import { kbRouter } from "./routes/light_rag_kb";

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
  })
);

app.use(express.json());

app.use("/kb", kbRouter);

const port = Number(process.env.PORT ?? 5000);
app.listen(port, () => {
  console.log(`server is now running on port ${port}`);
});
