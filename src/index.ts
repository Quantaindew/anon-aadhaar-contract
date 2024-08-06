import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import proofRoutes from "./routes/proofRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    //    origin: "http://example.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api/proof", proofRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

