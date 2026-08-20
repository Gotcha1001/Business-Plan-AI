// // components/cv-layouts/graph-stats.tsx
// //
// // New CvLayoutId: "graph-stats" (register in lib/layouts.ts). Same
// // header/contact/experience/education pattern as the other layouts,
// // plus two animated shadcn charts built on the derived stats in
// // lib/skill-signal.ts, a Links/References section matching the other
// // templates, and the interlude audio track from the generating modal
// // continuing to play here (see hooks/use-interlude-audio.ts).
// //
// // Requires: npx shadcn add chart
// "use client";

// import { motion } from "framer-motion";
// import { Mail, Phone, MapPin, IdCard, TrendingUp, Layers } from "lucide-react";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   Radar,
// } from "recharts";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
//   type ChartConfig,
// } from "@/components/ui/chart"; // npx shadcn add chart
// import { prepareCvData, toWhatsAppNumber } from "@/lib/cv-data";
// import { getChartPalette } from "@/lib/chart-theme";
// import {
//   computeSkillSignals,
//   computeExperienceDepth,
// } from "@/lib/skill-signal";
// import type { CvLayoutProps } from "./types";
// import { Button } from "@/components/ui/button";

// // Note: the interlude audio track is NOT wired up here — it plays for
// // every layout via CvAnimatedView in components/cv-preview.tsx, not
// // per-template. See hooks/use-interlude-audio.ts.

// export function GraphStatsLayout({ cv, version, pdfUrl }: CvLayoutProps) {
//   const {
//     g,
//     theme,
//     testimonials,
//     hasSidebarContent,
//     fullName,
//     idNumber,
//     address,
//     email,
//     phone,
//     photoUrl,
//     videoUrl,
//   } = prepareCvData(cv, version);

//   const palette = getChartPalette(theme);
//   const skillSignals = computeSkillSignals(g);
//   const experienceDepth = computeExperienceDepth(g);

//   const chartConfig = {
//     score: { label: "Relevance signal", color: palette.primary },
//     bullets: { label: "Highlights", color: palette.secondary },
//   } satisfies ChartConfig;

//   const cardClass = `rounded-xl border p-6 ${theme.web.border}`;

//   return (
//     <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
//       {/* ---------- Header, same pattern as centered.tsx ---------- */}
//       <div className="max-w-2xl mx-auto text-center">
//         {videoUrl ? (
//           <motion.video
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.9 }}
//             src={videoUrl}
//             autoPlay
//             muted
//             loop
//             playsInline
//             className="w-full rounded-xl mb-6"
//           />
//         ) : photoUrl ? (
//           <motion.img
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             src={photoUrl}
//             className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
//           />
//         ) : null}
//         <motion.h1
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           className={`text-3xl font-semibold ${theme.web.heading}`}
//         >
//           {fullName}
//         </motion.h1>
//         <p className={theme.web.accentText}>{g?.headline}</p>
//         <p className="text-muted-foreground mt-2">{g?.summary}</p>
//         <div className="flex flex-wrap justify-center gap-2 mt-5">
//           {email && (
//             <a
//               href={`mailto:${email}`}
//               className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:opacity-80 ${theme.web.pill}`}
//             >
//               <Mail className="w-3.5 h-3.5" />
//               {email}
//             </a>
//           )}
//           {phone && (
//             <a
//               href={`https://wa.me/${toWhatsAppNumber(phone)}`}
//               target="_blank"
//               className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:opacity-80 ${theme.web.pill}`}
//             >
//               <Phone className="w-3.5 h-3.5" />
//               {phone}
//             </a>
//           )}
//           {address && (
//             <span
//               className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border ${theme.web.pill}`}
//             >
//               <MapPin className="w-3.5 h-3.5" />
//               {address}
//             </span>
//           )}
//           {idNumber && (
//             <span
//               className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border ${theme.web.pill}`}
//             >
//               <IdCard className="w-3.5 h-3.5" />
//               {idNumber}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="flex justify-center my-6">
//         <a href={pdfUrl}>
//           {/*      ^^^^^^ was: `/api/cv/${cv.shareId}/pdf` */}
//           <Button className={theme.web.button}>Download PDF</Button>
//         </a>
//       </div>

//       {/* ---------- Skill signal chart ---------- */}
//       {skillSignals.length > 0 && (
//         <motion.section
//           initial={{ opacity: 0, y: 16 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.3 }}
//           transition={{ duration: 0.6 }}
//           className={cardClass}
//         >
//           <h2
//             className={`text-lg font-semibold mb-1 flex items-center gap-2 ${theme.web.heading}`}
//           >
//             <TrendingUp className="w-4 h-4" /> Skill signal
//           </h2>
//           <p className="text-xs text-muted-foreground mb-4">
//             How strongly each top skill shows up across this CV&apos;s summary
//             and experience — not a self-rated proficiency score.
//           </p>
//           <ChartContainer config={chartConfig} className="h-64 w-full">
//             <BarChart
//               data={skillSignals}
//               layout="vertical"
//               margin={{ left: 8, right: 16 }}
//             >
//               <CartesianGrid horizontal={false} stroke={palette.grid} />
//               <XAxis type="number" dataKey="score" hide domain={[0, 100]} />
//               <YAxis
//                 type="category"
//                 dataKey="skill"
//                 width={120}
//                 tickLine={false}
//                 axisLine={false}
//                 tick={{ fontSize: 12, fill: palette.text }}
//               />
//               <ChartTooltip content={<ChartTooltipContent />} />
//               <Bar
//                 dataKey="score"
//                 fill="var(--color-score)"
//                 radius={[0, 6, 6, 0]}
//                 isAnimationActive
//                 animationDuration={1100}
//                 animationEasing="ease-out"
//               />
//             </BarChart>
//           </ChartContainer>
//         </motion.section>
//       )}

//       {/* ---------- Experience depth chart ---------- */}
//       {experienceDepth.length > 1 && (
//         <motion.section
//           initial={{ opacity: 0, y: 16 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.3 }}
//           transition={{ duration: 0.6, delay: 0.1 }}
//           className={cardClass}
//         >
//           <h2
//             className={`text-lg font-semibold mb-1 flex items-center gap-2 ${theme.web.heading}`}
//           >
//             <Layers className="w-4 h-4" /> Experience depth
//           </h2>
//           <p className="text-xs text-muted-foreground mb-4">
//             Number of tailored highlights the AI wrote for each role.
//           </p>
//           <ChartContainer config={chartConfig} className="h-72 w-full">
//             <RadarChart data={experienceDepth}>
//               <PolarGrid stroke={palette.grid} />
//               <PolarAngleAxis
//                 dataKey="label"
//                 tick={{ fontSize: 11, fill: palette.text }}
//               />
//               <ChartTooltip content={<ChartTooltipContent />} />
//               <Radar
//                 dataKey="bullets"
//                 stroke={palette.primary}
//                 fill={palette.primary}
//                 fillOpacity={0.35}
//                 isAnimationActive
//                 animationDuration={1200}
//                 animationEasing="ease-out"
//               />
//             </RadarChart>
//           </ChartContainer>
//         </motion.section>
//       )}

//       {/* ---------- Experience list ---------- */}
//       {g && g.experience.length > 0 && (
//         <section
//           className={hasSidebarContent ? "grid md:grid-cols-3 gap-8" : ""}
//         >
//           <div
//             className={
//               hasSidebarContent ? "md:col-span-2 space-y-6" : "space-y-6"
//             }
//           >
//             <h2 className={`text-lg font-semibold ${theme.web.heading}`}>
//               Experience
//             </h2>
//             {g.experience.map((entry, i) => (
//               <motion.div
//                 key={`${entry.company}-${i}`}
//                 initial={{ opacity: 0, x: -10 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true, amount: 0.3 }}
//                 transition={{ duration: 0.5, delay: i * 0.05 }}
//                 className={`border-l-2 pl-4 ${theme.web.border}`}
//               >
//                 <div className="flex items-baseline justify-between gap-4 flex-wrap">
//                   <p className="font-medium">
//                     {entry.role} · {entry.company}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     {entry.period}
//                   </p>
//                 </div>
//                 <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-0.5">
//                   {entry.bullets.map((b, bi) => (
//                     <li key={bi}>{b}</li>
//                   ))}
//                 </ul>
//               </motion.div>
//             ))}
//           </div>

//           {hasSidebarContent && (
//             <div className="space-y-6">
//               {g.education.length > 0 && (
//                 <div>
//                   <h2
//                     className={`text-lg font-semibold mb-2 ${theme.web.heading}`}
//                   >
//                     Education
//                   </h2>
//                   <div className="space-y-3">
//                     {g.education.map((ed, i) => (
//                       <div
//                         key={i}
//                         className={`border-l-2 pl-4 ${theme.web.borderSoft}`}
//                       >
//                         <p className="font-medium text-sm">
//                           {ed.qualification}
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           {ed.institution} · {ed.period}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               {testimonials.length > 0 && (
//                 <div>
//                   <h2
//                     className={`text-lg font-semibold mb-2 ${theme.web.heading}`}
//                   >
//                     Testimonials
//                   </h2>
//                   <div className="space-y-3">
//                     {testimonials.map((t, i) => (
//                       <blockquote
//                         key={i}
//                         className="text-sm text-muted-foreground italic"
//                       >
//                         &ldquo;{t.text}&rdquo; —{" "}
//                         <span className="not-italic font-medium">
//                           {t.author}
//                         </span>
//                       </blockquote>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </section>
//       )}

//       {/* ---------- Links & References ---------- */}
//       {(cv.links.length > 0 || cv.references.length > 0) && (
//         <section className="grid sm:grid-cols-2 gap-6">
//           {cv.links.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5 }}
//               className={cardClass}
//             >
//               <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
//                 Links
//               </h2>
//               <div className="flex flex-col gap-2">
//                 {cv.links.map((l, i) => (
//                   <a
//                     key={i}
//                     href={l.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className={`text-sm break-words ${theme.web.link}`}
//                   >
//                     {l.label}
//                     {l.description && (
//                       <span className="text-muted-foreground">
//                         {" "}
//                         — {l.description}
//                       </span>
//                     )}
//                   </a>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//           {cv.references.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.06 }}
//               className={cardClass}
//             >
//               <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
//                 References
//               </h2>
//               <div className="space-y-2">
//                 {cv.references.map((r, i) => (
//                   <p
//                     key={i}
//                     className="text-sm text-muted-foreground break-words"
//                   >
//                     {r.name}
//                     {r.relationship ? ` (${r.relationship})` : ""} — {r.contact}
//                   </p>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </section>
//       )}

//       {g?.closingNote && (
//         <p className={`text-center text-sm ${theme.web.accentText}`}>
//           {g.closingNote}
//         </p>
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, IdCard, TrendingUp, Layers } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { prepareCvData, toWhatsAppNumber } from "@/lib/cv-data";
import { getChartPalette } from "@/lib/chart-theme";
import {
  computeSkillSignals,
  computeExperienceDepth,
  type SkillSignal,
} from "@/lib/skill-signal";
import type { CvLayoutProps } from "./types";
import { Button } from "@/components/ui/button";

// Note: the interlude audio track is NOT wired up here — it plays for
// every layout via CvAnimatedView in components/cv-preview.tsx, not
// per-template. See hooks/use-interlude-audio.ts.

/* ---------------------------------------------------------------------- */
/* Small shared helpers                                                   */
/* ---------------------------------------------------------------------- */

// Turns a 0-100 score into a short, human label so the tooltip/legend
// reads as an assessment rather than a bare number.
function signalLabel(score: number) {
  if (score >= 80) return "Very strong signal";
  if (score >= 60) return "Strong signal";
  if (score >= 40) return "Moderate signal";
  if (score >= 20) return "Light signal";
  return "Minimal signal";
}

// IMPORTANT: this must be a top-level component, not something declared
// inside GraphStatsLayout's render body. Declaring a component during
// render gives React a new component *type* on every render, which forces
// a full remount (and resets any local state) — that's what was throwing
// "Cannot create components during render".
function GlowBlobs({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string;
}) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl opacity-[0.12]"
        style={{ background: primary }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full blur-3xl opacity-[0.08]"
        style={{ background: secondary }}
      />
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Skill dial — a glowing radial gauge that fills up on first view and    */
/* replays the fill animation every time it's hovered. Now with a         */
/* tooltip on hover showing the exact score and a plain-language label.   */
/* ---------------------------------------------------------------------- */

function SkillDial({
  signal,
  index,
  primary,
  secondary,
}: {
  signal: SkillSignal;
  index: number;
  primary: string;
  secondary: string;
}) {
  // Bumping this key remounts the animated circle, which replays its
  // initial -> animate transition — i.e. the "fill up again on hover"
  // behaviour, without fighting framer-motion's animation controls.
  const [replayKey, setReplayKey] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const size = 112;
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (signal.score / 100) * circumference;

  const gradientId = `dial-gradient-${index}`;
  const glowId = `dial-glow-${index}`;

  return (
    <motion.div
      className="relative flex flex-col items-center gap-3 group"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onHoverStart={() => {
        setReplayKey((n) => n + 1);
        setShowTooltip(true);
      }}
      onHoverEnd={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-10 w-max max-w-[180px] rounded-lg border bg-popover px-3 py-2 text-center shadow-lg"
          >
            <p className="text-xs font-semibold text-popover-foreground">
              {signal.skill}
            </p>
            <p className="text-[11px] font-medium" style={{ color: primary }}>
              {signal.score}/100 · {signalLabel(signal.score)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="relative transition-transform duration-300 group-hover:scale-[1.04]"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primary} />
              <stop offset="100%" stopColor={secondary} />
            </linearGradient>
            {/* Soft glow: blur the stroke and merge it under the crisp original.
                Kept subtle so the dial reads as clean UI rather than neon. */}
            <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            fill="none"
            className="stroke-muted-foreground/15"
          />

          {/* Animated fill */}
          <motion.circle
            key={replayKey}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.3, ease: "easeOut" }}
            filter={`url(#${glowId})`}
          />
        </svg>

        {/* Score readout, centered over the dial (not rotated) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={`val-${replayKey}`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-xl font-semibold tabular-nums"
            style={{
              backgroundImage: `linear-gradient(90deg, ${primary}, ${secondary})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {signal.score}
          </motion.span>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            signal
          </span>
        </div>
      </div>

      <p className="text-xs font-medium text-center max-w-[104px] truncate">
        {signal.skill}
      </p>
    </motion.div>
  );
}

/* ---------------------------------------------------------------------- */
/* Radar chart tooltip — plain-language readout instead of a raw number.  */
/* ---------------------------------------------------------------------- */

function RadarTooltip({
  active,
  payload,
  primary,
}: {
  active?: boolean;
  payload?: Array<{ payload: { label: string; bullets: number } }>;
  primary: string;
}) {
  if (!active || !payload?.length) return null;
  const { label, bullets } = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-popover-foreground">{label}</p>
      <p className="text-[11px] font-medium" style={{ color: primary }}>
        {bullets} tailored highlight{bullets === 1 ? "" : "s"}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Main layout                                                            */
/* ---------------------------------------------------------------------- */

export function GraphStatsLayout({ cv, version, pdfUrl }: CvLayoutProps) {
  const {
    g,
    theme,
    testimonials,
    hasSidebarContent,
    fullName,
    idNumber,
    address,
    email,
    phone,
    photoUrl,
    videoUrl,
  } = prepareCvData(cv, version);

  const palette = getChartPalette(theme);
  const skillSignals = computeSkillSignals(g);
  const experienceDepth = computeExperienceDepth(g);

  // Bumping this replays the radar chart's built-in fill animation on hover,
  // the same trick used for the dials above.
  const [radarReplay, setRadarReplay] = useState(0);

  // Clean glass-panel card: soft gradient wash + faint glow blobs in the
  // theme's own colors, so every color scheme gets its own "console" look
  // for free, without leaning as hard into neon/sci-fi as before.
  const cardClass = `relative overflow-hidden rounded-2xl border p-6 md:p-8 ${theme.web.border} bg-gradient-to-b from-muted/30 to-transparent`;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
      {/* ---------- Header, same pattern as centered.tsx ---------- */}
      <div className="max-w-2xl mx-auto text-center">
        {videoUrl ? (
          <motion.video
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full rounded-xl mb-6"
          />
        ) : photoUrl ? (
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            src={photoUrl}
            className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
          />
        ) : null}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={`text-3xl font-semibold ${theme.web.heading}`}
        >
          {fullName}
        </motion.h1>
        <p className={theme.web.accentText}>{g?.headline}</p>
        <p className="text-muted-foreground mt-2">{g?.summary}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {email && (
            <a
              href={`mailto:${email}`}
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:opacity-80 ${theme.web.pill}`}
            >
              <Mail className="w-3.5 h-3.5" />
              {email}
            </a>
          )}
          {phone && (
            <a
              href={`https://wa.me/${toWhatsAppNumber(phone)}`}
              target="_blank"
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:opacity-80 ${theme.web.pill}`}
            >
              <Phone className="w-3.5 h-3.5" />
              {phone}
            </a>
          )}
          {address && (
            <span
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border ${theme.web.pill}`}
            >
              <MapPin className="w-3.5 h-3.5" />
              {address}
            </span>
          )}
          {idNumber && (
            <span
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border ${theme.web.pill}`}
            >
              <IdCard className="w-3.5 h-3.5" />
              {idNumber}
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-center my-6">
        <a href={pdfUrl}>
          {/*      ^^^^^^ was: `/api/cv/${cv.shareId}/pdf` */}
          <Button className={theme.web.button}>Download PDF</Button>
        </a>
      </div>

      {/* ---------- Skill signal — glowing dial grid ---------- */}
      {skillSignals.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className={cardClass}
        >
          <GlowBlobs primary={palette.primary} secondary={palette.secondary} />
          <h2
            className="relative text-lg font-semibold mb-1 flex items-center gap-2"
            style={{
              backgroundImage: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            <TrendingUp
              className="w-4 h-4"
              style={{ color: palette.primary }}
            />
            Skill signal
          </h2>
          <p className="relative text-xs text-muted-foreground mb-6">
            How strongly each top skill shows up across this CV&apos;s summary
            and experience — not a self-rated proficiency score. Hover a dial
            for details.
          </p>
          <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-8 justify-items-center">
            {skillSignals.map((s, i) => (
              <SkillDial
                key={s.skill}
                signal={s}
                index={i}
                primary={palette.primary}
                secondary={palette.secondary}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* ---------- Experience depth — gradient-glow radar ---------- */}
      {experienceDepth.length > 1 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cardClass}
          onMouseEnter={() => setRadarReplay((n) => n + 1)}
        >
          <GlowBlobs primary={palette.primary} secondary={palette.secondary} />
          <h2
            className="relative text-lg font-semibold mb-1 flex items-center gap-2"
            style={{
              backgroundImage: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            <Layers className="w-4 h-4" style={{ color: palette.primary }} />
            Experience depth
          </h2>
          <p className="relative text-xs text-muted-foreground mb-4">
            Number of tailored highlights the AI wrote for each role. Hover a
            point, or the panel, for details.
          </p>
          <div className="relative h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                key={radarReplay}
                data={experienceDepth}
                margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
              >
                <defs>
                  <linearGradient
                    id="radar-fill"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={palette.primary}
                      stopOpacity={0.45}
                    />
                    <stop
                      offset="100%"
                      stopColor={palette.secondary}
                      stopOpacity={0.12}
                    />
                  </linearGradient>
                  <filter
                    id="radar-glow"
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="160%"
                  >
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <PolarGrid stroke={palette.grid} strokeOpacity={0.5} />
                <PolarAngleAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: palette.text }}
                />
                {/* Hidden numeric axis: keeps the radar proportioned to the
                    real data range instead of an implicit 0-100 scale, while
                    staying out of the way visually. */}
                <PolarRadiusAxis tick={false} axisLine={false} tickCount={4} />
                <Tooltip
                  content={<RadarTooltip primary={palette.primary} />}
                  cursor={{ stroke: palette.primary, strokeOpacity: 0.3 }}
                />
                <Radar
                  dataKey="bullets"
                  stroke={palette.primary}
                  strokeWidth={2}
                  fill="url(#radar-fill)"
                  filter="url(#radar-glow)"
                  isAnimationActive
                  animationDuration={1300}
                  animationEasing="ease-out"
                  dot={{ r: 3, fill: palette.primary, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: palette.primary, strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      )}

      {/* ---------- Experience list ---------- */}
      {g && g.experience.length > 0 && (
        <section
          className={hasSidebarContent ? "grid md:grid-cols-3 gap-8" : ""}
        >
          <div
            className={
              hasSidebarContent ? "md:col-span-2 space-y-6" : "space-y-6"
            }
          >
            <h2 className={`text-lg font-semibold ${theme.web.heading}`}>
              Experience
            </h2>
            {g.experience.map((entry, i) => (
              <motion.div
                key={`${entry.company}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`border-l-2 pl-4 ${theme.web.border}`}
              >
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <p className="font-medium">
                    {entry.role} · {entry.company}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.period}
                  </p>
                </div>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-0.5">
                  {entry.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {hasSidebarContent && (
            <div className="space-y-6">
              {g.education.length > 0 && (
                <div>
                  <h2
                    className={`text-lg font-semibold mb-2 ${theme.web.heading}`}
                  >
                    Education
                  </h2>
                  <div className="space-y-3">
                    {g.education.map((ed, i) => (
                      <div
                        key={i}
                        className={`border-l-2 pl-4 ${theme.web.borderSoft}`}
                      >
                        <p className="font-medium text-sm">
                          {ed.qualification}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ed.institution} · {ed.period}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {testimonials.length > 0 && (
                <div>
                  <h2
                    className={`text-lg font-semibold mb-2 ${theme.web.heading}`}
                  >
                    Testimonials
                  </h2>
                  <div className="space-y-3">
                    {testimonials.map((t, i) => (
                      <blockquote
                        key={i}
                        className="text-sm text-muted-foreground italic"
                      >
                        &ldquo;{t.text}&rdquo; —{" "}
                        <span className="not-italic font-medium">
                          {t.author}
                        </span>
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ---------- Links & References ---------- */}
      {(cv.links.length > 0 || cv.references.length > 0) && (
        <section className="grid sm:grid-cols-2 gap-6">
          {cv.links.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={cardClass}
            >
              <h2 className="relative font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
                Links
              </h2>
              <div className="relative flex flex-col gap-2">
                {cv.links.map((l, i) => (
                  <a
                    key={i}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm break-words ${theme.web.link}`}
                  >
                    {l.label}
                    {l.description && (
                      <span className="text-muted-foreground">
                        {" "}
                        — {l.description}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
          {cv.references.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className={cardClass}
            >
              <h2 className="relative font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
                References
              </h2>
              <div className="relative space-y-2">
                {cv.references.map((r, i) => (
                  <p
                    key={i}
                    className="text-sm text-muted-foreground break-words"
                  >
                    {r.name}
                    {r.relationship ? ` (${r.relationship})` : ""} — {r.contact}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </section>
      )}

      {g?.closingNote && (
        <p className={`text-center text-sm ${theme.web.accentText}`}>
          {g.closingNote}
        </p>
      )}
    </div>
  );
}
