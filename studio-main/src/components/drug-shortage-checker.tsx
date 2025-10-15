'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { checkDrugShortage, FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import ShortagePrediction from './shortage-prediction';
import { drugs } from '@/lib/drugs';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full shrink-0 sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" /> Check Shortage
        </>
      )}
    </Button>
  );
}

export default function DrugShortageChecker() {
  const [state, formAction] = useActionState(checkDrugShortage, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionBoxOpen, setIsSuggestionBoxOpen] = useState(false);

  useEffect(() => {
    if (state.message === 'success') {
      formRef.current?.reset();
      setInputValue('');
    }
  }, [state.message]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 1) {
      const filteredSuggestions = drugs
        .filter(drug => drug.name.toLowerCase().includes(value.toLowerCase()))
        .map(drug => drug.name);
      setSuggestions(filteredSuggestions);
      setIsSuggestionBoxOpen(true);
    } else {
      setSuggestions([]);
      setIsSuggestionBoxOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    setIsSuggestionBoxOpen(false);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Drug Shortage Predictor</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="relative">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                name="drugName"
                placeholder="e.g., Amoxicillin 500mg"
                className="flex-grow text-base"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={() => setTimeout(() => setIsSuggestionBoxOpen(false), 150)}
                onFocus={handleInputChange}
                autoComplete="off"
              />
              <SubmitButton />
            </div>
            {isSuggestionBoxOpen && suggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full rounded-md border bg-card p-1 shadow-lg sm:w-[calc(100%-11rem-0.5rem)]">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="cursor-pointer rounded p-2 text-sm hover:bg-accent/50"
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {state.message && state.message !== 'success' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </form>

        <div className="mt-8">
          {state.data ? <ShortagePrediction data={state.data} /> : (
             <div className="text-center text-muted-foreground">
                <p>Enter a drug name to begin the analysis.</p>
                <p className="text-sm">Examples: "Amoxicillin 500mg", "Metformin 500mg", or "Paracetamol 500mg".</p>
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
