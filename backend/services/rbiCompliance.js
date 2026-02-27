import fetch from "node-fetch";

export async function checkRBICompliance(documentText, extractedTerms) {
  const prompt = `
You are an RBI banking compliance auditor.

Analyze this home loan document and extracted financial terms.

Return STRICT JSON only:

{
  "prepaymentPenaltyViolation": true | false,
  "penalInterestConcern": true | false,
  "transparencyIssue": true | false,
  "complianceSummary": string
}

Important RBI Rules:
- Floating rate home loans to individuals must NOT have prepayment penalty.
- Penal interest must not be excessive or compounding unfairly.
- Charges must be transparently disclosed.

Loan Type: ${extractedTerms.loanType}

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