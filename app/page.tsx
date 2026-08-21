// "use client";

// import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { SignInButton, useUser } from "@clerk/nextjs";
// import { useState } from "react";
// import Image from "next/image";

// const ROLES = [
//   "Web Designer",
//   "Data Analyst",
//   "Nurse",
//   "Sales Manager",
// ] as const;

// // The same three source bullets, reordered and re-weighted per role — this
// // is the whole pitch of the product, so the landing page enacts it instead
// // of describing it.
// const BULLET_LIBRARY: Record<(typeof ROLES)[number], string[]> = {
//   "Web Designer": [
//     "Redesigned checkout flow, lifting conversion 18%",
//     "Led design system adopted across 6 product teams",
//     "Mentored 3 junior designers over two years",
//   ],
//   "Data Analyst": [
//     "Built the dashboard finance now checks every morning",
//     "Cut reporting time from 3 days to 40 minutes",
//     "Modelled churn drivers behind an 18% conversion lift",
//   ],
//   Nurse: [
//     "Coordinated care for a 30-bed ward across three shifts",
//     "Trained 3 incoming staff on ward procedure",
//     "Managed patient records during a system migration",
//   ],
//   "Sales Manager": [
//     "Closed the year 18% above quota, team-wide",
//     "Rebuilt onboarding, ramping new reps two weeks faster",
//     "Mentored 3 reps into senior roles",
//   ],
// };

// const FEATURES = [
//   {
//     title: "One profile, any role",
//     description:
//       "Enter your history once — education, experience, testimonials, references. Point it at a job title and the AI rebuilds the emphasis around that role.",
//     icon: "🎯",
//   },
//   {
//     title: "A link, not a file",
//     description:
//       "Every CV gets its own page at cvmake.ai/cv/your-slug. Send the link — the employer never sees your dashboard, just the CV.",
//     icon: "🔗",
//   },
//   {
//     title: "PDF or animated",
//     description:
//       "Download a clean PDF for applicant tracking systems, or share the animated version with your photo or intro video live at the top.",
//     icon: "🎬",
//   },
// ];

// export default function LandingPage() {
//   const { isSignedIn } = useUser();
//   const [activeRole, setActiveRole] =
//     useState<(typeof ROLES)[number]>("Web Designer");

//   return (
//     <div className="relative min-h-screen overflow-hidden ">
//       {/* Full-bleed background photo, faded so text stays readable */}
//       <Image
//         src="/cvcolleague.jpg"
//         alt=""
//         fill
//         priority
//         className="object-cover opacity-15 dark:opacity-10 -z-10 pointer-events-none select-none"
//       />
//       {/* Soft purple/indigo wash over the photo for depth in both themes.
//     Light mode gets its own darker wash (rather than falling through
//     to `transparent`) — a low-opacity photo on white reads as washed
//     out, so the wash carries most of the depth and the image opacity
//     above is raised too so it doesn't disappear entirely. */}
//       <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-950/30 via-slate-900/20 to-purple-950/35 dark:from-indigo-950/40 dark:via-black/60 dark:to-purple-950/30 pointer-events-none" />

//       <main className="relative z-10 px-6">
//         {/* Hero */}
//         <section className="max-w-5xl mx-auto pt-20 pb-16 text-center">
//           <motion.p
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-sm font-medium tracking-wide uppercase text-purple-600 dark:text-purple-400"
//           >
//             One CV, tailored on demand
//           </motion.p>
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1, duration: 0.6 }}
//             className="mt-4 font-[family-name:var(--font-display)] text-5xl md:text-7xl font-medium tracking-tight text-zinc-900 dark:text-white"
//           >
//             Same you.{" "}
//             <span className="italic bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
//               Different job.
//             </span>
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2, duration: 0.6 }}
//             className="mt-5 text-lg max-w-xl mx-auto text-zinc-900/70 dark:text-white/70"
//           >
//             Tell CV Make AI where you&apos;re applying, and it reweighs your
//             real experience around that role — no rewriting, no template
//             roulette.
//           </motion.p>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3, duration: 0.6 }}
//             className="mt-8 flex flex-wrap gap-4 justify-center"
//           >
//             {isSignedIn ? (
//               <Link href="/dashboard">
//                 <Button
//                   size="lg"
//                   className="text-base px-8 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30"
//                 >
//                   Go to your dashboard →
//                 </Button>
//               </Link>
//             ) : (
//               <>
//                 <SignInButton mode="modal" forceRedirectUrl="/dashboard">
//                   <Button
//                     size="lg"
//                     className="text-base px-8 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30"
//                   >
//                     Build your first CV
//                   </Button>
//                 </SignInButton>
//                 <Link href="/sign-up">
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="text-base px-8 py-6 border-zinc-900/20 dark:border-white/20 text-zinc-900 dark:text-white hover:border-purple-600 hover:text-purple-600 dark:hover:border-purple-400 dark:hover:text-purple-400"
//                   >
//                     Create account
//                   </Button>
//                 </Link>
//               </>
//             )}
//           </motion.div>
//         </section>

//         {/* Signature interactive demo: click a role, watch the same bullets retailor */}
//         <section className="max-w-3xl mx-auto pb-24">
//           <div className="flex flex-wrap gap-2 justify-center mb-6">
//             {ROLES.map((role) => (
//               <button
//                 key={role}
//                 onClick={() => setActiveRole(role)}
//                 className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
//                   activeRole === role
//                     ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-transparent text-white"
//                     : "border-zinc-900/20 dark:border-white/20 text-zinc-900 dark:text-white hover:border-purple-600 dark:hover:border-purple-400"
//                 }`}
//               >
//                 {role}
//               </button>
//             ))}
//           </div>

//           <div className="rounded-2xl border border-zinc-900/10 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-xl shadow-purple-900/5 p-8">
//             <div className="flex items-baseline justify-between border-b border-dashed border-zinc-900/20 dark:border-white/20 pb-4 mb-4">
//               <div>
//                 <p className="font-[family-name:var(--font-display)] text-2xl text-zinc-900 dark:text-white">
//                   Jordan Reyes
//                 </p>
//                 <p className="text-sm text-zinc-900/60 dark:text-white/60">
//                   Tailored for:{" "}
//                   <AnimatePresence mode="wait">
//                     <motion.span
//                       key={activeRole}
//                       initial={{ opacity: 0, y: -4 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 4 }}
//                       transition={{ duration: 0.2 }}
//                       className="inline-block font-medium text-purple-600 dark:text-purple-400"
//                     >
//                       {activeRole}
//                     </motion.span>
//                   </AnimatePresence>
//                 </p>
//               </div>
//               <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-900/40 dark:text-white/40">
//                 cvmake.ai/cv/jordan-reyes
//               </span>
//             </div>
//             <LayoutGroup>
//               <ul className="space-y-3">
//                 {BULLET_LIBRARY[activeRole].map((bullet) => (
//                   <motion.li
//                     layout
//                     key={bullet}
//                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                     className="flex gap-3 text-sm text-zinc-900/85 dark:text-white/85"
//                   >
//                     <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shrink-0" />
//                     {bullet}
//                   </motion.li>
//                 ))}
//               </ul>
//             </LayoutGroup>
//           </div>
//         </section>

//         {/* Features */}
//         <section className="max-w-5xl mx-auto pb-24">
//           <div className="grid md:grid-cols-3 gap-6">
//             {FEATURES.map((feature, index) => (
//               <motion.div
//                 key={feature.title}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 className="p-6 rounded-2xl border border-zinc-900/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-left hover:border-purple-600/40 dark:hover:border-purple-400/40 transition-colors"
//               >
//                 <div className="text-3xl mb-3">{feature.icon}</div>
//                 <h3 className="font-[family-name:var(--font-display)] text-lg mb-2 text-zinc-900 dark:text-white">
//                   {feature.title}
//                 </h3>
//                 <p className="text-sm text-zinc-900/70 dark:text-white/70">
//                   {feature.description}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </section>

//         {/* Closing CTA */}
//         <section className="max-w-3xl mx-auto text-center pb-24">
//           <h2 className="font-[family-name:var(--font-display)] text-3xl text-zinc-900 dark:text-white mb-4">
//             Stop keeping five versions of the same CV.
//           </h2>
//           <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
//             <Button
//               size="lg"
//               className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-10 py-6 text-base shadow-xl shadow-purple-900/30"
//             >
//               Start building →
//             </Button>
//           </Link>
//         </section>
//       </main>
//     </div>
//   );
// }
"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";

const STAGES = [
  "Idea stage",
  "Pre-revenue",
  "Seeking funding",
  "Growth",
] as const;

// Same interactive idea as the old role switcher — one business, different
// emphasis depending on what the plan is for.
const HIGHLIGHT_LIBRARY: Record<(typeof STAGES)[number], string[]> = {
  "Idea stage": [
    "Clear problem statement and unique value proposition",
    "Lean startup cost breakdown and funding gap",
    "First-year break-even and viability flags",
  ],
  "Pre-revenue": [
    "Market size (TAM / SAM / SOM) with realistic SOM",
    "Customer acquisition cost vs lifetime value",
    "12-month cash-flow projection from day one",
  ],
  "Seeking funding": [
    "Funding request, equity offered, and use of funds",
    "Investor-ready executive summary and traction KPIs",
    "ROI, payback period, and scenario comparison",
  ],
  Growth: [
    "Multi-location / multi-stream revenue model",
    "Hiring plan, ops capacity, and scalability notes",
    "Year-over-year margin and growth targets",
  ],
};

const FEATURES = [
  {
    title: "One set of inputs, full plan",
    description:
      "Enter identity, team, market, ops, and financials once. The AI writes every narrative section and uses deterministic math for the numbers — never invented figures.",
    icon: "📋",
  },
  {
    title: "A link, not a binder",
    description:
      "Every plan gets a share page at /plan/your-slug. Send the link to investors, lenders, or partners — they see the plan, not your dashboard.",
    icon: "🔗",
  },
  {
    title: "PDF or live preview",
    description:
      "Download a polished PDF (executive, investor-deck, charts, and more) or share the animated web version with viability score and financials up front.",
    icon: "📊",
  },
];

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const [activeStage, setActiveStage] =
    useState<(typeof STAGES)[number]>("Seeking funding");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Image
        src="/cvcolleague.jpg"
        alt=""
        fill
        priority
        className="object-cover opacity-15 dark:opacity-10 -z-10 pointer-events-none select-none"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-950/30 via-slate-900/20 to-purple-950/35 dark:from-indigo-950/40 dark:via-black/60 dark:to-purple-950/30 pointer-events-none" />

      <main className="relative z-10 px-6">
        {/* Hero */}
        <section className="max-w-5xl mx-auto pt-20 pb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium tracking-wide uppercase text-purple-600 dark:text-purple-400"
          >
            AI business plans with real numbers
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-4 font-[family-name:var(--font-display)] text-5xl md:text-7xl font-medium tracking-tight text-zinc-900 dark:text-white"
          >
            Your idea.{" "}
            <span className="italic bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              A plan that adds up.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-5 text-lg max-w-xl mx-auto text-zinc-900/70 dark:text-white/70"
          >
            Fill in the facts once. We calculate margins, break-even, cash flow,
            and ROI in code — then the AI writes a coherent plan around those
            numbers, not the other way around.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-4 justify-center"
          >
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30"
                >
                  Go to your dashboard →
                </Button>
              </Link>
            ) : (
              <>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button
                    size="lg"
                    className="text-base px-8 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30"
                  >
                    Build your first plan
                  </Button>
                </SignInButton>
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 py-6 border-zinc-900/20 dark:border-white/20 text-zinc-900 dark:text-white hover:border-purple-600 hover:text-purple-600 dark:hover:border-purple-400 dark:hover:text-purple-400"
                  >
                    Create account
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </section>

        {/* Interactive demo: stage switcher */}
        <section className="max-w-3xl mx-auto pb-24">
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {STAGES.map((stage) => (
              <button
                key={stage}
                onClick={() => setActiveStage(stage)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeStage === stage
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-transparent text-white"
                    : "border-zinc-900/20 dark:border-white/20 text-zinc-900 dark:text-white hover:border-purple-600 dark:hover:border-purple-400"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-zinc-900/10 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-xl shadow-purple-900/5 p-8">
            <div className="flex items-baseline justify-between border-b border-dashed border-zinc-900/20 dark:border-white/20 pb-4 mb-4">
              <div>
                <p className="font-[family-name:var(--font-display)] text-2xl text-zinc-900 dark:text-white">
                  Northline Coffee Co.
                </p>
                <p className="text-sm text-zinc-900/60 dark:text-white/60">
                  Plan emphasis:{" "}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeStage}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block font-medium text-purple-600 dark:text-purple-400"
                    >
                      {activeStage}
                    </motion.span>
                  </AnimatePresence>
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-900/40 dark:text-white/40">
                /plan/northline-coffee
              </span>
            </div>
            <LayoutGroup>
              <ul className="space-y-3">
                {HIGHLIGHT_LIBRARY[activeStage].map((line) => (
                  <motion.li
                    layout
                    key={line}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex gap-3 text-sm text-zinc-900/85 dark:text-white/85"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 shrink-0" />
                    {line}
                  </motion.li>
                ))}
              </ul>
            </LayoutGroup>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto pb-24">
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-zinc-900/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-left hover:border-purple-600/40 dark:hover:border-purple-400/40 transition-colors"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-[family-name:var(--font-display)] text-lg mb-2 text-zinc-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-900/70 dark:text-white/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="max-w-3xl mx-auto text-center pb-24">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-zinc-900 dark:text-white mb-4">
            Stop rewriting the same plan for every audience.
          </h2>
          <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-10 py-6 text-base shadow-xl shadow-purple-900/30"
            >
              Start building →
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
