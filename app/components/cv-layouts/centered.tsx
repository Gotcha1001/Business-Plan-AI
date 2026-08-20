// // components/cv-layouts/centered.tsx
// "use client";

// import { motion } from "framer-motion";
// import { Mail, Phone, MapPin, IdCard } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { prepareCvData, toWhatsAppNumber } from "@/lib/cv-data";
// import type { CvLayoutProps } from "./types";

// /** Soft theme-coloured hover fill -- pure Tailwind, no extra files needed */
// const CARD_HOVER: Record<string, string> = {
//   neutral: "hover:bg-slate-500/10 dark:hover:bg-slate-400/15",
//   "amber-classic": "hover:bg-amber-500/10 dark:hover:bg-amber-500/15",
//   "ocean-blue": "hover:bg-blue-500/10 dark:hover:bg-blue-500/15",
//   "blue-gradient": "hover:bg-blue-500/10 dark:hover:bg-blue-500/15",
//   emerald: "hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15",
//   "royal-violet": "hover:bg-violet-500/10 dark:hover:bg-violet-500/15",
//   crimson: "hover:bg-rose-500/10 dark:hover:bg-rose-500/15",
//   lava: "hover:bg-orange-500/10 dark:hover:bg-orange-500/15",
//   "midnight-gradient": "hover:bg-indigo-500/10 dark:hover:bg-indigo-500/15",
//   "teal-breeze": "hover:bg-teal-500/10 dark:hover:bg-teal-500/15",
// };

// export function CenteredLayout({ cv }: CvLayoutProps) {
//   const {
//     g,
//     theme,
//     testimonials,
//     achievements,
//     hasSidebarContent,
//     fullName,
//     idNumber,
//     address,
//     email,
//     phone,
//     photoUrl,
//     videoUrl,
//   } = prepareCvData(cv);

//   const cardHover = CARD_HOVER[theme.id] ?? CARD_HOVER.neutral;
//   const cardClass = `rounded-xl border p-4 transition-colors duration-200 ${theme.web.border} ${cardHover}`;
//   const titleCardClass = `rounded-xl px-4 py-2.5 font-medium text-lg ${theme.web.button}`;

//   return (
//     <div className="max-w-5xl mx-auto py-10 px-4">
//       {/* ---------- Header band ---------- */}
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

//         <motion.div
//           initial={{ opacity: 0, y: 6 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.15 }}
//           className="flex flex-wrap justify-center gap-2 mt-5"
//         >
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
//               rel="noopener noreferrer"
//               className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:opacity-80 ${theme.web.pill}`}
//             >
//               <Phone className="w-3.5 h-3.5" />
//               {phone}
//             </a>
//           )}
//           {address && (
//             <span
//               className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${theme.web.pill}`}
//             >
//               <MapPin className="w-3.5 h-3.5" />
//               {address}
//             </span>
//           )}
//           {idNumber && (
//             <span
//               className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${theme.web.pill}`}
//             >
//               <IdCard className="w-3.5 h-3.5" />
//               ID: {idNumber}
//             </span>
//           )}
//         </motion.div>

//         <div className="flex justify-center my-6">
//           <a href={`/api/cv/${cv.shareId}/pdf`}>
//             <Button className={theme.web.button}>Download PDF</Button>
//           </a>
//         </div>
//       </div>

//       {/* ---------- Two-column body ---------- */}
//       <div
//         className={`mt-4 grid grid-cols-1 gap-8 ${
//           hasSidebarContent ? "md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" : ""
//         }`}
//       >
//         {hasSidebarContent && (
//           <div className="min-w-0 order-2 md:order-1 space-y-6">
//             {cv.interests.length > 0 && (
//               <section className={`min-w-0 overflow-hidden ${cardClass}`}>
//                 <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
//                   Interests
//                 </h2>
//                 <div className="flex flex-wrap gap-2 min-w-0">
//                   {cv.interests.map((interest, i) => {
//                     const isLong = interest.length > 40;
//                     return (
//                       <motion.span
//                         key={i}
//                         initial={{ opacity: 0, y: 6 }}
//                         whileInView={{ opacity: 1, y: 0 }}
//                         viewport={{ once: true }}
//                         transition={{ duration: 0.5, delay: i * 0.06 }}
//                         className={
//                           isLong
//                             ? `block w-full text-xs leading-relaxed px-3 py-2 rounded-lg break-words ${theme.web.pill}`
//                             : `inline-block max-w-full break-words text-xs px-3 py-1 rounded-full ${theme.web.pill}`
//                         }
//                       >
//                         {interest}
//                       </motion.span>
//                     );
//                   })}
//                 </div>
//               </section>
//             )}
//             {cv.links.length > 0 && (
//               <section className={`min-w-0 overflow-hidden ${cardClass}`}>
//                 <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
//                   Links
//                 </h2>
//                 <div className="flex flex-col gap-2 min-w-0">
//                   {cv.links.map((l, i) => (
//                     <motion.a
//                       key={i}
//                       href={l.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       initial={{ opacity: 0 }}
//                       whileInView={{ opacity: 1 }}
//                       viewport={{ once: true }}
//                       transition={{ duration: 0.5, delay: i * 0.06 }}
//                       className={`text-sm break-words ${theme.web.link}`}
//                     >
//                       {l.label}
//                       {l.description && (
//                         <span className="text-muted-foreground">
//                           {" "}
//                           — {l.description}
//                         </span>
//                       )}
//                     </motion.a>
//                   ))}
//                 </div>
//               </section>
//             )}
//             {cv.references.length > 0 && (
//               <section className={`min-w-0 overflow-hidden ${cardClass}`}>
//                 <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
//                   References
//                 </h2>
//                 <div className="space-y-2">
//                   {cv.references.map((r, i) => (
//                     <p
//                       key={i}
//                       className="text-sm text-muted-foreground break-words"
//                     >
//                       {r.name}
//                       {r.relationship ? ` (${r.relationship})` : ""} —{" "}
//                       {r.contact}
//                     </p>
//                   ))}
//                 </div>
//               </section>
//             )}
//           </div>
//         )}

//         <div className="min-w-0 order-1 md:order-2 space-y-6">
//           {g?.topSkills && g.topSkills.length > 0 && (
//             <section className={cardClass}>
//               <h2 className="font-medium text-lg mb-3">Top skills</h2>
//               <div className="flex flex-wrap gap-2">
//                 {g.topSkills.map((skill, i) => (
//                   <motion.span
//                     key={i}
//                     initial={{ opacity: 0, y: 4 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.4, delay: i * 0.05 }}
//                     className={`text-xs px-3 py-1 rounded-full ${theme.web.pill}`}
//                   >
//                     {skill}
//                   </motion.span>
//                 ))}
//               </div>
//             </section>
//           )}

//           <div className="space-y-3">
//             <div className={titleCardClass}>Experience</div>
//             {g?.experience?.map((e, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 8 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.5, delay: i * 0.06 }}
//                 className={cardClass}
//               >
//                 <p className="font-medium">
//                   {e.role} — {e.company}
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-0.5">
//                   {e.period}
//                 </p>
//                 {e.bullets && e.bullets.length > 0 && (
//                   <ul className="list-disc list-inside text-sm mt-2 space-y-0.5">
//                     {e.bullets.map((b, j) => (
//                       <li key={j}>{b}</li>
//                     ))}
//                   </ul>
//                 )}
//               </motion.div>
//             ))}
//           </div>

//           <div className="space-y-3">
//             <div className={titleCardClass}>Education</div>
//             {g?.education?.map((ed, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 8 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.5, delay: i * 0.06 }}
//                 className={cardClass}
//               >
//                 <p className="font-medium">
//                   {ed.qualification} — {ed.institution}
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-0.5">
//                   {ed.period}
//                 </p>
//               </motion.div>
//             ))}
//           </div>

//           {testimonials && testimonials.length > 0 && (
//             <div className="space-y-3">
//               <div className={titleCardClass}>Testimonials</div>
//               {testimonials.map((t, i) => (
//                 <motion.blockquote
//                   key={i}
//                   initial={{ opacity: 0, y: 8 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.5, delay: i * 0.06 }}
//                   className={`${cardClass} italic text-sm`}
//                 >
//                   &quot;{t.text}&quot;{" "}
//                   <span className="not-italic text-muted-foreground">
//                     — {t.author}
//                   </span>
//                 </motion.blockquote>
//               ))}
//             </div>
//           )}

//           {achievements && achievements.length > 0 && (
//             <div className="space-y-3">
//               <div className={titleCardClass}>Achievements</div>
//               {achievements.map((a, i) => (
//                 <motion.div
//                   key={i}
//                   initial={{ opacity: 0, y: 8 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.5, delay: i * 0.06 }}
//                   className={cardClass}
//                 >
//                   <p className="font-medium">{a.title}</p>
//                   {a.description && (
//                     <p className="text-sm text-muted-foreground mt-1">
//                       {a.description}
//                     </p>
//                   )}
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {g?.closingNote && (
//         <motion.p
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//           className={`mt-10 text-center text-sm italic ${theme.web.accentText}`}
//         >
//           &quot;{g.closingNote}&quot;
//         </motion.p>
//       )}
//     </div>
//   );
// }

// components/cv-layouts/centered.tsx
"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prepareCvData, toWhatsAppNumber } from "@/lib/cv-data";
import type { CvLayoutProps } from "./types";

/** Soft theme-coloured hover fill -- pure Tailwind, no extra files needed */
const CARD_HOVER: Record<string, string> = {
  neutral: "hover:bg-slate-500/10 dark:hover:bg-slate-400/15",
  "amber-classic": "hover:bg-amber-500/10 dark:hover:bg-amber-500/15",
  "ocean-blue": "hover:bg-blue-500/10 dark:hover:bg-blue-500/15",
  "blue-gradient": "hover:bg-blue-500/10 dark:hover:bg-blue-500/15",
  emerald: "hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15",
  "royal-violet": "hover:bg-violet-500/10 dark:hover:bg-violet-500/15",
  crimson: "hover:bg-rose-500/10 dark:hover:bg-rose-500/15",
  lava: "hover:bg-orange-500/10 dark:hover:bg-orange-500/15",
  "midnight-gradient": "hover:bg-indigo-500/10 dark:hover:bg-indigo-500/15",
  "teal-breeze": "hover:bg-teal-500/10 dark:hover:bg-teal-500/15",
};

export function CenteredLayout({ cv, version, pdfUrl }: CvLayoutProps) {
  const {
    g,
    theme,
    testimonials,
    achievements,
    hasSidebarContent,
    fullName,
    idNumber,
    address,
    email,
    phone,
    photoUrl,
    videoUrl,
  } = prepareCvData(cv, version);

  const cardHover = CARD_HOVER[theme.id] ?? CARD_HOVER.neutral;
  const cardClass = `rounded-xl border p-4 transition-colors duration-200 ${theme.web.border} ${cardHover}`;
  const titleCardClass = `rounded-xl px-4 py-2.5 font-medium text-lg ${theme.web.button}`;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* ---------- Header band ---------- */}
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

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mt-5"
        >
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
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border transition-colors hover:opacity-80 ${theme.web.pill}`}
            >
              <Phone className="w-3.5 h-3.5" />
              {phone}
            </a>
          )}
          {address && (
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${theme.web.pill}`}
            >
              <MapPin className="w-3.5 h-3.5" />
              {address}
            </span>
          )}
          {idNumber && (
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${theme.web.pill}`}
            >
              <IdCard className="w-3.5 h-3.5" />
              ID: {idNumber}
            </span>
          )}
        </motion.div>

        <div className="flex justify-center my-6">
          <a href={pdfUrl}>
            {/*      ^^^^^^ was: `/api/cv/${cv.shareId}/pdf` */}
            <Button className={theme.web.button}>Download PDF</Button>
          </a>
        </div>
      </div>

      {/* ---------- Two-column body ---------- */}
      <div
        className={`mt-4 grid grid-cols-1 gap-8 ${
          hasSidebarContent ? "md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]" : ""
        }`}
      >
        {hasSidebarContent && (
          <div className="min-w-0 order-2 md:order-1 space-y-6">
            {cv.interests.length > 0 && (
              <section className={`min-w-0 overflow-hidden ${cardClass}`}>
                <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
                  Interests
                </h2>
                <div className="flex flex-wrap gap-2 min-w-0">
                  {cv.interests.map((interest, i) => {
                    const isLong = interest.length > 40;
                    return (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.06 }}
                        className={
                          isLong
                            ? `block w-full text-xs leading-relaxed px-3 py-2 rounded-lg break-words ${theme.web.pill}`
                            : `inline-block max-w-full break-words text-xs px-3 py-1 rounded-full ${theme.web.pill}`
                        }
                      >
                        {interest}
                      </motion.span>
                    );
                  })}
                </div>
              </section>
            )}
            {cv.links.length > 0 && (
              <section className={`min-w-0 overflow-hidden ${cardClass}`}>
                <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
                  Links
                </h2>
                <div className="flex flex-col gap-2 min-w-0">
                  {cv.links.map((l, i) => (
                    <motion.a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      className={`text-sm break-words ${theme.web.link}`}
                    >
                      {l.label}
                      {l.description && (
                        <span className="text-muted-foreground">
                          {" "}
                          — {l.description}
                        </span>
                      )}
                    </motion.a>
                  ))}
                </div>
              </section>
            )}
            {cv.references.length > 0 && (
              <section className={`min-w-0 overflow-hidden ${cardClass}`}>
                <h2 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
                  References
                </h2>
                <div className="space-y-2">
                  {cv.references.map((r, i) => (
                    <p
                      key={i}
                      className="text-sm text-muted-foreground break-words"
                    >
                      {r.name}
                      {r.relationship ? ` (${r.relationship})` : ""} —{" "}
                      {r.contact}
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <div className="min-w-0 order-1 md:order-2 space-y-6">
          {g?.topSkills && g.topSkills.length > 0 && (
            <section className={cardClass}>
              <h2 className="font-medium text-lg mb-3">Top skills</h2>
              <div className="flex flex-wrap gap-2">
                {g.topSkills.map((skill, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className={`text-xs px-3 py-1 rounded-full ${theme.web.pill}`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </section>
          )}

          <div className="space-y-3">
            <div className={titleCardClass}>Experience</div>
            {g?.experience?.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={cardClass}
              >
                <p className="font-medium">
                  {e.role} — {e.company}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {e.period}
                </p>
                {e.bullets && e.bullets.length > 0 && (
                  <ul className="list-disc list-inside text-sm mt-2 space-y-0.5">
                    {e.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <div className={titleCardClass}>Education</div>
            {g?.education?.map((ed, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={cardClass}
              >
                <p className="font-medium">
                  {ed.qualification} — {ed.institution}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ed.period}
                </p>
                {ed.description && (
                  <p className="text-sm mt-2 whitespace-pre-line">
                    {ed.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {testimonials && testimonials.length > 0 && (
            <div className="space-y-3">
              <div className={titleCardClass}>Testimonials</div>
              {testimonials.map((t, i) => (
                <motion.blockquote
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={`${cardClass} italic text-sm`}
                >
                  &quot;{t.text}&quot;{" "}
                  <span className="not-italic text-muted-foreground">
                    — {t.author}
                  </span>
                </motion.blockquote>
              ))}
            </div>
          )}

          {achievements && achievements.length > 0 && (
            <div className="space-y-3">
              <div className={titleCardClass}>Achievements</div>
              {achievements.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={cardClass}
                >
                  <p className="font-medium">{a.title}</p>
                  {a.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {a.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {g?.closingNote && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`mt-10 text-center text-sm italic ${theme.web.accentText}`}
        >
          &quot;{g.closingNote}&quot;
        </motion.p>
      )}
    </div>
  );
}
