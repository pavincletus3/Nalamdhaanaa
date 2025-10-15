'use server';

import { z } from 'zod';
import { predictDrugShortageWithReasoning, PredictDrugShortageWithReasoningInput, PredictDrugShortageWithReasoningOutput } from '@/ai/flows/predict-drug-shortage-with-reasoning';
import { drugs } from '@/lib/drugs';

const formSchema = z.object({
  drugName: z.string().min(1, 'Drug name is required.'),
});

export type FormState = {
  message: string;
  data?: PredictDrugShortageWithReasoningOutput;
  issues?: string[];
};

export async function checkDrugShortage(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    drugName: formData.get('drugName'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Error: Invalid input.',
      issues: validatedFields.error.flatten().fieldErrors.drugName,
    };
  }

  const { drugName } = validatedFields.data;

  const drugInfo = drugs.find(d => d.name.toLowerCase() === drugName.toLowerCase());

  if (!drugInfo) {
    return {
      message: `Error: Drug "${drugName}" not found in our database. Please check the spelling or try a different drug.`,
    };
  }

  try {
    const input: PredictDrugShortageWithReasoningInput = {
      drugName: drugInfo.name,
      riskFactors: drugInfo.risk_factors,
      alternatives: drugInfo.alternatives.map(alt => ({
        name: alt.name,
        price: alt.price,
        availability: alt.availability,
      })),
    };

    const result = await predictDrugShortageWithReasoning(input);

    const availabilityOrder: Record<string, number> = { high: 1, medium: 2, low: 3 };
    if (result.alternatives) {
        result.alternatives.sort((a, b) => {
            const availabilityComparison = availabilityOrder[a.availability.toLowerCase()] - availabilityOrder[b.availability.toLowerCase()];
            if (availabilityComparison !== 0) {
                return availabilityComparison;
            }
            return a.price - b.price;
        });
    }

    return { message: 'success', data: result };
  } catch (error) {
    console.error(error);
    return { message: 'Error: Failed to get prediction from AI. Please try again later.' };
  }
}
