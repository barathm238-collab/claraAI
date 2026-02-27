import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { extractTextFromPDF } from "../services/pdfService.js";
import { runFinancialAnalysis } from "../services/financialEngine.js";
import { checkRBICompliance } from "../services/rbiCompliance.js";
import {
  calculateRiskScore,
  generateExecutiveSummary,
  generateKeyInsights
} from "../services/riskEngine.js";
import { generateLegalAssistEmail } from "../services/legalAssist.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const extractedText = await extractTextFromPDF(filePath);

    const financialResults = await runFinancialAnalysis(extractedText);

    const complianceResults = await checkRBICompliance(
      extractedText,
      financialResults.extractedTerms
    );

    const riskAssessment = calculateRiskScore(
      financialResults,
      complianceResults
    );

    const executiveSummary = generateExecutiveSummary(riskAssessment);

    const keyInsights = generateKeyInsights(
      financialResults,
      complianceResults
    );

    const legalAssistEmail = await generateLegalAssistEmail(
      financialResults,
      complianceResults
    );

    res.json({
      message: "ClaraAI analysis complete",
      filename: req.file.filename,
      executiveSummary,
      riskAssessment,
      keyInsights,
      financialResults,
      complianceResults,
      legalAssist: legalAssistEmail
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Processing failed" });
  }
});

export default router;