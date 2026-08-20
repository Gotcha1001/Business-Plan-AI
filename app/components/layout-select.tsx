// components/layout-select.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CV_LAYOUTS, DEFAULT_CV_LAYOUT_ID } from "@/lib/layouts";

export function LayoutSelect({
  value,
  onValueChange,
}: {
  value: string | undefined;
  onValueChange: (id: string) => void;
}) {
  const selected = CV_LAYOUTS.find(
    (l) => l.id === (value ?? DEFAULT_CV_LAYOUT_ID),
  );

  return (
    <div className="space-y-1.5">
      <Select
        value={value ?? DEFAULT_CV_LAYOUT_ID}
        onValueChange={onValueChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a layout" />
        </SelectTrigger>
        <SelectContent>
          {CV_LAYOUTS.map((layout) => (
            <SelectItem key={layout.id} value={layout.id}>
              {layout.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selected && (
        <p className="text-xs text-muted-foreground">{selected.description}</p>
      )}
    </div>
  );
}
