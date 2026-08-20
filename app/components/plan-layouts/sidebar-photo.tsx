// // components/cv-layouts/sidebar-photo.tsx
// "use client";

// import { motion } from "framer-motion";
// import { Mail, Phone, Link2, Award, GraduationCap } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { prepareCvData, toWhatsAppNumber } from "@/lib/cv-data";
// import type { CvLayoutProps } from "./types";

// export function SidebarPhotoLayout({ cv }: CvLayoutProps) {
//   const {
//     g,
//     theme,
//     testimonials,
//     achievements,
//     fullName,
//     address,
//     email,
//     phone,
//     photoUrl,
//   } = prepareCvData(cv);

//   const skills = g?.topSkills ?? [];

//   return (
//     <div className="max-w-5xl mx-auto my-10 rounded-2xl overflow-hidden border border-border shadow-sm bg-background">
//       <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
//         {/* ---------- Dark sidebar ---------- */}
//         <div className="bg-zinc-900 text-zinc-100 p-8 space-y-8">
//           {photoUrl && (
//             <motion.img
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.7 }}
//               src={photoUrl}
//               className="w-full aspect-square object-cover rounded-xl"
//             />
//           )}

//           <div className="space-y-3">
//             <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
//               Contact
//             </h2>
//             <div className="space-y-2 text-sm">
//               {phone && (
//                 <a
//                   href={`https://wa.me/${toWhatsAppNumber(phone)}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-2 hover:opacity-80"
//                 >
//                   <Phone className="w-4 h-4 shrink-0" /> {phone}
//                 </a>
//               )}
//               {email && (
//                 <a
//                   href={`mailto:${email}`}
//                   className="flex items-center gap-2 hover:opacity-80 break-all"
//                 >
//                   <Mail className="w-4 h-4 shrink-0" /> {email}
//                 </a>
//               )}
//               {cv.links[0] && (
//                 <a
//                   href={cv.links[0].url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-2 hover:opacity-80 break-all"
//                 >
//                   <Link2 className="w-4 h-4 shrink-0" /> {cv.links[0].label}
//                 </a>
//               )}
//             </div>
//           </div>

//           {skills.length > 0 && (
//             <div className="space-y-3">
//               <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
//                 Expert in
//               </h2>
//               <p className="text-lg font-semibold leading-snug">
//                 {skills.slice(0, 3).join(", ")}
//               </p>
//             </div>
//           )}

//           {skills.length > 0 && (
//             <div className="space-y-3">
//               <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
//                 Skills
//               </h2>
//               <div className="space-y-3">
//                 {skills.map((skill, i) => (
//                   <div key={i}>
//                     <p className="text-sm mb-1">{skill}</p>
//                     <div className="h-1.5 rounded-full bg-zinc-700 overflow-hidden">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         whileInView={{ width: `${85 - i * 8}%` }}
//                         viewport={{ once: true }}
//                         transition={{ duration: 0.8, delay: i * 0.1 }}
//                         className={`h-full rounded-full ${theme.web.button}`}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {cv.interests.length > 0 && (
//             <div className="space-y-2">
//               <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
//                 Interests
//               </h2>
//               <div className="flex flex-wrap gap-1.5">
//                 {cv.interests.map((interest, i) => (
//                   <span
//                     key={i}
//                     className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300"
//                   >
//                     {interest}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ---------- Content panel ---------- */}
//         <div className="p-8 space-y-8">
//           <div>
//             <motion.h1
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className={`text-3xl font-bold uppercase ${theme.web.heading}`}
//             >
//               {fullName}
//             </motion.h1>
//             <p className={`font-medium mt-1 ${theme.web.accentText}`}>
//               {g?.headline}
//             </p>
//             {address && (
//               <p className="text-sm text-muted-foreground mt-1">{address}</p>
//             )}
//             <div className="mt-4">
//               <a href={`/api/cv/${cv.shareId}/pdf`}>
//                 <Button className={theme.web.button} size="sm">
//                   Download PDF
//                 </Button>
//               </a>
//             </div>
//           </div>

//           {g?.summary && (
//             <section>
//               <h2 className="font-semibold text-sm uppercase tracking-wide mb-2">
//                 Profile
//               </h2>
//               <p className="text-sm text-muted-foreground leading-relaxed">
//                 {g.summary}
//               </p>
//             </section>
//           )}

//           <section>
//             <h2 className="font-semibold text-sm uppercase tracking-wide mb-4">
//               Experience
//             </h2>
//             <div className={`space-y-6 border-l-2 pl-5 ${theme.web.border}`}>
//               {g?.experience?.map((e, i) => (
//                 <motion.div
//                   key={i}
//                   initial={{ opacity: 0, x: -8 }}
//                   whileInView={{ opacity: 1, x: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ duration: 0.5, delay: i * 0.08 }}
//                   className="relative"
//                 >
//                   <span
//                     className={`absolute -left-[26px] top-1.5 w-2.5 h-2.5 rounded-full ${theme.web.button}`}
//                   />
//                   <div className="flex items-baseline justify-between gap-4 flex-wrap">
//                     <p className="font-semibold">
//                       {e.role} — {e.company}
//                     </p>
//                     <p className="text-xs text-muted-foreground shrink-0">
//                       {e.period}
//                     </p>
//                   </div>
//                   {e.bullets && e.bullets.length > 0 && (
//                     <ul className="list-disc list-inside text-sm mt-1.5 space-y-0.5 text-muted-foreground">
//                       {e.bullets.map((b, j) => (
//                         <li key={j}>{b}</li>
//                       ))}
//                     </ul>
//                   )}
//                 </motion.div>
//               ))}
//             </div>
//           </section>

//           {achievements && achievements.length > 0 && (
//             <section>
//               <h2 className="font-semibold text-sm uppercase tracking-wide mb-4">
//                 Achievements
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {achievements.map((a, i) => (
//                   <motion.div
//                     key={i}
//                     initial={{ opacity: 0, y: 8 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.5, delay: i * 0.08 }}
//                     className="flex gap-3"
//                   >
//                     <span
//                       className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${theme.web.pill}`}
//                     >
//                       <Award className="w-4 h-4" />
//                     </span>
//                     <div>
//                       <p className="font-medium text-sm">{a.title}</p>
//                       {a.description && (
//                         <p className="text-xs text-muted-foreground mt-0.5">
//                           {a.description}
//                         </p>
//                       )}
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </section>
//           )}

//           {g?.education && g.education.length > 0 && (
//             <section>
//               <h2 className="font-semibold text-sm uppercase tracking-wide mb-4">
//                 Education
//               </h2>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                 {g.education.map((ed, i) => (
//                   <motion.div
//                     key={i}
//                     initial={{ opacity: 0, y: 8 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.4, delay: i * 0.08 }}
//                     className="text-center"
//                   >
//                     <span
//                       className={`inline-flex w-10 h-10 rounded-full items-center justify-center mb-2 ${theme.web.pill}`}
//                     >
//                       <GraduationCap className="w-5 h-5" />
//                     </span>
//                     <p className="text-xs font-medium leading-snug">
//                       {ed.qualification}
//                     </p>
//                     <p className="text-[11px] text-muted-foreground">
//                       {ed.institution}
//                     </p>
//                   </motion.div>
//                 ))}
//               </div>
//             </section>
//           )}

//           {testimonials && testimonials.length > 0 && (
//             <section className="space-y-3">
//               <h2 className="font-semibold text-sm uppercase tracking-wide">
//                 Testimonials
//               </h2>
//               {testimonials.map((t, i) => (
//                 <blockquote
//                   key={i}
//                   className={`text-sm italic border-l-2 pl-4 ${theme.web.border}`}
//                 >
//                   &quot;{t.text}&quot;{" "}
//                   <span className="not-italic text-muted-foreground">
//                     — {t.author}
//                   </span>
//                 </blockquote>
//               ))}
//             </section>
//           )}

//           {g?.closingNote && (
//             <p className={`text-sm italic ${theme.web.accentText}`}>
//               &quot;{g.closingNote}&quot;
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// components/cv-layouts/sidebar-photo.tsx
// components/cv-layouts/sidebar-photo.tsx
// components/cv-layouts/sidebar-photo.tsx
"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Link2, Award, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prepareCvData, toWhatsAppNumber } from "@/lib/cv-data";
import type { CvLayoutProps } from "./types";

/**
 * Themed hover tint for interest pills on the dark sidebar. Kept separate
 * from CARD_HOVER (used elsewhere for light-background cards) because the
 * zinc-900 sidebar needs a lighter, more saturated tint to read clearly.
 */
const INTEREST_HOVER: Record<string, string> = {
  neutral: "hover:bg-slate-400/20 hover:text-slate-100",
  "amber-classic": "hover:bg-amber-400/20 hover:text-amber-100",
  "ocean-blue": "hover:bg-blue-400/20 hover:text-blue-100",
  "blue-gradient": "hover:bg-blue-400/20 hover:text-blue-100",
  emerald: "hover:bg-emerald-400/20 hover:text-emerald-100",
  "royal-violet": "hover:bg-violet-400/20 hover:text-violet-100",
  crimson: "hover:bg-rose-400/20 hover:text-rose-100",
  lava: "hover:bg-orange-400/20 hover:text-orange-100",
  "midnight-gradient": "hover:bg-indigo-400/20 hover:text-indigo-100",
  "teal-breeze": "hover:bg-teal-400/20 hover:text-teal-100",
};

const LONG_INTEREST_THRESHOLD = 40;

export function SidebarPhotoLayout({ cv, version, pdfUrl }: CvLayoutProps) {
  const {
    g,
    theme,
    testimonials,
    achievements,
    fullName,
    address,
    email,
    phone,
    photoUrl,
    videoUrl,
  } = prepareCvData(cv, version);

  const skills = g?.topSkills ?? [];
  const interestHover = INTEREST_HOVER[theme.id] ?? INTEREST_HOVER.neutral;

  return (
    <div className="max-w-5xl mx-auto my-10 rounded-2xl overflow-hidden border border-border shadow-sm bg-background">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* ---------- Dark sidebar ---------- */}
        <div className="bg-zinc-900 text-zinc-100 p-8 space-y-8">
          {videoUrl ? (
            <motion.video
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full aspect-square object-cover rounded-xl"
            />
          ) : photoUrl ? (
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              src={photoUrl}
              className="w-full aspect-square object-cover rounded-xl"
            />
          ) : null}

          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Contact
            </h2>
            <div className="space-y-2 text-sm">
              {phone && (
                <a
                  href={`https://wa.me/${toWhatsAppNumber(phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80"
                >
                  <Phone className="w-4 h-4 shrink-0" /> {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 hover:opacity-80 break-all"
                >
                  <Mail className="w-4 h-4 shrink-0" /> {email}
                </a>
              )}
              {cv.links[0] && (
                <a
                  href={cv.links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 break-all"
                >
                  <Link2 className="w-4 h-4 shrink-0" /> {cv.links[0].label}
                </a>
              )}
            </div>
          </div>

          {skills.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Expert in
              </h2>
              <p className="text-lg font-semibold leading-snug">
                {skills.slice(0, 3).join(", ")}
              </p>
            </div>
          )}

          {skills.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Skills
              </h2>
              <div className="space-y-3">
                {skills.map((skill, i) => (
                  <div key={i}>
                    <p className="text-sm mb-1">{skill}</p>
                    <div className="h-1.5 rounded-full bg-zinc-700 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${85 - i * 8}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full rounded-full ${theme.web.button}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cv.interests.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Interests
              </h2>
              <div className="flex flex-wrap gap-2 min-w-0">
                {cv.interests.map((interest, i) => {
                  const isLong = interest.length > LONG_INTEREST_THRESHOLD;
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      className={
                        isLong
                          ? `block w-full text-xs leading-relaxed px-3.5 py-2.5 rounded-lg break-words bg-zinc-800 text-zinc-300 border border-zinc-700/60 transition-colors duration-200 ${interestHover}`
                          : `inline-block max-w-full break-words text-xs px-3.5 py-2 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60 transition-colors duration-200 ${interestHover}`
                      }
                    >
                      {interest}
                    </motion.span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ---------- Content panel ---------- */}
        <div className="p-8 space-y-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-3xl font-bold uppercase ${theme.web.heading}`}
            >
              {fullName}
            </motion.h1>
            <p className={`font-medium mt-1 ${theme.web.accentText}`}>
              {g?.headline}
            </p>
            {address && (
              <p className="text-sm text-muted-foreground mt-1">{address}</p>
            )}
            <div className="mt-4">
              <a href={pdfUrl}>
                <Button className={theme.web.button} size="sm">
                  Download PDF
                </Button>
              </a>
            </div>
          </div>

          {g?.summary && (
            <section>
              <h2 className="font-semibold text-sm uppercase tracking-wide mb-2">
                Profile
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {g.summary}
              </p>
            </section>
          )}

          <section>
            <h2 className="font-semibold text-sm uppercase tracking-wide mb-4">
              Experience
            </h2>
            <div className={`space-y-6 border-l-2 pl-5 ${theme.web.border}`}>
              {g?.experience?.map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative"
                >
                  <span
                    className={`absolute -left-[26px] top-1.5 w-2.5 h-2.5 rounded-full ${theme.web.button}`}
                  />
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <p className="font-semibold">
                      {e.role} — {e.company}
                    </p>
                    <p className="text-xs text-muted-foreground shrink-0">
                      {e.period}
                    </p>
                  </div>
                  {e.bullets && e.bullets.length > 0 && (
                    <ul className="list-disc list-inside text-sm mt-1.5 space-y-0.5 text-muted-foreground">
                      {e.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {achievements && achievements.length > 0 && (
            <section>
              <h2 className="font-semibold text-sm uppercase tracking-wide mb-4">
                Achievements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex gap-3"
                  >
                    <span
                      className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${theme.web.pill}`}
                    >
                      <Award className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="font-medium text-sm">{a.title}</p>
                      {a.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {a.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {g?.education && g.education.length > 0 && (
            <section>
              <h2 className="font-semibold text-sm uppercase tracking-wide mb-4">
                Education
              </h2>
              <div className="space-y-4">
                {g.education.map((ed, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex gap-3"
                  >
                    <span
                      className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${theme.web.pill}`}
                    >
                      <GraduationCap className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="flex items-baseline justify-between gap-4 flex-wrap">
                        <p className="font-medium text-sm">
                          {ed.qualification} — {ed.institution}
                        </p>
                        <p className="text-xs text-muted-foreground shrink-0">
                          {ed.period}
                        </p>
                      </div>
                      {ed.description && (
                        <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">
                          {ed.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {testimonials && testimonials.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-semibold text-sm uppercase tracking-wide">
                Testimonials
              </h2>
              {testimonials.map((t, i) => (
                <blockquote
                  key={i}
                  className={`text-sm italic border-l-2 pl-4 ${theme.web.border}`}
                >
                  &quot;{t.text}&quot;{" "}
                  <span className="not-italic text-muted-foreground">
                    — {t.author}
                  </span>
                </blockquote>
              ))}
            </section>
          )}

          {g?.closingNote && (
            <p className={`text-sm italic ${theme.web.accentText}`}>
              &quot;{g.closingNote}&quot;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
