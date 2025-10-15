import type { PredictDrugShortageWithReasoningOutput } from "@/ai/flows/predict-drug-shortage-with-reasoning";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BarChart2, Pill, AlertTriangle, CheckCircle, AlertCircle as AlertCircleIcon } from "lucide-react";
import RiskIndicator from "./risk-indicator";
import AlternativesTable from "./alternatives-table";
import RecommendationsAccordion from "./recommendations-accordion";

type Props = {
  data: PredictDrugShortageWithReasoningOutput;
};

export default function ShortagePrediction({ data }: Props) {
  if (!data.found) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Drug Not Found</AlertTitle>
        <AlertDescription>
          The drug you searched for could not be found. Please check the spelling.
        </AlertDescription>
      </Alert>
    );
  }

  const riskClasses = {
    HIGH: {
      alert: 'border-destructive/50 text-destructive bg-destructive/10',
      title: 'text-destructive'
    },
    MEDIUM: {
      alert: 'border-orange-500/50 text-orange-600 bg-orange-500/10',
      title: 'text-orange-600'
    },
    LOW: {
        alert: 'border-green-500/50 text-green-700 bg-green-500/10',
        title: 'text-green-700'
    },
  }[data.shortageRisk.level.toUpperCase()] || { alert: 'border-border', title: 'text-foreground' };
  

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="space-y-2">
        <h2 className="font-headline text-3xl font-bold tracking-tight">{data.drugName}</h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{data.genericName}</span>
          <span className="text-sm">•</span>
          <Badge variant="secondary">{data.category}</Badge>
        </div>
      </div>

      <Alert className={riskClasses.alert}>
        <span className="mr-3 text-2xl">{data.shortageRisk.icon}</span>
        <div>
            <AlertTitle className={`font-bold text-lg ${riskClasses.title}`}>Warning</AlertTitle>
            <AlertDescription className="font-medium">
            {data.warning}
            </AlertDescription>
        </div>
      </Alert>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-between">
                    <span>Shortage Risk</span>
                    <BarChart2 className="h-5 w-5 text-muted-foreground"/>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <RiskIndicator risk={data.shortageRisk} />
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-between">
                    <span>Time to Shortage</span>
                    <Clock className="h-5 w-5 text-muted-foreground"/>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{data.daysUntilShortage} days</div>
                <p className="text-xs text-muted-foreground">Estimated shortage by {data.estimatedShortageDate}</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-between">
                    <span>Pricing & Savings</span>
                    <span className="font-bold text-muted-foreground">₹</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{data.pricing.currentPrice}</div>
                <p className="text-xs text-muted-foreground">
                    Switch to {data.pricing.cheapestAlternative} to save ~<span className="font-semibold text-primary">{data.pricing.monthlySavings}/month</span>
                </p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <Pill className="h-5 w-5" />
              Alternative Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlternativesTable alternatives={data.alternatives} />
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-xl">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Factors
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {data.riskFactors.map((factor, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="mt-1.5 h-2 w-2 rounded-full bg-muted-foreground/50 shrink-0" />
                            <span className="text-sm capitalize">{factor.replace(/_/g, ' ')}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-xl">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Actionable Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecommendationsAccordion recommendations={data.recommendations} />
        </CardContent>
      </Card>
    </div>
  );
}
