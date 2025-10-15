import DrugShortageChecker from "@/components/drug-shortage-checker";
import { Pill } from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex items-center gap-3">
          <Pill className="h-12 w-12 text-primary" />
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Nalamdhaanaa
          </h1>
        </div>
        <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Proactively predict and manage drug shortages. Enter a drug name below to get an instant risk assessment.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-4xl">
        <DrugShortageChecker />
      </div>
    </main>
  );
}
