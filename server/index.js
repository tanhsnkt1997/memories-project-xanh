import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import postRoutes from "./routes/post.js";

const app = express();
dotenv.config();

app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/posts", postRoutes);
app.get("/", (req, res) => {
  res.send("Hello to api");
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
  })
  .catch((err) => {
    console.log(err.message);
  });

mongoose.set("useFindAndModify", false);
