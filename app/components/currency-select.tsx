// components/currency-select.tsx
//
// NEW FILE -- modeled on components/layout-select.tsx (same Select
// primitive, same value/onValueChange shape), so it drops into the
// create form and the edit form the same way LayoutSelect does.

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES, getCurrencyMeta } from "@/lib/currency";

export function CurrencySelect({
  value,
  onValueChange,
}: {
  value: string | undefined;
  onValueChange: (id: string) => void;
}) {
  return (
    <Select value={getCurrencyMeta(value).code} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose a currency" />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.symbol} {currency.name} ({currency.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
