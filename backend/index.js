import express from "express";
import cors from "cors";
import analyzeRoute from "./routes/analyze.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/analyze", analyzeRoute);

app.get("/", (req, res) => {
  res.json({ message: "VeridexAI Backend Running 🚀" });
});

// API for testing backend 
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "VeridexAI Backend",
    timestamp: new Date()
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`VeridexAI backend running on port ${PORT}`);
});