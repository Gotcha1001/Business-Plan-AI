// lib/currency.ts
//
// NEW FILE. Nothing here replaces an old CV-app equivalent.
//
// Every plan layout (PDF and web) currently imports a hardcoded-USD
// `money()` from lib/plan-data.ts and calls it ~50 times combined across
// the 5 pdf-layouts + 4 web plan-layouts files. Rather than touch every
// call site, each layout file gets ONE new line at the top:
//
//   const money = formatMoney(currency);
//
// That shadows the plain import and every existing `money(x)` call below
// it keeps working unchanged, now currency-aware.

export interface CurrencyMeta {
  code: string; // ISO 4217
  name: string;
  symbol: string;
  locale: string; // Intl locale that renders this currency the way people expect
}

export const CURRENCIES: CurrencyMeta[] = [
  { code: "ZAR", name: "South African Rand", symbol: "R", locale: "en-ZA" },
  { code: "USD", name: "US Dollar", symbol: "$", locale: "en-US" },
  { code: "EUR", name: "Euro", symbol: "\u20ac", locale: "en-IE" },
  { code: "GBP", name: "British Pound", symbol: "\u00a3", locale: "en-GB" },
  { code: "NGN", name: "Nigerian Naira", symbol: "\u20a6", locale: "en-NG" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", locale: "en-KE" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH\u20b5", locale: "en-GH" },
  { code: "BWP", name: "Botswana Pula", symbol: "P", locale: "en-BW" },
  { code: "NAD", name: "Namibian Dollar", symbol: "N$", locale: "en-NA" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", locale: "en-AU" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", locale: "en-CA" },
  { code: "INR", name: "Indian Rupee", symbol: "\u20b9", locale: "en-IN" },
];

// South Africa is the default audience for this app -- Rand first, not USD.
export const DEFAULT_CURRENCY_CODE = "ZAR";

export function getCurrencyMeta(code?: string | null): CurrencyMeta {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/**
 * Returns a money formatter bound to one currency. Falls back to a plain
 * symbol + rounded number if the browser/Node Intl data doesn't recognize
 * the ISO code for some reason, so a bad/unknown code never throws.
 */
export function formatMoney(currencyCode?: string | null) {
  const meta = getCurrencyMeta(currencyCode);
  return (n: number | null | undefined): string => {
    if (n === null || n === undefined || Number.isNaN(n)) return "n/a";
    try {
      return n.toLocaleString(meta.locale, {
        style: "currency",
        currency: meta.code,
        maximumFractionDigits: 0,
      });
    } catch {
      return `${meta.symbol}${Math.round(n).toLocaleString()}`;
    }
  };
}
