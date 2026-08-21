// components/layout-select.tsx
//
// NEW FILE — not a conversion of an existing one. The old CV app's
// LayoutSelect (imported by cv-version-edit-form.tsx as
// "@/app/components/layout-select") was never part of this transform
// doc, and nothing else in the current plan codebase references a
// LayoutSelect either — so there was nothing to convert from. Built
// fresh, modeled on the already-fixed style-select.tsx, against
// PLAN_LAYOUTS from lib/layouts.ts (flat list, no categories, unlike
// PLAN_STYLES).

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PLAN_LAYOUTS, getPlanLayoutMeta } from "@/lib/layouts";

export function LayoutSelect({
  value,
  onValueChange,
}: {
  value: string | undefined;
  onValueChange: (id: string) => void;
}) {
  return (
    <Select value={getPlanLayoutMeta(value).id} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose a layout" />
      </SelectTrigger>
      <SelectContent>
        {PLAN_LAYOUTS.map((layout) => (
          <SelectItem key={layout.id} value={layout.id}>
            {layout.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
