import { ClientIntake, RiskReport } from "./types";
import { generateFullReport } from "./riskEngine";

export async function generateAIReportWithOpenAI(userProfile: ClientIntake): Promise<RiskReport> {
  // Future integration point: send the structured rule report to a server-side OpenAI API
  // route to add plain-language explanations. Keep deterministic scores in the rule engine.
  return Promise.resolve(generateFullReport(userProfile));
}
