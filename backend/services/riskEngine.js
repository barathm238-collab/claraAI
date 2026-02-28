export function calculateRiskScore(financialResults, complianceResults) {
  let score = 0;

  if (financialResults.emiMismatch) score += 20;
  if (complianceResults.prepaymentPenaltyViolation) score += 40;
  if (complianceResults.penalInterestConcern) score += 20;
  if (complianceResults.transparencyIssue) score += 20;

  let riskLevel = "Low";
  let riskColor = "Green";

  if (score >= 60) {
    riskLevel = "High";
    riskColor = "Red";
  } else if (score >= 30) {
    riskLevel = "Moderate";
    riskColor = "Amber";
  }

  return {
    riskScore: score,
    riskLevel,
    riskColor
  };
}

export function generateExecutiveSummary(riskAssessment) {
  if (riskAssessment.riskLevel === "High") {
    return "High risk loan agreement due to regulatory violations and structural concerns.";
  }

  if (riskAssessment.riskLevel === "Moderate") {
    return "Moderate risk loan agreement with financial or compliance inconsistencies.";
  }

  if (riskAssessment.riskLevel === "Low" && riskAssessment.riskScore > 0) {
    return "Low risk loan agreement with minor structural concerns detected.";
  }

  return "Low risk loan agreement with no significant issues detected.";
}

export function generateKeyInsights(financialResults, complianceResults) {
  const insights = [];

  if (financialResults.emiMismatch) {
    insights.push("EMI discrepancy detected.");
  }

  if (complianceResults.prepaymentPenaltyViolation) {
    insights.push("RBI violation: Prepayment penalty on floating rate loan.");
  }

  if (complianceResults.penalInterestConcern) {
    insights.push("Penal interest structure may be excessive.");
  }

  if (complianceResults.transparencyIssue) {
    insights.push("Lack of transparency in charge disclosure.");
  }

  if (insights.length === 0) {
    insights.push("No major structural or regulatory issues detected.");
  }

  return insights;
}