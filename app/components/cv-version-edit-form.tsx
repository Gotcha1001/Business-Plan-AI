// components/cv-version-edit-form.tsx
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { Doc } from "@/convex/_generated/dataModel";
import type { GeneratedCvContent } from "@/lib/cv-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StyleSelect } from "@/app/components/style-select";
import { LayoutSelect } from "@/app/components/layout-select";
import { DEFAULT_CV_STYLE_ID } from "@/lib/styles";
import { DEFAULT_CV_LAYOUT_ID } from "@/lib/layouts";
import { toast } from "sonner";

// Same section-card look as app/(dashboard)/dashboard/create/page.tsx so the
// two forms feel like the same product.
const SECTION_CLASS =
  "space-y-3 rounded-2xl border border-zinc-900/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5";

type FormValues = {
  // --- version-level (generatedContent on cvVersions) ---
  style: string;
  layout: string;
  headline: string;
  summary: string;
  topSkills: string; // comma-separated in the form, array on save
  experience: GeneratedCvContent["experience"];
  education: GeneratedCvContent["education"];
  closingNote: string;

  // --- cv-level (personalInfo/testimonials/references/links/achievements on cvs) ---
  personalInfo: {
    fullName: string;
    idNumber: string;
    address: string;
    email: string;
    phone: string;
  };
  testimonials: { author: string; authorRole: string; text: string }[];
  references: { name: string; relationship: string; contact: string }[];
  links: { label: string; url: string; description: string }[];
  achievements: { title: string; description: string; date: string }[];
};

export function CvVersionEditForm({
  versionId,
  content,
  currentStyle,
  currentLayout,
  cv,
  onSaved,
  onCancel,
}: {
  versionId: Id<"cvVersions">;
  content: GeneratedCvContent;
  currentStyle?: string;
  currentLayout?: string;
  // Parent cv record — carries personalInfo/testimonials/references/links/
  // achievements, which live on cvs (shared across versions), not on the
  // per-version generatedContent. Pass this in from the edit page's getCv query.
  cv: Doc<"cvs">;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const updateVersionContent = useMutation(api.cvs.updateVersionContent);
  const upsertCv = useMutation(api.cvs.upsertCv);
  const [saving, setSaving] = useState(false);

  const { register, control, handleSubmit, watch, setValue } =
    useForm<FormValues>({
      defaultValues: {
        style: currentStyle ?? DEFAULT_CV_STYLE_ID,
        layout: currentLayout ?? DEFAULT_CV_LAYOUT_ID,
        headline: content.headline ?? "",
        summary: content.summary ?? "",
        topSkills: (content.topSkills ?? []).join(", "),
        experience: content.experience?.length
          ? content.experience
          : [{ company: "", role: "", period: "", bullets: [] }],
        education: content.education?.length
          ? content.education
          : [
              {
                institution: "",
                qualification: "",
                period: "",
                description: "",
              },
            ],
        closingNote: content.closingNote ?? "",
        personalInfo: {
          fullName: cv.personalInfo?.fullName ?? "",
          idNumber: cv.personalInfo?.idNumber ?? "",
          address: cv.personalInfo?.address ?? "",
          email: cv.personalInfo?.email ?? "",
          phone: cv.personalInfo?.phone ?? "",
        },
        testimonials: cv.testimonials?.length
          ? cv.testimonials.map((t) => ({
              author: t.author ?? "",
              authorRole: t.authorRole ?? "",
              text: t.text ?? "",
            }))
          : [{ author: "", authorRole: "", text: "" }],
        references: cv.references?.length
          ? cv.references.map((r) => ({
              name: r.name ?? "",
              relationship: r.relationship ?? "",
              contact: r.contact ?? "",
            }))
          : [{ name: "", relationship: "", contact: "" }],
        links: cv.links?.length
          ? cv.links.map((l) => ({
              label: l.label ?? "",
              url: l.url ?? "",
              description: l.description ?? "",
            }))
          : [{ label: "", url: "", description: "" }],
        achievements: cv.achievements?.length
          ? cv.achievements.map((a) => ({
              title: a.title ?? "",
              description: a.description ?? "",
              date: a.date ?? "",
            }))
          : [{ title: "", description: "", date: "" }],
      },
    });

  const exp = useFieldArray({ control, name: "experience" });
  const edu = useFieldArray({ control, name: "education" });
  const tst = useFieldArray({ control, name: "testimonials" });
  const ref = useFieldArray({ control, name: "references" });
  const lnk = useFieldArray({ control, name: "links" });
  const ach = useFieldArray({ control, name: "achievements" });

  const style = watch("style");
  const layout = watch("layout");

  async function onSubmit(values: FormValues) {
    setSaving(true);
    try {
      const merged: GeneratedCvContent = {
        ...content, // preserves testimonialHighlights/achievementHighlights untouched
        headline: values.headline,
        summary: values.summary,
        topSkills: values.topSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experience: values.experience,
        education: values.education,
        closingNote: values.closingNote,
      };

      // Upsert-replace: same versionId, no new row created.
      await updateVersionContent({
        versionId,
        generatedContent: merged,
        style: values.style,
        layout: values.layout,
      });

      // personalInfo/testimonials/references/links/achievements live on the
      // parent cv record (shared across every version of this application),
      // not on the version's generatedContent — so they save through
      // upsertCv instead. Everything not editable on this form (title,
      // targetRole, jobDescription, isNeutral, base education/experience,
      // interests) is carried over unchanged from the loaded cv.
      //
      // preserveStatus: true — CRITICAL. Without this, upsertCv defaults to
      // knocking cv.status back to "draft". cv.status is shared across every
      // version of this CV, and CvAnimatedView renders "Generating..." for
      // both "draft" and "generating" — with nothing to ever flip it back to
      // "ready" from this save path. Omitting this is what caused every
      // version's preview to get stuck showing "Generating..." forever after
      // any single history edit.
      await upsertCv({
        cvId: cv._id,
        preserveStatus: true,
        title: cv.title,
        targetRole: cv.targetRole,
        jobDescription: cv.jobDescription,
        isNeutral: cv.isNeutral,
        personalInfo: {
          fullName: values.personalInfo.fullName,
          idNumber: values.personalInfo.idNumber || undefined,
          address: values.personalInfo.address || undefined,
          email: values.personalInfo.email,
          phone: values.personalInfo.phone || undefined,
          photoUrl: cv.personalInfo?.photoUrl,
          videoUrl: cv.personalInfo?.videoUrl,
        },
        education: cv.education,
        experience: cv.experience,
        testimonials: values.testimonials,
        references: values.references,
        links: values.links,
        achievements: values.achievements,
        interests: cv.interests,
      });

      toast.success("Version updated in place");
      onSaved();
    } catch {
      toast.error("Couldn't save — try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className={SECTION_CLASS}>
        <h2 className="font-[family-name:var(--font-display)] text-lg text-zinc-900 dark:text-white">
          Appearance
        </h2>
        <div>
          <Label className="text-zinc-900 dark:text-white">Color style</Label>
          <StyleSelect
            value={style}
            onValueChange={(id) => setValue("style", id, { shouldDirty: true })}
          />
        </div>
        <div>
          <Label className="text-zinc-900 dark:text-white">Layout</Label>
          <LayoutSelect
            value={layout}
            onValueChange={(id) =>
              setValue("layout", id, { shouldDirty: true })
            }
          />
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="font-[family-name:var(--font-display)] text-lg text-zinc-900 dark:text-white">
          Personal & contact info
        </h2>
        <Input
          {...register("personalInfo.fullName")}
          placeholder="Full name"
          required
        />
        <Input {...register("personalInfo.idNumber")} placeholder="ID number" />
        <Input {...register("personalInfo.address")} placeholder="Address" />
        <Input
          {...register("personalInfo.email")}
          placeholder="Email"
          type="email"
          required
        />
        <Input {...register("personalInfo.phone")} placeholder="Phone" />
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="font-[family-name:var(--font-display)] text-lg text-zinc-900 dark:text-white">
          Summary
        </h2>
        <div>
          <Label>Headline</Label>
          <Input {...register("headline")} />
        </div>
        <div>
          <Label>Summary</Label>
          <Textarea rows={5} {...register("summary")} />
        </div>
        <div>
          <Label>Top skills (comma separated)</Label>
          <Input {...register("topSkills")} />
        </div>
      </section>

      <section className={SECTION_CLASS}>
        <div className="flex justify-between items-center">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-zinc-900 dark:text-white">
            Experience
          </h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-zinc-900/20 dark:border-white/20 text-zinc-900 dark:text-white hover:border-purple-600 hover:text-purple-600 dark:hover:border-purple-400 dark:hover:text-purple-400"
            onClick={() =>
              exp.append({ company: "", role: "", period: "", bullets: [] })
            }
          >
            + Add
          </Button>
        </div>
        {exp.fields.map((f, i) => (
          <div
            key={f.id}
            className="grid grid-cols-2 gap-2 border-t border-dashed border-zinc-900/20 dark:border-white/20 pt-3"
          >
            <Input
              {...register(`experience.${i}.company`)}
              placeholder="Company"
            />
            <Input {...register(`experience.${i}.role`)} placeholder="Role" />
            <Input
              className="col-span-2"
              {...register(`experience.${i}.period`)}
              placeholder="Period (e.g. 2022 - 2024)"
            />
            <Textarea
              className="col-span-2"
              rows={3}
              defaultValue={f.bullets?.join("\n")}
              onBlur={(e) =>
                exp.update(i, {
                  ...f,
                  bullets: e.target.value.split("\n").filter(Boolean),
                })
              }
              placeholder="One bullet per line"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="col-span-2 justify-self-start text-zinc-900/70 dark:text-white/70 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => exp.remove(i)}
            >
              Remove
            </Button>
          </div>
        ))}
      </section>

      <section className={SECTION_CLASS}>
        <div className="flex justify-between items-center">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-zinc-900 dark:text-white">
            Education
          </h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-zinc-900/20 dark:border-white/20 text-zinc-900 dark:text-white hover:border-purple-600 hover:text-purple-600 dark:hover:border-purple-400 dark:hover:text-purple-400"
            onClick={() =>
              edu.append({
                institution: "",
                qualification: "",
                period: "",
                description: "",
              })
            }
          >
            + Add
          </Button>
        </div>
        {edu.fields.map((f, i) => (
          <div
            key={f.id}
            className="grid grid-cols-2 gap-2 border-t border-dashed border-zinc-900/20 dark:border-white/20 pt-3"
          >
            <Input
              {...register(`education.${i}.institution`)}
              placeholder="Institution"
            />
            <Input
              {...register(`education.${i}.qualification`)}
              placeholder="Qualification"
            />
            <Input
              className="col-span-2"
              {...register(`education.${i}.period`)}
              placeholder="Period (e.g. 2018 - 2021)"
            />
            <Textarea
              className="col-span-2"
              {...register(`education.${i}.description`)}
              placeholder="Notes (optional)"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="col-span-2 justify-self-start text-zinc-900/70 dark:text-white/70 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => edu.remove(i)}
            >
              Remove
            </Button>
          </div>
        ))}
      </section>

      <section className={SECTION_CLASS}>
        <div className="flex justify-between items-center">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-zinc-900 dark:text-white">
            Testimonials
          </h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-zinc-900/20 dark:border-white/20 text-zinc-900 dark:text-white hover:border-purple-600 hover:text-purple-600 dark:hover:border-purple-400 dark:hover:text-purple-400"
            onClick={() => tst.append({ author: "", authorRole: "", text: "" })}
          >
            + Add
          </Button>
        </div>
        {tst.fields.map((f, i) => (
          <div
            key={f.id}
            className="grid grid-cols-2 gap-2 border-t border-dashed border-zinc-900/20 dark:border-white/20 pt-3"
          >
            <Input
              {...register(`testimonials.${i}.author`)}
              placeholder="Author name"
            />
            <Input
              {...register(`testimonials.${i}.authorRole`)}
              placeholder="Their role"
            />
            <Textarea
              className="col-span-2"
              {...register(`testimonials.${i}.text`)}
              placeholder="Quote"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="col-span-2 justify-self-start text-zinc-900/70 dark:text-white/70 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => tst.remove(i)}
            >
              Remove
            </Button>
          </div>
        ))}
      </section>

      <section className={SECTION_CLASS}>
        <div className="flex justify-between items-center">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-zinc-900 dark:text-white">
            References
          </h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-zinc-900/20 dark:border-white/20 text-zinc-900 dark:text-white hover:border-purple-600 hover:text-purple-600 dark:hover:border-purple-400 dark:hover:text-purple-400"
            onClick={() =>
              ref.append({ name: "", relationship: "", contact: "" })
            }
          >
            + Add
          </Button>
        </div>
        {ref.fields.map((f, i) => (
          <div
            key={f.id}
            className="grid grid-cols-3 gap-2 border-t border-dashed border-zinc-900/20 dark:border-white/20 pt-3"
          >
            <Input {...register(`references.${i}.name`)} placeholder="Name" />
            <Input
              {...register(`references.${i}.relationship`)}
              placeholder="Relationship"
            />
            <Input
              {...register(`references.${i}.contact`)}
              placeholder="Contact"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="col-span-3 justify-self-start text-zinc-900/70 dark:text-white/70 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => ref.remove(i)}
            >
              Remove
            </Button>
          </div>
        ))}
      </section>

      <section className={SECTION_CLASS}>
        <div className="flex justify-between items-center">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-zinc-900 dark:text-white">
            Links
          </h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-zinc-900/20 dark:border-white/20 text-zinc-900 dark:text-white hover:border-purple-600 hover:text-purple-600 dark:hover:border-purple-400 dark:hover:text-purple-400"
            onClick={() => lnk.append({ label: "", url: "", description: "" })}
          >
            + Add
          </Button>
        </div>
        {lnk.fields.map((f, i) => (
          <div
            key={f.id}
            className="grid grid-cols-2 gap-2 border-t border-dashed border-zinc-900/20 dark:border-white/20 pt-3"
          >
            <Input
              {...register(`links.${i}.label`)}
              placeholder="Label (e.g. Portfolio, GitHub, LinkedIn)"
            />
            <Input
              {...register(`links.${i}.url`)}
              placeholder="https://..."
              type="url"
            />
            <Textarea
              className="col-span-2"
              {...register(`links.${i}.description`)}
              placeholder="What's here (optional)"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="col-span-2 justify-self-start text-zinc-900/70 dark:text-white/70 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => lnk.remove(i)}
            >
              Remove
            </Button>
          </div>
        ))}
      </section>

      <section className={SECTION_CLASS}>
        <div className="flex justify-between items-center">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-zinc-900 dark:text-white">
            Achievements
          </h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-zinc-900/20 dark:border-white/20 text-zinc-900 dark:text-white hover:border-purple-600 hover:text-purple-600 dark:hover:border-purple-400 dark:hover:text-purple-400"
            onClick={() => ach.append({ title: "", description: "", date: "" })}
          >
            + Add
          </Button>
        </div>
        {ach.fields.map((f, i) => (
          <div
            key={f.id}
            className="grid grid-cols-2 gap-2 border-t border-dashed border-zinc-900/20 dark:border-white/20 pt-3"
          >
            <Input
              {...register(`achievements.${i}.title`)}
              placeholder="Achievement (e.g. Won Regional UX Hackathon)"
            />
            <Input
              {...register(`achievements.${i}.date`)}
              placeholder="Date (optional)"
            />
            <Textarea
              className="col-span-2"
              {...register(`achievements.${i}.description`)}
              placeholder="Details (optional)"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="col-span-2 justify-self-start text-zinc-900/70 dark:text-white/70 hover:text-purple-600 dark:hover:text-purple-400"
              onClick={() => ach.remove(i)}
            >
              Remove
            </Button>
          </div>
        ))}
      </section>

      <section className={SECTION_CLASS}>
        <h2 className="font-[family-name:var(--font-display)] text-lg text-zinc-900 dark:text-white">
          Closing note
        </h2>
        <Textarea rows={2} {...register("closingNote")} />
      </section>

      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={saving}
          className="flex-1 py-6 text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30"
        >
          {saving ? "Saving..." : "Save changes to this version"}
        </Button>
      </div>
    </form>
  );
}
