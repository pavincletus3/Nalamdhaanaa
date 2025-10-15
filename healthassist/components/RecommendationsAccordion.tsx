import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";

interface Recommendation {
  priority: string;
  action: string;
  details: string;
}

interface Props {
  recommendations: Recommendation[];
}

const RecommendationsAccordion: React.FC<Props> = ({ recommendations }) => {
  const priorityBadgeClass = (priority: string): string => {
    switch (priority.toUpperCase()) {
      case "URGENT":
        return "bg-red-600 text-white hover:bg-red-700";
      case "HIGH":
        return "bg-orange-500 text-white hover:bg-orange-600";
      case "MEDIUM":
        return "bg-yellow-400 text-yellow-900 hover:bg-yellow-500 border border-yellow-500";
      case "LOW":
        return "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <p className="text-sm text-center text-gray-500 py-4">
        No specific recommendations at this time.
      </p>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {recommendations.map((rec, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-4 text-left">
              <Badge className={`${priorityBadgeClass(rec.priority)} shrink-0`}>
                {rec.priority}
              </Badge>
              <span className="font-semibold">{rec.action}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-16">
            <p className="text-gray-600">{rec.details}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default RecommendationsAccordion;
