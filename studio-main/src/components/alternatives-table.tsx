import type { PredictDrugShortageWithReasoningOutput } from "@/ai/flows/predict-drug-shortage-with-reasoning";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Props = {
  alternatives: PredictDrugShortageWithReasoningOutput['alternatives'];
};

export default function AlternativesTable({ alternatives }: Props) {

  const availabilityBadgeClass = (availability: string): string => {
    switch (availability.toLowerCase()) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  if (!alternatives || alternatives.length === 0) {
    return <p className="text-sm text-center text-muted-foreground py-4">No alternatives available.</p>
  }

  return (
    <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alternatives.map((alt, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{alt.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${availabilityBadgeClass(alt.availability)} capitalize`}>
                    {alt.availability}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{alt.price ? `₹${alt.price.toFixed(2)}` : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
}
