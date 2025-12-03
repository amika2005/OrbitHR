"use client";

import { Currency } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface CurrencyToggleProps {
  selectedCurrency: Currency;
  onToggle: (currency: Currency) => void;
}

export function CurrencyToggle({
  selectedCurrency,
  onToggle,
}: CurrencyToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <DollarSign className="h-4 w-4 text-gray-500 ml-2" />
      <Button
        size="sm"
        variant={selectedCurrency === Currency.JPY ? "default" : "ghost"}
        onClick={() => onToggle(Currency.JPY)}
        className={`
          transition-all
          ${selectedCurrency === Currency.JPY ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-200"}
        `}
      >
        JPY (¥)
      </Button>
      <Button
        size="sm"
        variant={selectedCurrency === Currency.LKR ? "default" : "ghost"}
        onClick={() => onToggle(Currency.LKR)}
        className={`
          transition-all
          ${selectedCurrency === Currency.LKR ? "bg-blue-600 text-white shadow-md" : "hover:bg-gray-200"}
        `}
      >
        LKR (Rs)
      </Button>
    </div>
  );
}
