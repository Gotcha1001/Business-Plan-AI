// // components/cv-layouts/split-banner.tsx
// "use client";

// import { motion } from "framer-motion";
// import { Mail, Phone, MapPin } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { prepareCvData, toWhatsAppNumber } from "@/lib/cv-data";
// import type { CvLayoutProps } from "./types";

// export function SplitBannerLayout({ cv }: CvLayoutProps) {
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

//   return (
//     <div className="max-w-4xl mx-auto py-10 px-4">
//       {/* ---------- Full-width banner ---------- */}
//       <motion.div
//         initial={{ opacity: 0, y: -8 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className={`rounded-2xl px-8 py-10 text-center text-white ${theme.web.button}`}
//       >
//         {photoUrl && (
//           <img
//             src={photoUrl}
//             className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-white/30"
//           />
//         )}
//         <h1 className="text-3xl font-bold">{fullName}</h1>
//         <p className="opacity-90 mt-1">{g?.headline}</p>
//         <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm opacity-90">
//           {email && (
//             <a
//               href={`mailto:${email}`}
//               className="flex items-center gap-1.5 hover:opacity-70"
//             >
//               <Mail className="w-3.5 h-3.5" /> {email}
//             </a>
//           )}
//           {phone && (
//             <a
//               href={`https://wa.me/${toWhatsAppNumber(phone)}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-1.5 hover:opacity-70"
//             >
//               <Phone className="w-3.5 h-3.5" /> {phone}
//             </a>
//           )}
//           {address && (
//             <span className="flex items-center gap-1.5">
//               <MapPin className="w-3.5 h-3.5" /> {address}
//             </span>
//           )}
//         </div>
//         <div className="mt-5">
//           <a href={`/api/cv/${cv.shareId}/pdf`}>
//             <Button variant="secondary" size="sm">
//               Download PDF
//             </Button>
//           </a>
//         </div>
//       </motion.div>

//       {/* ---------- Flowing single column ---------- */}
//       <div className="mt-8 space-y-8">
//         {g?.summary && (
//           <p className="text-center text-muted-foreground max-w-2xl mx-auto">
//             {g.summary}
//           </p>
//         )}

//         {g?.topSkills && g.topSkills.length > 0 && (
//           <div className="flex flex-wrap justify-center gap-2">
//             {g.topSkills.map((skill, i) => (
//               <span
//                 key={i}
//                 className={`text-xs px-3 py-1 rounded-full ${theme.web.pill}`}
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         )}

//         <section>
//           <h2 className={`text-lg font-semibold mb-4 ${theme.web.heading}`}>
//             Experience
//           </h2>
//           <div className="space-y-4">
//             {g?.experience?.map((e, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, x: -8 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.5, delay: i * 0.06 }}
//                 className={`border-l-4 pl-4 py-1 ${theme.web.border}`}
//               >
//                 <div className="flex items-baseline justify-between gap-4 flex-wrap">
//                   <p className="font-medium">
//                     {e.role}{" "}
//                     <span className={theme.web.accentText}>· {e.company}</span>
//                   </p>
//                   <p className="text-xs text-muted-foreground">{e.period}</p>
//                 </div>
//                 {e.bullets && e.bullets.length > 0 && (
//                   <ul className="list-disc list-inside text-sm mt-1.5 space-y-0.5 text-muted-foreground">
//                     {e.bullets.map((b, j) => (
//                       <li key={j}>{b}</li>
//                     ))}
//                   </ul>
//                 )}
//               </motion.div>
//             ))}
//           </div>
//         </section>

//         <section>
//           <h2 className={`text-lg font-semibold mb-4 ${theme.web.heading}`}>
//             Education
//           </h2>
//           <div className="space-y-3">
//             {g?.education?.map((ed, i) => (
//               <div
//                 key={i}
//                 className={`border-l-4 pl-4 py-1 ${theme.web.borderSoft}`}
//               >
//                 <p className="font-medium">
//                   {ed.qualification}{" "}
//                   <span className={theme.web.accentText}>
//                     · {ed.institution}
//                   </span>
//                 </p>
//                 <p className="text-xs text-muted-foreground">{ed.period}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {achievements && achievements.length > 0 && (
//           <section>
//             <h2 className={`text-lg font-semibold mb-4 ${theme.web.heading}`}>
//               Achievements
//             </h2>
//             <div className="grid sm:grid-cols-2 gap-3">
//               {achievements.map((a, i) => (
//                 <div
//                   key={i}
//                   className={`rounded-xl border p-4 ${theme.web.border}`}
//                 >
//                   <p className="font-medium text-sm">{a.title}</p>
//                   {a.description && (
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {a.description}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {testimonials && testimonials.length > 0 && (
//           <section>
//             <h2 className={`text-lg font-semibold mb-4 ${theme.web.heading}`}>
//               Testimonials
//             </h2>
//             <div className="grid sm:grid-cols-2 gap-3">
//               {testimonials.map((t, i) => (
//                 <blockquote
//                   key={i}
//                   className={`rounded-xl border p-4 italic text-sm ${theme.web.border}`}
//                 >
//                   &quot;{t.text}&quot;{" "}
//                   <span className="not-italic text-muted-foreground">
//                     — {t.author}
//                   </span>
//                 </blockquote>
//               ))}
//             </div>
//           </section>
//         )}

//         {(cv.interests.length > 0 ||
//           cv.links.length > 0 ||
//           cv.references.length > 0) && (
//           <section className="grid sm:grid-cols-3 gap-6 pt-4 border-t">
//             {cv.interests.length > 0 && (
//               <div>
//                 <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
//                   Interests
//                 </h3>
//                 <p className="text-sm">{cv.interests.join(", ")}</p>
//               </div>
//             )}
//             {cv.links.length > 0 && (
//               <div>
//                 <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
//                   Links
//                 </h3>
//                 <div className="space-y-1">
//                   {cv.links.map((l, i) => (
//                     <a
//                       key={i}
//                       href={l.url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className={`block text-sm ${theme.web.link}`}
//                     >
//                       {l.label}
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {cv.references.length > 0 && (
//               <div>
//                 <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
//                   References
//                 </h3>
//                 <div className="space-y-1">
//                   {cv.references.map((r, i) => (
//                     <p key={i} className="text-sm text-muted-foreground">
//                       {r.name} — {r.contact}
//                     </p>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </section>
//         )}

//         {g?.closingNote && (
//           <p className={`text-center text-sm italic ${theme.web.accentText}`}>
//             &quot;{g.closingNote}&quot;
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
// components/cv-layouts/split-banner.tsx
"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prepareCvData, toWhatsAppNumber } from "@/lib/cv-data";
import type { CvLayoutProps } from "./types";

export function SplitBannerLayout({ cv, version, pdfUrl }: CvLayoutProps) {
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

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* ---------- Full-width banner ---------- */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`rounded-2xl px-8 py-10 text-center text-white ${theme.web.button}`}
      >
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-52 h-52 rounded-full mx-auto mb-4 object-cover ring-4 ring-white/30"
          />
        ) : photoUrl ? (
          <img
            src={photoUrl}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-white/30"
          />
        ) : null}
        <h1 className="text-3xl font-bold">{fullName}</h1>
        <p className="opacity-90 mt-1">{g?.headline}</p>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm opacity-90">
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 hover:opacity-70"
            >
              <Mail className="w-3.5 h-3.5" /> {email}
            </a>
          )}
          {phone && (
            <a
              href={`https://wa.me/${toWhatsAppNumber(phone)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:opacity-70"
            >
              <Phone className="w-3.5 h-3.5" /> {phone}
            </a>
          )}
          {address && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {address}
            </span>
          )}
        </div>
        <div className="mt-5">
          <a href={pdfUrl}>
            <Button variant="secondary" size="sm">
              Download PDF
            </Button>
          </a>
        </div>
      </motion.div>

      {/* ---------- Flowing single column ---------- */}
      <div className="mt-8 space-y-8">
        {g?.summary && (
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            {g.summary}
          </p>
        )}

        {g?.topSkills && g.topSkills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {g.topSkills.map((skill, i) => (
              <span
                key={i}
                className={`text-xs px-3 py-1 rounded-full ${theme.web.pill}`}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <section>
          <h2 className={`text-lg font-semibold mb-4 ${theme.web.heading}`}>
            Experience
          </h2>
          <div className="space-y-4">
            {g?.experience?.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={`border-l-4 pl-4 py-1 ${theme.web.border}`}
              >
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <p className="font-medium">
                    {e.role}{" "}
                    <span className={theme.web.accentText}>· {e.company}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{e.period}</p>
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

        <section>
          <h2 className={`text-lg font-semibold mb-4 ${theme.web.heading}`}>
            Education
          </h2>
          <div className="space-y-3">
            {g?.education?.map((ed, i) => (
              <div
                key={i}
                className={`border-l-4 pl-4 py-1 ${theme.web.borderSoft}`}
              >
                <p className="font-medium">
                  {ed.qualification}{" "}
                  <span className={theme.web.accentText}>
                    · {ed.institution}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{ed.period}</p>
                {ed.description && (
                  <p className="text-sm text-muted-foreground mt-1.5 whitespace-pre-line">
                    {ed.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {achievements && achievements.length > 0 && (
          <section>
            <h2 className={`text-lg font-semibold mb-4 ${theme.web.heading}`}>
              Achievements
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {achievements.map((a, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-4 ${theme.web.border}`}
                >
                  <p className="font-medium text-sm">{a.title}</p>
                  {a.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {testimonials && testimonials.length > 0 && (
          <section>
            <h2 className={`text-lg font-semibold mb-4 ${theme.web.heading}`}>
              Testimonials
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {testimonials.map((t, i) => (
                <blockquote
                  key={i}
                  className={`rounded-xl border p-4 italic text-sm ${theme.web.border}`}
                >
                  &quot;{t.text}&quot;{" "}
                  <span className="not-italic text-muted-foreground">
                    — {t.author}
                  </span>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {(cv.interests.length > 0 ||
          cv.links.length > 0 ||
          cv.references.length > 0) && (
          <section className="grid sm:grid-cols-3 gap-6 pt-4 border-t">
            {cv.interests.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Interests
                </h3>
                <p className="text-sm">{cv.interests.join(", ")}</p>
              </div>
            )}
            {cv.links.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Links
                </h3>
                <div className="space-y-1">
                  {cv.links.map((l, i) => (
                    <a
                      key={i}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block text-sm ${theme.web.link}`}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {cv.references.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  References
                </h3>
                <div className="space-y-1">
                  {cv.references.map((r, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {r.name} — {r.contact}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {g?.closingNote && (
          <p className={`text-center text-sm italic ${theme.web.accentText}`}>
            &quot;{g.closingNote}&quot;
          </p>
        )}
      </div>
    </div>
  );
}
