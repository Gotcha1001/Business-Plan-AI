// components/style-select.tsx
//
// FIX: this file was still importing CV_STYLES / DEFAULT_CV_STYLE_ID /
// CvStyleCategory from lib/styles.ts — but lib/styles.ts was already
// transformed to export PLAN_STYLES / DEFAULT_PLAN_STYLE_ID / PlanStyleCategory
// instead. That mismatch would break the build the moment anything imported
// this component. Renamed to match; no other logic changed.

"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PLAN_STYLES,
  DEFAULT_PLAN_STYLE_ID,
  type PlanStyleCategory,
} from "@/lib/styles";

const CATEGORY_LABEL: Record<PlanStyleCategory, string> = {
  neutral: "Neutral",
  color: "Solid colors",
  gradient: "Gradients",
};

const CATEGORY_ORDER: PlanStyleCategory[] = ["neutral", "color", "gradient"];

export function StyleSelect({
  value,
  onValueChange,
}: {
  value: string | undefined;
  onValueChange: (id: string) => void;
}) {
  return (
    <Select
      value={value ?? DEFAULT_PLAN_STYLE_ID}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose a style" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORY_ORDER.map((category) => (
          <SelectGroup key={category}>
            <SelectLabel>{CATEGORY_LABEL[category]}</SelectLabel>
            {PLAN_STYLES.filter((s) => s.category === category).map((style) => (
              <SelectItem key={style.id} value={style.id}>
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-3 w-3 rounded-full ${style.swatch}`}
                    aria-hidden
                  />
                  {style.name}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
