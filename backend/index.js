import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "ClaraAI Backend Running 🚀" });
});

// API for testing backend 
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "ClaraAI Backend",
    timestamp: new Date()
  });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`ClaraAI backend running on port ${PORT}`);
});