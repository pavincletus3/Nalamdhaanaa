// Implemented with Genkit
'use server';
/**
 * @fileOverview Predicts potential drug shortages and provides an estimated shortage date using an LLM to make its prediction based on available data.
 *
 * - predictDrugShortageWithReasoning - A function that handles the drug shortage prediction process.
 * - PredictDrugShortageWithReasoningInput - The input type for the predictDrugShortageWithReasoning function.
 * - PredictDrugShortageWithReasoningOutput - The return type for the predictDrugShortageWithReasoning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictDrugShortageWithReasoningInputSchema = z.object({
  drugName: z.string().describe('The name of the drug to check for shortage.'),
  riskFactors: z.array(z.string()).optional().describe('The list of risk factors affecting the drug availability'),
  alternatives: z.array(z.object({
    name: z.string(),
    price: z.number(),
    availability: z.string()
  })).optional().describe('List of alternative drugs')
});
export type PredictDrugShortageWithReasoningInput = z.infer<typeof PredictDrugShortageWithReasoningInputSchema>;

const PredictDrugShortageWithReasoningOutputSchema = z.object({
  found: z.boolean().describe('Whether the drug was found in the database.'),
  drugName: z.string().describe('The name of the drug.'),
  genericName: z.string().describe('The generic name of the drug.'),
  category: z.string().describe('The category of the drug.'),
  shortageRisk: z.object({
    level: z.string().describe('The shortage risk level (HIGH, MEDIUM, LOW).'),
    percentage: z.string().describe('The shortage risk percentage.'),
    score: z.number().describe('The shortage risk score'),
    color: z.string().describe('Color corresponding to risk level.'),
    icon: z.string().describe('Emoji icon corresponding to risk level.')
  }).describe('The shortage risk information.'),
  riskFactors: z.array(z.string()).describe('The risk factors contributing to the shortage.'),
  warning: z.string().describe('Descriptive warning message based on the shortage risk.'),
  estimatedShortageDate: z.string().describe('The estimated date of the shortage.'),
  daysUntilShortage: z.number().describe('The number of days until the estimated shortage date.'),
  alternatives: z.array(z.object({
    name: z.string(),
    price: z.number(),
    availability: z.string()
  })).describe('Alternative medications sorted by availability and price.'),
  pricing: z.object({
    currentPrice: z.string().describe('The current price of the drug in rupees (₹).'),
    cheapestAlternative: z.string().describe('The name of the cheapest alternative drug.'),
    cheapestPrice: z.string().describe('The price of the cheapest alternative drug in rupees (₹).'),
    monthlySavings: z.string().describe('The potential monthly savings in rupees (₹) by switching to the cheapest alternative.')
  }).describe('The pricing information.'),
  recommendations: z.array(z.object({
    priority: z.string().describe('The priority level of the recommendation (URGENT, HIGH, MEDIUM, LOW).'),
    action: z.string().describe('The recommended action to take.'),
    details: z.string().describe('Additional details about the recommended action.')
  })).describe('The list of actionable recommendations.')
});
export type PredictDrugShortageWithReasoningOutput = z.infer<typeof PredictDrugShortageWithReasoningOutputSchema>;

export async function predictDrugShortageWithReasoning(input: PredictDrugShortageWithReasoningInput): Promise<PredictDrugShortageWithReasoningOutput> {
  return predictDrugShortageWithReasoningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictDrugShortageWithReasoningPrompt',
  input: {schema: PredictDrugShortageWithReasoningInputSchema},
  output: {schema: PredictDrugShortageWithReasoningOutputSchema},
  prompt: `You are an expert in predicting drug shortages. Based on the provided information about the drug,
  its risk factors, and available alternatives, predict the likelihood of a drug shortage, estimate the shortage date,
  and provide recommendations. All monetary values should be in Indian Rupees (₹).

  Drug Name: {{{drugName}}}
  Risk Factors: {{#if riskFactors}}{{#each riskFactors}}{{{this}}}, {{/each}}{{else}}None{{/if}}
  Alternatives: {{#if alternatives}}{{#each alternatives}}{{{name}}} ({{{availability}}}, ₹{{{price}}}), {{/each}}{{else}}None{{/if}}

  Consider the following:
  - A HIGH risk score (above 0.7) indicates a potential shortage within 15 days.
  - A MEDIUM risk score (0.5 - 0.7) indicates a potential shortage within 30 days.
  - A LOW risk score (below 0.5) indicates a potential shortage within 60 days.

  Here's how to determine the estimated shortage date:
  1.  Calculate the days until shortage based on risk level.
  2.  Add the calculated number of days to the current date.

  Return the prediction in JSON format, including all required fields. All fields should be populated even if data is not available.

  Make sure to properly fill in the shortageRisk object. The 'level' property should be HIGH, MEDIUM, or LOW based on score.
  The percentage should be the score multiplied by 100 as a string.
  The 'icon' property should be an emoji relevant to the risk.
  The 'color' property should be a color relevant to the risk.

  The pricing object should provide a cost comparison of the drug with its alternatives. Ensure all prices and savings are prefixed with the rupee symbol (₹).
  For recommendations, provide a list of actionable steps based on the shortage risk with an appropriate priority level.
`,
});

const predictDrugShortageWithReasoningFlow = ai.defineFlow(
  {
    name: 'predictDrugShortageWithReasoningFlow',
    inputSchema: PredictDrugShortageWithReasoningInputSchema,
    outputSchema: PredictDrugShortageWithReasoningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
