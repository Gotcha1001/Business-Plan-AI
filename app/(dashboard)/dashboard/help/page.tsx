// // app/help/page.tsx
// //
// // NEW FILE. A standalone help page, not gated behind auth -- add
// // "/help(.*)" to the isPublicRoute matcher in proxy.ts so signed-out
// // visitors can read it too, and link to it from the sidebar
// // (components/Appsidebar.tsx) and from the create page's header.
// //
// // Static content on purpose: this is a "how do I fill this in" guide,
// // not a data-driven page, so it doesn't need Convex at all.

// "use client";

// import { motion } from "framer-motion";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import {
//   CheckCircle2,
//   Circle,
//   Sparkles,
//   Palette,
//   LayoutTemplate,
//   Coins,
//   ImageIcon,
// } from "lucide-react";

// const fadeUp = {
//   initial: { opacity: 0, y: 12 },
//   whileInView: { opacity: 1, y: 0 },
//   viewport: { once: true, margin: "-60px" },
//   transition: { duration: 0.5 },
// };

// const REQUIRED_FIELDS = [
//   {
//     label: "Business name",
//     note: "The only field the form actually requires. Everything else is optional.",
//   },
// ];

// const RECOMMENDED_MINIMUM = [
//   "Business name",
//   "Industry",
//   "One-line description or tagline (what you sell, to whom)",
//   "Stage (idea / pre-revenue / startup / growth / established)",
//   "A rough monthly revenue and cost assumption, if you have one",
// ];

// const SKIP_FOR_SIMPLE_PLAN = [
//   {
//     title: "Funding request & equity offered",
//     detail:
//       "Leave these blank if you're not raising money right now. The plan reads fine without a funding section.",
//   },
//   {
//     title: "Detailed financial assumptions",
//     detail:
//       "Unit economics, multi-scenario projections, and break-even inputs are for lenders/investors. A simple internal plan can skip straight past these.",
//   },
//   {
//     title: "Registration details",
//     detail:
//       "Registration number, registration date, legal structure -- fill these in later once the business is formally registered.",
//   },
//   {
//     title: "Market research specifics",
//     detail:
//       "Competitor tables and market-size figures help a formal plan but aren't needed for a one-page pitch.",
//   },
// ];

// const SECTIONS = [
//   {
//     name: "1. Identity",
//     what: "Business name, tagline, contact details, logo, and social links.",
//     tip: 'Business name is the only required field in the whole form. A short, plain-language tagline ("We deliver home-cooked meals to office workers in Durban") helps the AI more than a long mission statement.',
//   },
//   {
//     name: "2. Company overview & products/services",
//     what: "What you do, what you sell, and why it matters.",
//     tip: "Bullet points are fine here -- you don't need full paragraphs. The AI turns short notes into proper prose.",
//   },
//   {
//     name: "3. Market analysis",
//     what: "Who your customers are and who else serves them.",
//     tip: 'Even one sentence per field ("target customer", "main competitor") is enough for a simple plan.',
//   },
//   {
//     name: "4. Operations & management",
//     what: "How the business runs day to day and who runs it.",
//     tip: "Optional for an early-stage idea -- skip it if there's no team or process to describe yet.",
//   },
//   {
//     name: "5. Financials",
//     what: "Revenue, costs, and (if raising money) your funding ask.",
//     tip: "Enter whatever numbers you actually have. The app calculates margins, break-even, and ROI automatically -- you never need to compute those yourself.",
//   },
// ];

// export default function HelpPage() {
//   return (
//     <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
//       <motion.div {...fadeUp} className="text-center space-y-3">
//         <h1 className="text-3xl font-semibold">
//           How to fill in your business plan
//         </h1>
//         <p className="text-muted-foreground">
//           A quick guide to the form -- what&apos;s required, what you can skip,
//           and how to get a better plan out with less typing.
//         </p>
//       </motion.div>

//       {/* Required vs optional */}
//       <motion.section {...fadeUp} className="space-y-4">
//         <h2 className="text-xl font-medium flex items-center gap-2">
//           <CheckCircle2 className="h-5 w-5 text-emerald-500" />
//           what&apos;s actually required
//         </h2>
//         <div className="rounded-2xl border border-zinc-900/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5 space-y-2">
//           {REQUIRED_FIELDS.map((f) => (
//             <div key={f.label} className="flex items-start gap-2">
//               <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
//               <div>
//                 <p className="font-medium">{f.label}</p>
//                 <p className="text-sm text-muted-foreground">{f.note}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <p className="text-sm text-muted-foreground">
//           Everything else is optional. Leave a field blank and the AI either
//           omits that topic or writes around it sensibly -- it won&apos;t invent
//           fake numbers to fill a gap.
//         </p>
//       </motion.section>

//       {/* Recommended minimum */}
//       <motion.section {...fadeUp} className="space-y-4">
//         <h2 className="text-xl font-medium flex items-center gap-2">
//           <Sparkles className="h-5 w-5 text-violet-500" />A good
//           &apos;5-minute&apos; minimum
//         </h2>
//         <p className="text-sm text-muted-foreground">
//           If you just want a decent plan fast, these are the fields worth
//           filling in:
//         </p>
//         <ul className="space-y-2">
//           {RECOMMENDED_MINIMUM.map((item) => (
//             <li key={item} className="flex items-start gap-2 text-sm">
//               <Circle className="h-3 w-3 mt-1 fill-violet-400 text-violet-400 shrink-0" />
//               {item}
//             </li>
//           ))}
//         </ul>
//       </motion.section>

//       {/* What to skip for a simple plan */}
//       <motion.section {...fadeUp} className="space-y-4">
//         <h2 className="text-xl font-medium">
//           Making a simple plan? Skip these
//         </h2>
//         <div className="grid gap-3 sm:grid-cols-2">
//           {SKIP_FOR_SIMPLE_PLAN.map((s) => (
//             <div
//               key={s.title}
//               className="rounded-xl border border-zinc-900/10 dark:border-white/10 p-4 space-y-1"
//             >
//               <p className="font-medium text-sm">{s.title}</p>
//               <p className="text-sm text-muted-foreground">{s.detail}</p>
//             </div>
//           ))}
//         </div>
//       </motion.section>

//       {/* Section-by-section walkthrough */}
//       <motion.section {...fadeUp} className="space-y-4">
//         <h2 className="text-xl font-medium">Section-by-section</h2>
//         <div className="space-y-3">
//           {SECTIONS.map((s) => (
//             <div
//               key={s.name}
//               className="rounded-xl border border-zinc-900/10 dark:border-white/10 p-4"
//             >
//               <p className="font-medium">{s.name}</p>
//               <p className="text-sm text-muted-foreground mt-1">{s.what}</p>
//               <p className="text-sm mt-2">
//                 <span className="font-medium">Tip: </span>
//                 {s.tip}
//               </p>
//             </div>
//           ))}
//         </div>
//       </motion.section>

//       {/* Currency, layout, style, image */}
//       <motion.section {...fadeUp} className="space-y-4">
//         <h2 className="text-xl font-medium">
//           Currency, layout, style & your logo
//         </h2>
//         <div className="grid gap-3 sm:grid-cols-2">
//           <div className="rounded-xl border border-zinc-900/10 dark:border-white/10 p-4 flex gap-3">
//             <Coins className="h-5 w-5 text-amber-500 shrink-0" />
//             <div>
//               <p className="font-medium text-sm">Currency</p>
//               <p className="text-sm text-muted-foreground">
//                 Pick the currency your figures are in (Rand, Dollar, Euro, and
//                 more). Every number in the generated plan -- revenue, costs,
//                 break-even, funding ask -- is formatted in that currency.
//               </p>
//             </div>
//           </div>
//           <div className="rounded-xl border border-zinc-900/10 dark:border-white/10 p-4 flex gap-3">
//             <LayoutTemplate className="h-5 w-5 text-sky-500 shrink-0" />
//             <div>
//               <p className="font-medium text-sm">Layout</p>
//               <p className="text-sm text-muted-foreground">
//                 Choose how the plan is structured on the page -- executive
//                 summary first, investor-deck slides, a cover banner, a minimal
//                 clean page, or a financial-charts-forward layout. You can change
//                 this later without regenerating the content.
//               </p>
//             </div>
//           </div>
//           <div className="rounded-xl border border-zinc-900/10 dark:border-white/10 p-4 flex gap-3">
//             <Palette className="h-5 w-5 text-fuchsia-500 shrink-0" />
//             <div>
//               <p className="font-medium text-sm">Style</p>
//               <p className="text-sm text-muted-foreground">
//                 A color/theme choice for the same layout -- neutral, color, or
//                 gradient. Purely visual, no effect on the wording.
//               </p>
//             </div>
//           </div>
//           <div className="rounded-xl border border-zinc-900/10 dark:border-white/10 p-4 flex gap-3">
//             <ImageIcon className="h-5 w-5 text-rose-500 shrink-0" />
//             <div>
//               <p className="font-medium text-sm">Your logo</p>
//               <p className="text-sm text-muted-foreground">
//                 Upload it once in the Identity section and it appears across
//                 every layout -- cover page, header, or slide, depending on which
//                 layout you pick.
//               </p>
//             </div>
//           </div>
//         </div>
//       </motion.section>

//       <motion.div {...fadeUp} className="text-center pt-4">
//         <Button asChild size="lg">
//           <Link href="/dashboard/create">Start your business plan</Link>
//         </Button>
//       </motion.div>
//     </div>
//   );
// }

// app/(dashboard)/dashboard/help/page.tsx

"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Stamp,
  Coins,
  LayoutTemplate,
  Palette,
  ImageIcon,
  ArrowRight,
} from "lucide-react";

// -------- Motion --------
const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// -------- Tag system: every field gets exactly one --------
const LEVEL_META = {
  essential: {
    label: "Essential",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-l-emerald-500",
  },
  helpful: {
    label: "Helpful",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-l-amber-500",
  },
  skip: {
    label: "Skip it",
    dot: "bg-zinc-400",
    text: "text-zinc-500 dark:text-zinc-400",
    border: "border-l-zinc-300 dark:border-l-zinc-700",
  },
} as const;

type Level = keyof typeof LEVEL_META;

function LevelTag({ level }: { level: Level }) {
  const m = LEVEL_META[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${m.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

// -------- Content: one row per field, tagged --------
const SECTIONS: {
  name: string;
  blurb: string;
  fields: { label: string; level: Level; note: string }[];
}[] = [
  {
    name: "Identity",
    blurb: "Business name, tagline, contact details, logo, and social links.",
    fields: [
      {
        label: "Business name",
        level: "essential",
        note: "The only field the whole form actually requires.",
      },
      {
        label: "Tagline",
        level: "helpful",
        note: 'One plain sentence beats a mission statement — "We deliver home-cooked meals to office workers in Durban" gives the AI more to work with than a slogan.',
      },
      {
        label: "Logo",
        level: "helpful",
        note: "Upload it once here and it carries across every layout automatically.",
      },
      {
        label: "Social links",
        level: "skip",
        note: "Nice to have on the finished plan, irrelevant to how it reads.",
      },
    ],
  },
  {
    name: "Company overview & products/services",
    blurb: "What you do, what you sell, and why it matters.",
    fields: [
      {
        label: "What you sell",
        level: "essential",
        note: "Bullet points are fine — you don't need full paragraphs, the AI turns short notes into prose.",
      },
      {
        label: "Company history / founding story",
        level: "skip",
        note: "Only worth including if it actually explains why the business exists.",
      },
    ],
  },
  {
    name: "Market analysis",
    blurb: "Who your customers are, and who else serves them.",
    fields: [
      {
        label: "Target customer",
        level: "essential",
        note: "One sentence is enough for a simple plan.",
      },
      {
        label: "Main competitor(s)",
        level: "helpful",
        note: "A name or two, not a full competitive matrix.",
      },
      {
        label: "Market-size figures",
        level: "skip",
        note: "Useful for a formal investor plan, not needed for a one-pager.",
      },
    ],
  },
  {
    name: "Operations & management",
    blurb: "How the business runs day to day, and who runs it.",
    fields: [
      {
        label: "Team / owners",
        level: "helpful",
        note: "Include if there's a team to describe.",
      },
      {
        label: "Day-to-day process detail",
        level: "skip",
        note: "Skip entirely for an early-stage idea with no process yet.",
      },
    ],
  },
  {
    name: "Financials",
    blurb: "Revenue, costs, and — if you're raising money — your ask.",
    fields: [
      {
        label: "Rough revenue & cost numbers",
        level: "essential",
        note: "Whatever you actually have. Margins, break-even, and ROI are all calculated for you — never compute those yourself.",
      },
      {
        label: "Funding request & equity offered",
        level: "skip",
        note: "Leave blank if you're not raising money — the plan reads fine without a funding section.",
      },
      {
        label: "Multi-scenario projections",
        level: "skip",
        note: "For lenders and investors. An internal plan can skip straight past this.",
      },
      {
        label: "Registration number / legal structure",
        level: "skip",
        note: "Fill in later, once the business is formally registered.",
      },
    ],
  },
];

const SETTINGS = [
  {
    icon: Coins,
    color: "text-amber-500",
    title: "Currency",
    body: "Pick the currency your figures are in — Rand, Dollar, Euro, and more. Every number in the plan (revenue, costs, break-even, funding ask) is formatted in that currency.",
  },
  {
    icon: LayoutTemplate,
    color: "text-sky-500",
    title: "Layout",
    body: "How the plan is structured on the page — executive summary first, investor-deck slides, a cover banner, minimal clean, or financial-charts-forward. Switch it later without regenerating anything.",
  },
  {
    icon: Palette,
    color: "text-fuchsia-500",
    title: "Style",
    body: "A colour theme for the layout you picked — neutral, colour, or gradient. Purely visual, no effect on the wording.",
  },
  {
    icon: ImageIcon,
    color: "text-rose-500",
    title: "Your logo",
    body: "Upload it once in Identity and it appears across every layout — cover page, header, or slide, depending on which you choose.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      {/* -------- Hero: the stamp -------- */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="text-center mb-14"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-[#12213A]/15 dark:border-[#F6F1E7]/15 px-3.5 py-1.5 mb-5"
        >
          <Stamp className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-medium tracking-wide text-[#12213A] dark:text-[#F6F1E7]">
            Field-by-field guide
          </span>
        </motion.div>
        <motion.h1
          variants={fadeUp}
          className="text-3xl md:text-4xl font-semibold text-[#12213A] dark:text-[#F6F1E7]"
        >
          Fill in what matters. Skip what doesn&apos;t.
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-muted-foreground mt-3 max-w-xl mx-auto"
        >
          Every field below is tagged so you know at a glance what&apos;s worth
          your time — one field is required, the rest is your call.
        </motion.p>
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center gap-5 mt-6 text-xs"
        >
          {(Object.keys(LEVEL_META) as Level[]).map((l) => (
            <span key={l} className="inline-flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${LEVEL_META[l].dot}`}
              />
              <span className="text-muted-foreground">
                {LEVEL_META[l].label}
              </span>
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* -------- Sections, ledger-style -------- */}
      <div className="space-y-6">
        {SECTIONS.map((section, si) => (
          <motion.section
            key={section.name}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={container}
            className="rounded-2xl border border-[#12213A]/10 dark:border-[#F6F1E7]/10 bg-white/70 dark:bg-white/[0.03] overflow-hidden"
          >
            <motion.div
              variants={fadeUp}
              className="px-5 pt-5 pb-4 border-b border-[#12213A]/8 dark:border-[#F6F1E7]/8"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                  {String(si + 1).padStart(2, "0")}
                </span>
                <h2 className="font-medium text-[#12213A] dark:text-[#F6F1E7]">
                  {section.name}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {section.blurb}
              </p>
            </motion.div>

            <div>
              {section.fields.map((f) => (
                <motion.div
                  key={f.label}
                  variants={fadeUp}
                  whileHover={{ x: 2 }}
                  className={`flex items-start justify-between gap-4 px-5 py-3.5 border-l-2 ${LEVEL_META[f.level].border} border-b last:border-b-0 border-[#12213A]/6 dark:border-[#F6F1E7]/6`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#12213A] dark:text-[#F6F1E7]">
                      {f.label}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {f.note}
                    </p>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    <LevelTag level={f.level} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* -------- Currency / layout / style / logo -------- */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={container}
        className="mt-10"
      >
        <motion.h2
          variants={fadeUp}
          className="text-xl font-medium text-[#12213A] dark:text-[#F6F1E7] mb-4"
        >
          Currency, layout, style & your logo
        </motion.h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SETTINGS.map(({ icon: Icon, color, title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-[#12213A]/10 dark:border-[#F6F1E7]/10 bg-white/60 dark:bg-white/[0.03] p-4 flex gap-3"
            >
              <Icon className={`h-5 w-5 shrink-0 ${color}`} />
              <div>
                <p className="font-medium text-sm text-[#12213A] dark:text-[#F6F1E7]">
                  {title}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* -------- CTA -------- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center pt-14"
      >
        <Button asChild size="lg" className="group">
          <Link href="/dashboard/create" className="flex items-center gap-1.5">
            Start your business plan
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
