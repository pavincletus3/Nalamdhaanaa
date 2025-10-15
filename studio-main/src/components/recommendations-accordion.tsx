import type { PredictDrugShortageWithReasoningOutput } from "@/ai/flows/predict-drug-shortage-with-reasoning";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

type Props = {
  recommendations: PredictDrugShortageWithReasoningOutput['recommendations'];
};

export default function RecommendationsAccordion({ recommendations }: Props) {
  
  const priorityBadgeClass = (priority: string): string => {
    switch (priority.toUpperCase()) {
      case 'URGENT':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
      case 'HIGH':
        return 'bg-orange-500 text-white hover:bg-orange-500/90';
      case 'MEDIUM':
        return 'bg-yellow-400 text-yellow-900 hover:bg-yellow-400/90 border border-yellow-500';
      case 'LOW':
        return 'bg-green-100 text-green-800 hover:bg-green-100/90 border border-green-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  }

  if (!recommendations || recommendations.length === 0) {
    return <p className="text-sm text-center text-muted-foreground py-4">No specific recommendations at this time.</p>
  }
  
  return (
    <Accordion type="single" collapsible className="w-full">
      {recommendations.map((rec, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-4 text-left">
                <Badge className={`${priorityBadgeClass(rec.priority)} shrink-0`}>{rec.priority}</Badge>
                <span className="font-semibold">{rec.action}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-16">
            <p className="text-muted-foreground">{rec.details}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
