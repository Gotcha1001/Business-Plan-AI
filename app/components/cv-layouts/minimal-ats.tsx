// "use client";

// import { Button } from "@/components/ui/button";
// import { prepareCvData, toWhatsAppNumber } from "@/lib/cv-data";
// import type { CvLayoutProps } from "./types";

// export function MinimalAtsLayout({ cv }: CvLayoutProps) {
//   const {
//     g,
//     theme,
//     testimonials,
//     achievements,
//     fullName,
//     idNumber,
//     address,
//     email,
//     phone,
//   } = prepareCvData(cv);

//   const ruleClass = `border-b pb-1 mb-3 ${theme.web.borderSoft}`;

//   return (
//     <div className="max-w-2xl mx-auto py-10 px-4">
//       <div className="flex items-start justify-between gap-4 flex-wrap">
//         <div>
//           <h1 className="text-2xl font-semibold">{fullName}</h1>
//           <p className={`mt-1 ${theme.web.accentText}`}>{g?.headline}</p>
//           <p className="text-sm text-muted-foreground mt-2 space-x-3">
//             {email && <span>{email}</span>}
//             {phone && <span>{phone}</span>}
//             {address && <span>{address}</span>}
//             {idNumber && <span>ID: {idNumber}</span>}
//           </p>
//         </div>
//         <a href={`/api/cv/${cv.shareId}/pdf`}>
//           <Button variant="outline" size="sm">
//             Download PDF
//           </Button>
//         </a>
//       </div>

//       {g?.summary && (
//         <p className="text-sm text-muted-foreground mt-5 leading-relaxed">
//           {g.summary}
//         </p>
//       )}

//       {g?.topSkills && g.topSkills.length > 0 && (
//         <div className="mt-6">
//           <h2
//             className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
//           >
//             Top skills
//           </h2>
//           <p className="text-sm">{g.topSkills.join(" · ")}</p>
//         </div>
//       )}

//       <div className="mt-6">
//         <h2
//           className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
//         >
//           Experience
//         </h2>
//         <div className="space-y-4">
//           {g?.experience?.map((e, i) => (
//             <div key={i}>
//               <div className="flex items-baseline justify-between gap-4 flex-wrap">
//                 <p className="font-medium text-sm">
//                   {e.role} — {e.company}
//                 </p>
//                 <p className="text-xs text-muted-foreground">{e.period}</p>
//               </div>
//               {e.bullets && e.bullets.length > 0 && (
//                 <ul className="list-disc list-inside text-sm mt-1 space-y-0.5 text-muted-foreground">
//                   {e.bullets.map((b, j) => (
//                     <li key={j}>{b}</li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-6">
//         <h2
//           className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
//         >
//           Education
//         </h2>
//         <div className="space-y-3">
//           {g?.education?.map((ed, i) => (
//             <div key={i}>
//               <div className="flex items-baseline justify-between gap-4 flex-wrap">
//                 <p className="text-sm">
//                   {ed.qualification} — {ed.institution}
//                 </p>
//                 <p className="text-xs text-muted-foreground">{ed.period}</p>
//               </div>
//               {ed.description && (
//                 <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">
//                   {ed.description}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {achievements && achievements.length > 0 && (
//         <div className="mt-6">
//           <h2
//             className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
//           >
//             Achievements
//           </h2>
//           <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
//             {achievements.map((a, i) => (
//               <li key={i}>
//                 <span className="text-foreground">{a.title}</span>
//                 {a.description ? ` — ${a.description}` : ""}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {testimonials && testimonials.length > 0 && (
//         <div className="mt-6">
//           <h2
//             className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
//           >
//             Testimonials
//           </h2>
//           <div className="space-y-2">
//             {testimonials.map((t, i) => (
//               <p key={i} className="text-sm italic text-muted-foreground">
//                 &quot;{t.text}&quot; — {t.author}
//               </p>
//             ))}
//           </div>
//         </div>
//       )}

//       {(cv.interests.length > 0 ||
//         cv.links.length > 0 ||
//         cv.references.length > 0) && (
//         <div className="mt-6 space-y-4">
//           {cv.interests.length > 0 && (
//             <div>
//               <h2
//                 className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
//               >
//                 Interests
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 {cv.interests.join(", ")}
//               </p>
//             </div>
//           )}
//           {cv.links.length > 0 && (
//             <div>
//               <h2
//                 className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
//               >
//                 Links
//               </h2>
//               <div className="space-y-1">
//                 {cv.links.map((l, i) => (
//                   <a
//                     key={i}
//                     href={l.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className={`block text-sm ${theme.web.link}`}
//                   >
//                     {l.label}
//                   </a>
//                 ))}
//               </div>
//             </div>
//           )}
//           {cv.references.length > 0 && (
//             <div>
//               <h2
//                 className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
//               >
//                 References
//               </h2>
//               <div className="space-y-1">
//                 {cv.references.map((r, i) => (
//                   <p key={i} className="text-sm text-muted-foreground">
//                     {r.name}
//                     {r.relationship ? ` (${r.relationship})` : ""} — {r.contact}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {g?.closingNote && (
//         <p className={`mt-8 text-sm italic ${theme.web.accentText}`}>
//           &quot;{g.closingNote}&quot;
//         </p>
//       )}
//     </div>
//   );
// }
// components/cv-layouts/minimal-ats.tsx
"use client";

import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prepareCvData, toWhatsAppNumber } from "@/lib/cv-data";
import type { CvLayoutProps } from "./types";

export function MinimalAtsLayout({ cv, version, pdfUrl }: CvLayoutProps) {
  const {
    g,
    theme,
    testimonials,
    achievements,
    fullName,
    idNumber,
    address,
    email,
    phone,
    photoUrl,
    videoUrl,
  } = prepareCvData(cv, version);
  const ruleClass = `border-b pb-1 mb-3 ${theme.web.borderSoft}`;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          {videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-36 h-36 rounded-full object-cover shrink-0"
            />
          ) : photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- small avatar-style thumbnail, not worth next/image here
            <img
              src={photoUrl}
              alt={fullName}
              className="w-36 h-36 rounded-full object-cover shrink-0"
            />
          ) : null}
          <div>
            <h1 className="text-2xl font-semibold">{fullName}</h1>
            <p className={`mt-1 ${theme.web.accentText}`}>{g?.headline}</p>
            <p className="text-sm text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-1 hover:opacity-80"
                >
                  <Mail className="w-3.5 h-3.5" /> {email}
                </a>
              )}
              {phone && (
                <a
                  href={`https://wa.me/${toWhatsAppNumber(phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:opacity-80"
                >
                  <Phone className="w-3.5 h-3.5" /> {phone}
                </a>
              )}
              {address && <span>{address}</span>}
              {idNumber && <span>ID: {idNumber}</span>}
            </p>
          </div>
        </div>
        <a href={pdfUrl}>
          <Button variant="outline" size="sm">
            Download PDF
          </Button>
        </a>
      </div>
      {g?.summary && (
        <p className="text-sm text-muted-foreground mt-5 leading-relaxed">
          {g.summary}
        </p>
      )}
      {g?.topSkills && g.topSkills.length > 0 && (
        <div className="mt-6">
          <h2
            className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
          >
            Top skills
          </h2>
          <p className="text-sm">{g.topSkills.join(" · ")}</p>
        </div>
      )}
      <div className="mt-6">
        <h2
          className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
        >
          Experience
        </h2>
        <div className="space-y-4">
          {g?.experience?.map((e, i) => (
            <div key={i}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <p className="font-medium text-sm">
                  {e.role} — {e.company}
                </p>
                <p className="text-xs text-muted-foreground">{e.period}</p>
              </div>
              {e.bullets && e.bullets.length > 0 && (
                <ul className="list-disc list-inside text-sm mt-1 space-y-0.5 text-muted-foreground">
                  {e.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h2
          className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
        >
          Education
        </h2>
        <div className="space-y-3">
          {g?.education?.map((ed, i) => (
            <div key={i}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <p className="text-sm">
                  {ed.qualification} — {ed.institution}
                </p>
                <p className="text-xs text-muted-foreground">{ed.period}</p>
              </div>
              {ed.description && (
                <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">
                  {ed.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      {achievements && achievements.length > 0 && (
        <div className="mt-6">
          <h2
            className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
          >
            Achievements
          </h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            {achievements.map((a, i) => (
              <li key={i}>
                <span className="text-foreground">{a.title}</span>
                {a.description ? ` — ${a.description}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
      {testimonials && testimonials.length > 0 && (
        <div className="mt-6">
          <h2
            className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
          >
            Testimonials
          </h2>
          <div className="space-y-2">
            {testimonials.map((t, i) => (
              <p key={i} className="text-sm italic text-muted-foreground">
                &quot;{t.text}&quot; — {t.author}
              </p>
            ))}
          </div>
        </div>
      )}
      {(cv.interests.length > 0 ||
        cv.links.length > 0 ||
        cv.references.length > 0) && (
        <div className="mt-6 space-y-4">
          {cv.interests.length > 0 && (
            <div>
              <h2
                className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
              >
                Interests
              </h2>
              <p className="text-sm text-muted-foreground">
                {cv.interests.join(", ")}
              </p>
            </div>
          )}
          {cv.links.length > 0 && (
            <div>
              <h2
                className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
              >
                Links
              </h2>
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
              <h2
                className={`text-sm font-semibold uppercase tracking-wide ${ruleClass}`}
              >
                References
              </h2>
              <div className="space-y-1">
                {cv.references.map((r, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {r.name}
                    {r.relationship ? ` (${r.relationship})` : ""} — {r.contact}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {g?.closingNote && (
        <p className={`mt-8 text-sm italic ${theme.web.accentText}`}>
          &quot;{g.closingNote}&quot;
        </p>
      )}
    </div>
  );
}
