import type { PredictDrugShortageWithReasoningOutput } from "@/ai/flows/predict-drug-shortage-with-reasoning";

type Props = {
  risk: PredictDrugShortageWithReasoningOutput['shortageRisk'];
};

export default function RiskIndicator({ risk }: Props) {
  const score = risk.score * 100;

  const riskClasses = {
    HIGH: { text: 'text-destructive', bg: 'bg-destructive' },
    MEDIUM: { text: 'text-orange-500', bg: 'bg-orange-500' },
    LOW: { text: 'text-green-600', bg: 'bg-green-600' },
  }[risk.level.toUpperCase()] || { text: 'text-muted-foreground', bg: 'bg-muted' };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <div className={`text-3xl font-bold ${riskClasses.text}`}>{risk.level}</div>
        <div className="text-lg font-semibold text-muted-foreground">{risk.percentage}</div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${riskClasses.bg}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
