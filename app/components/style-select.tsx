// components/style-select.tsx
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
  CV_STYLES,
  DEFAULT_CV_STYLE_ID,
  type CvStyleCategory,
} from "@/lib/styles";

const CATEGORY_LABEL: Record<CvStyleCategory, string> = {
  neutral: "Neutral",
  color: "Solid colors",
  gradient: "Gradients",
};

const CATEGORY_ORDER: CvStyleCategory[] = ["neutral", "color", "gradient"];

export function StyleSelect({
  value,
  onValueChange,
}: {
  value: string | undefined;
  onValueChange: (id: string) => void;
}) {
  return (
    <Select value={value ?? DEFAULT_CV_STYLE_ID} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose a style" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORY_ORDER.map((category) => (
          <SelectGroup key={category}>
            <SelectLabel>{CATEGORY_LABEL[category]}</SelectLabel>
            {CV_STYLES.filter((s) => s.category === category).map((style) => (
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
