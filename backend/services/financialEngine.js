import fetch from "node-fetch";

/* ===========================
   1️⃣ LLM EXTRACTION LAYER
=========================== */

export async function extractFinancialTerms(documentText) {
  const prompt = `
You are a financial document analyst.

Extract ONLY the following fields from this home loan document.

Return STRICT valid JSON.
Do NOT include explanation.
Do NOT include markdown.

{
  "principal": number,
  "interestRate": number,
  "tenureYears": number,
  "processingFee": number,
  "emiMentioned": number,
  "loanType": "Fixed" | "Floating"
}

If a value is not found, return null.

Document:
${documentText}
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false,
      format: "json"
    })
  });

  const data = await response.json();
  return JSON.parse(data.response);
}

/* ===========================
   2️⃣ DETERMINISTIC MATH ENGINE
=========================== */

export function calculateEMI(principal, annualRate, tenureYears) {
  const monthlyRate = annualRate / 100 / 12;
  const months = tenureYears * 12;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return Math.round(emi);
}

export function calculateTotalPayment(emi, tenureYears) {
  return emi * tenureYears * 12;
}

export function calculateTotalInterest(totalPayment, principal) {
  return totalPayment - principal;
}

export function calculateRupeeGap(principal, advertisedRate, tenureYears) {
  const emiAdvertised = calculateEMI(principal, advertisedRate, tenureYears);
  const totalAdvertised = calculateTotalPayment(emiAdvertised, tenureYears);

  const emiTrue = calculateEMI(principal, advertisedRate + 1, tenureYears);
  const totalTrue = calculateTotalPayment(emiTrue, tenureYears);

  return totalTrue - totalAdvertised;
}

/* ===========================
   3️⃣ FULL FINANCIAL ANALYSIS
=========================== */

export async function runFinancialAnalysis(documentText) {
  const extracted = await extractFinancialTerms(documentText);

  const {
    principal,
    interestRate,
    tenureYears,
    processingFee,
    emiMentioned,
    loanType
  } = extracted;

  if (!principal || !interestRate || !tenureYears) {
    throw new Error("Missing critical financial fields in document.");
  }

  const emiCalculated = calculateEMI(principal, interestRate, tenureYears);
  const totalPayment = calculateTotalPayment(emiCalculated, tenureYears);
  const totalInterest = calculateTotalInterest(totalPayment, principal);
  const rupeeGap = calculateRupeeGap(principal, interestRate, tenureYears);

  const interestToPrincipalRatio = Number(
    (totalInterest / principal).toFixed(2)
  );

  const emiMismatch =
    emiMentioned && Math.abs(emiMentioned - emiCalculated) > 50;

  return {
    extractedTerms: extracted,
    emiCalculated,
    totalPayment,
    totalInterest,
    interestToPrincipalRatio,
    rupeeGap,
    emiMismatch
  };
}