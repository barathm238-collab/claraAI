import fetch from "node-fetch";

export async function generateLegalAssistEmail(
  financialResults,
  complianceResults
) {
  const {
    totalPayment,
    totalInterest,
    rupeeGap,
    emiMismatch,
    emiCalculated,
    extractedTerms
  } = financialResults;

  const {
    prepaymentPenaltyViolation,
    transparencyIssue,
    penalInterestConcern
  } = complianceResults;

  let issueStatements = "";

  if (emiMismatch) {
    issueStatements += `
- The EMI mentioned in the agreement differs from the calculated EMI of ₹${emiCalculated}.
`;
  }

  if (prepaymentPenaltyViolation) {
    issueStatements += `
- The agreement includes a prepayment penalty on a floating rate home loan.
As per RBI guidelines, floating rate home loans to individuals must not carry prepayment penalties.
`;
  }

  if (penalInterestConcern) {
    issueStatements += `
- The penal interest rate structure may be excessive or unfairly compounding.
`;
  }

  if (transparencyIssue) {
    issueStatements += `
- There appears to be insufficient transparency in the disclosure of charges.
`;
  }

  if (issueStatements.trim() === "") {
    issueStatements = `
- No major structural or regulatory discrepancies were detected.
`;
  }

  const prompt = `
You are drafting a professional, neutral communication to a bank.

STRICT RULES:
- Use factual tone.
- Do NOT invent financial discrepancies.
- Do NOT exaggerate.
- Do NOT add issues beyond those listed below.
- If no issues are present, draft a neutral clarification request.

Loan Details:
Principal: ₹${extractedTerms.principal}
Interest Rate: ${extractedTerms.interestRate}%
Tenure: ${extractedTerms.tenureYears} years
Total Payment: ₹${totalPayment}
Total Interest: ₹${totalInterest}
Estimated Additional Cost Exposure: ₹${rupeeGap}

Identified Points:
${issueStatements}

Write a professional email requesting clarification or corrective action strictly based on the above points.
Return plain email text only.
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false
    })
  });

  const data = await response.json();
  return data.response;
}