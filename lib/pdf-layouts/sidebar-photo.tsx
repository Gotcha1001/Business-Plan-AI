// // lib/pdf-layouts/sidebar-photo.tsx
// //
// // Mirrors components/cv-layouts/sidebar-photo.tsx: full-bleed dark left
// // column (photo, contact, expert-in, skill bars, interests) next to a
// // white content column (name/headline, profile, experience timeline,
// // achievements, education, testimonials). Two full-height columns in
// // react-pdf are just two flex children in a row -- see the pagination
// // note in centered.tsx, the same caveat applies here.

// import {
//   Document,
//   Page,
//   Text,
//   View,
//   Image,
//   Link,
//   StyleSheet,
// } from "@react-pdf/renderer";
// import type { PdfLayoutData } from "./types";
// import { toWhatsAppNumber } from "./types";

// const DARK_BG = "#18181B"; // zinc-900, fixed regardless of theme for sidebar contrast
// const DARK_TEXT = "#E4E4E7"; // zinc-200
// const DARK_MUTED = "#A1A1AA"; // zinc-400
// const DARK_TRACK = "#3F3F46"; // zinc-700

// function buildStyles(theme: PdfLayoutData["theme"]) {
//   return StyleSheet.create({
//     page: { padding: 0, fontSize: 10 },
//     row: { flexDirection: "row", minHeight: "100%" },
//     sidebar: {
//       width: "34%",
//       backgroundColor: DARK_BG,
//       color: DARK_TEXT,
//       padding: 24,
//     },
//     photo: {
//       width: "100%",
//       aspectRatio: 1,
//       borderRadius: 8,
//       objectFit: "cover",
//       marginBottom: 16,
//     },
//     sideSection: { marginBottom: 16 },
//     sideLabel: {
//       fontSize: 8,
//       color: DARK_MUTED,
//       textTransform: "uppercase",
//       letterSpacing: 1,
//       marginBottom: 6,
//     },
//     sideLine: { fontSize: 9, color: DARK_TEXT, marginBottom: 4 },
//     expertLine: {
//       fontSize: 13,
//       color: DARK_TEXT,
//       fontWeight: 700,
//       lineHeight: 1.4,
//     },
//     skillName: { fontSize: 9, color: DARK_TEXT, marginBottom: 3 },
//     skillTrack: {
//       height: 4,
//       backgroundColor: DARK_TRACK,
//       borderRadius: 2,
//       marginBottom: 10,
//     },
//     skillFill: {
//       height: 4,
//       backgroundColor: theme.pdf.accentBorder,
//       borderRadius: 2,
//     },
//     interestPill: {
//       fontSize: 8,
//       color: DARK_TEXT,
//       backgroundColor: "#27272A",
//       paddingVertical: 3,
//       paddingHorizontal: 7,
//       borderRadius: 8,
//       marginRight: 4,
//       marginBottom: 4,
//     },
//     interestRow: { flexDirection: "row", flexWrap: "wrap" },

//     main: { width: "66%", padding: 28 },
//     name: { fontSize: 20, fontWeight: 700, textTransform: "uppercase" },
//     headline: { fontSize: 11, color: theme.pdf.headline, marginTop: 3 },
//     address: { fontSize: 9, color: "#666", marginTop: 2 },
//     section: { marginTop: 18 },
//     sectionTitle: {
//       fontSize: 10,
//       fontWeight: 700,
//       textTransform: "uppercase",
//       letterSpacing: 0.5,
//       marginBottom: 8,
//     },
//     summary: { fontSize: 9.5, color: "#444", lineHeight: 1.5 },

//     entry: {
//       marginBottom: 12,
//       paddingLeft: 10,
//       borderLeftWidth: 2,
//       borderLeftColor: theme.pdf.accentBorder,
//     },
//     entryHeadRow: { flexDirection: "row", justifyContent: "space-between" },
//     entryTitle: { fontSize: 10, fontWeight: 700 },
//     entryPeriod: { fontSize: 8, color: "#777" },
//     bullet: { fontSize: 9, color: "#555", marginTop: 3, marginLeft: 4 },

//     achGrid: { flexDirection: "row", flexWrap: "wrap" },
//     achItem: { width: "50%", marginBottom: 10, paddingRight: 8 },
//     achTitle: { fontSize: 9.5, fontWeight: 700 },
//     achDesc: { fontSize: 8.5, color: "#666", marginTop: 2 },

//     eduGrid: { flexDirection: "row", flexWrap: "wrap" },
//     eduItem: {
//       width: "25%",
//       marginBottom: 8,
//       paddingRight: 6,
//       textAlign: "center",
//     },
//     eduQual: { fontSize: 8, fontWeight: 700 },
//     eduInst: { fontSize: 7.5, color: "#777", marginTop: 1 },

//     testimonial: {
//       fontSize: 9,
//       fontStyle: "italic",
//       color: "#444",
//       marginBottom: 6,
//       borderLeftWidth: 2,
//       borderLeftColor: theme.pdf.accentBorder,
//       paddingLeft: 8,
//     },
//     closingNote: {
//       marginTop: 16,
//       fontSize: 9,
//       fontStyle: "italic",
//       color: theme.pdf.closingNote,
//     },
//   });
// }

// export function buildSidebarPhotoPdfDocument(data: PdfLayoutData) {
//   const {
//     cv,
//     theme,
//     g,
//     testimonials,
//     achievements,
//     fullName,
//     address,
//     email,
//     phone,
//     photoUrl,
//   } = data;
//   const styles = buildStyles(theme);
//   const skills = g?.topSkills ?? [];

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.row}>
//           {/* ---------- Dark sidebar ---------- */}
//           <View style={styles.sidebar}>
//             {photoUrl && (
//               // eslint-disable-next-line jsx-a11y/alt-text
//               <Image src={photoUrl} style={styles.photo} />
//             )}
//             <View style={styles.sideSection}>
//               <Text style={styles.sideLabel}>Contact</Text>
//               {phone && (
//                 <Link
//                   src={`https://wa.me/${toWhatsAppNumber(phone)}`}
//                   style={styles.sideLine}
//                 >
//                   {phone}
//                 </Link>
//               )}
//               {email && (
//                 <Link src={`mailto:${email}`} style={styles.sideLine}>
//                   {email}
//                 </Link>
//               )}
//               {cv.links[0] && (
//                 <Link src={cv.links[0].url} style={styles.sideLine}>
//                   {cv.links[0].label}
//                 </Link>
//               )}
//             </View>

//             {skills.length > 0 && (
//               <View style={styles.sideSection}>
//                 <Text style={styles.sideLabel}>Expert in</Text>
//                 <Text style={styles.expertLine}>
//                   {skills.slice(0, 3).join(", ")}
//                 </Text>
//               </View>
//             )}

//             {skills.length > 0 && (
//               <View style={styles.sideSection}>
//                 <Text style={styles.sideLabel}>Skills</Text>
//                 {skills.map((skill, i) => (
//                   <View key={i}>
//                     <Text style={styles.skillName}>{skill}</Text>
//                     <View style={styles.skillTrack}>
//                       <View
//                         style={[styles.skillFill, { width: `${85 - i * 8}%` }]}
//                       />
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             )}

//             {cv.interests.length > 0 && (
//               <View style={styles.sideSection}>
//                 <Text style={styles.sideLabel}>Interests</Text>
//                 <View style={styles.interestRow}>
//                   {cv.interests.map((interest, i) => (
//                     <Text key={i} style={styles.interestPill}>
//                       {interest}
//                     </Text>
//                   ))}
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* ---------- Content column ---------- */}
//           <View style={styles.main}>
//             <Text style={styles.name}>{fullName}</Text>
//             <Text style={styles.headline}>{g?.headline}</Text>
//             {address && <Text style={styles.address}>{address}</Text>}

//             {g?.summary && (
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Profile</Text>
//                 <Text style={styles.summary}>{g.summary}</Text>
//               </View>
//             )}

//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Experience</Text>
//               {g?.experience?.map((e, i) => (
//                 <View key={i} style={styles.entry} wrap={false}>
//                   <View style={styles.entryHeadRow}>
//                     <Text style={styles.entryTitle}>
//                       {e.role} — {e.company}
//                     </Text>
//                     <Text style={styles.entryPeriod}>{e.period}</Text>
//                   </View>
//                   {e.bullets?.map((b, j) => (
//                     <Text key={j} style={styles.bullet}>
//                       • {b}
//                     </Text>
//                   ))}
//                 </View>
//               ))}
//             </View>

//             {achievements && achievements.length > 0 && (
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Achievements</Text>
//                 <View style={styles.achGrid}>
//                   {achievements.map((a, i) => (
//                     <View key={i} style={styles.achItem}>
//                       <Text style={styles.achTitle}>{a.title}</Text>
//                       {a.description && (
//                         <Text style={styles.achDesc}>{a.description}</Text>
//                       )}
//                     </View>
//                   ))}
//                 </View>
//               </View>
//             )}

//             {g?.education && g.education.length > 0 && (
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Education</Text>
//                 <View style={styles.eduGrid}>
//                   {g.education.map((ed, i) => (
//                     <View key={i} style={styles.eduItem}>
//                       <Text style={styles.eduQual}>{ed.qualification}</Text>
//                       <Text style={styles.eduInst}>{ed.institution}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//             )}

//             {testimonials && testimonials.length > 0 && (
//               <View style={styles.section} wrap={false}>
//                 <Text style={styles.sectionTitle}>Testimonials</Text>
//                 {testimonials.map((t, i) => (
//                   <Text key={i} style={styles.testimonial}>
//                     &quot;{t.text}&quot; — {t.author}
//                   </Text>
//                 ))}
//               </View>
//             )}

//             {g?.closingNote && (
//               <Text style={styles.closingNote}>
//                 &quot;{g.closingNote}&quot;
//               </Text>
//             )}
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// }
// lib/pdf-layouts/sidebar-photo.tsx
//
// Mirrors components/cv-layouts/sidebar-photo.tsx: full-bleed dark left
// column (photo, contact, expert-in, skill bars, interests) next to a
// white content column (name/headline, profile, experience timeline,
// achievements, education, testimonials). Two full-height columns in
// react-pdf are just two flex children in a row -- see the pagination
// note in centered.tsx, the same caveat applies here.

import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import type { PdfLayoutData } from "./types";
import { toWhatsAppNumber } from "./types";

const DARK_BG = "#18181B"; // zinc-900, fixed regardless of theme for sidebar contrast
const DARK_TEXT = "#E4E4E7"; // zinc-200
const DARK_MUTED = "#A1A1AA"; // zinc-400
const DARK_TRACK = "#3F3F46"; // zinc-700

function buildStyles(theme: PdfLayoutData["theme"]) {
  return StyleSheet.create({
    page: { padding: 0, fontSize: 10 },
    row: { flexDirection: "row", minHeight: "100%" },
    sidebar: {
      width: "34%",
      backgroundColor: DARK_BG,
      color: DARK_TEXT,
      padding: 24,
    },
    photo: {
      width: "100%",
      aspectRatio: 1,
      borderRadius: 8,
      objectFit: "cover",
      marginBottom: 16,
    },
    sideSection: { marginBottom: 16 },
    sideLabel: {
      fontSize: 8,
      color: DARK_MUTED,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 6,
    },
    sideLine: { fontSize: 9, color: DARK_TEXT, marginBottom: 4 },
    expertLine: {
      fontSize: 13,
      color: DARK_TEXT,
      fontWeight: 700,
      lineHeight: 1.4,
    },
    skillName: { fontSize: 9, color: DARK_TEXT, marginBottom: 3 },
    skillTrack: {
      height: 4,
      backgroundColor: DARK_TRACK,
      borderRadius: 2,
      marginBottom: 10,
    },
    skillFill: {
      height: 4,
      backgroundColor: theme.pdf.accentBorder,
      borderRadius: 2,
    },
    interestPill: {
      fontSize: 8,
      color: DARK_TEXT,
      backgroundColor: "#27272A",
      paddingVertical: 3,
      paddingHorizontal: 7,
      borderRadius: 8,
      marginRight: 4,
      marginBottom: 4,
    },
    interestRow: { flexDirection: "row", flexWrap: "wrap" },

    main: { width: "66%", padding: 28 },
    name: { fontSize: 20, fontWeight: 700, textTransform: "uppercase" },
    headline: { fontSize: 11, color: theme.pdf.headline, marginTop: 3 },
    address: { fontSize: 9, color: "#666", marginTop: 2 },
    section: { marginTop: 18 },
    sectionTitle: {
      fontSize: 10,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    summary: { fontSize: 9.5, color: "#444", lineHeight: 1.5 },

    entry: {
      marginBottom: 12,
      paddingLeft: 10,
      borderLeftWidth: 2,
      borderLeftColor: theme.pdf.accentBorder,
    },
    entryHeadRow: { flexDirection: "row", justifyContent: "space-between" },
    entryTitle: { fontSize: 10, fontWeight: 700 },
    entryPeriod: { fontSize: 8, color: "#777" },
    bullet: { fontSize: 9, color: "#555", marginTop: 3, marginLeft: 4 },

    achGrid: { flexDirection: "row", flexWrap: "wrap" },
    achItem: { width: "50%", marginBottom: 10, paddingRight: 8 },
    achTitle: { fontSize: 9.5, fontWeight: 700 },
    achDesc: { fontSize: 8.5, color: "#666", marginTop: 2 },

    // Education switched from a 4-col icon grid to a stacked list so
    // there's room for the (often multi-line) description/subjects text.
    eduList: {},
    eduEntry: {
      marginBottom: 10,
      paddingLeft: 10,
      borderLeftWidth: 2,
      borderLeftColor: theme.pdf.accentBorder,
    },
    eduHeadRow: { flexDirection: "row", justifyContent: "space-between" },
    eduQual: { fontSize: 9.5, fontWeight: 700 },
    eduInst: { fontSize: 8.5, color: "#666", marginTop: 1 },
    eduPeriod: { fontSize: 8, color: "#777" },
    eduDesc: { fontSize: 8.5, color: "#666", marginTop: 4, lineHeight: 1.4 },

    testimonial: {
      fontSize: 9,
      fontStyle: "italic",
      color: "#444",
      marginBottom: 6,
      borderLeftWidth: 2,
      borderLeftColor: theme.pdf.accentBorder,
      paddingLeft: 8,
    },
    closingNote: {
      marginTop: 16,
      fontSize: 9,
      fontStyle: "italic",
      color: theme.pdf.closingNote,
    },
  });
}

export function buildSidebarPhotoPdfDocument(data: PdfLayoutData) {
  const {
    cv,
    theme,
    g,
    testimonials,
    achievements,
    fullName,
    address,
    email,
    phone,
    photoUrl,
  } = data;
  const styles = buildStyles(theme);
  const skills = g?.topSkills ?? [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.row}>
          {/* ---------- Dark sidebar ---------- */}
          <View style={styles.sidebar}>
            {photoUrl && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={photoUrl} style={styles.photo} />
            )}
            <View style={styles.sideSection}>
              <Text style={styles.sideLabel}>Contact</Text>
              {phone && (
                <Link
                  src={`https://wa.me/${toWhatsAppNumber(phone)}`}
                  style={styles.sideLine}
                >
                  {phone}
                </Link>
              )}
              {email && (
                <Link src={`mailto:${email}`} style={styles.sideLine}>
                  {email}
                </Link>
              )}
              {cv.links[0] && (
                <Link src={cv.links[0].url} style={styles.sideLine}>
                  {cv.links[0].label}
                </Link>
              )}
            </View>

            {skills.length > 0 && (
              <View style={styles.sideSection}>
                <Text style={styles.sideLabel}>Expert in</Text>
                <Text style={styles.expertLine}>
                  {skills.slice(0, 3).join(", ")}
                </Text>
              </View>
            )}

            {skills.length > 0 && (
              <View style={styles.sideSection}>
                <Text style={styles.sideLabel}>Skills</Text>
                {skills.map((skill, i) => (
                  <View key={i}>
                    <Text style={styles.skillName}>{skill}</Text>
                    <View style={styles.skillTrack}>
                      <View
                        style={[styles.skillFill, { width: `${85 - i * 8}%` }]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {cv.interests.length > 0 && (
              <View style={styles.sideSection}>
                <Text style={styles.sideLabel}>Interests</Text>
                <View style={styles.interestRow}>
                  {cv.interests.map((interest, i) => (
                    <Text key={i} style={styles.interestPill}>
                      {interest}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* ---------- Content column ---------- */}
          <View style={styles.main}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.headline}>{g?.headline}</Text>
            {address && <Text style={styles.address}>{address}</Text>}

            {g?.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile</Text>
                <Text style={styles.summary}>{g.summary}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {g?.experience?.map((e, i) => (
                <View key={i} style={styles.entry} wrap={false}>
                  <View style={styles.entryHeadRow}>
                    <Text style={styles.entryTitle}>
                      {e.role} — {e.company}
                    </Text>
                    <Text style={styles.entryPeriod}>{e.period}</Text>
                  </View>
                  {e.bullets?.map((b, j) => (
                    <Text key={j} style={styles.bullet}>
                      • {b}
                    </Text>
                  ))}
                </View>
              ))}
            </View>

            {achievements && achievements.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                <View style={styles.achGrid}>
                  {achievements.map((a, i) => (
                    <View key={i} style={styles.achItem}>
                      <Text style={styles.achTitle}>{a.title}</Text>
                      {a.description && (
                        <Text style={styles.achDesc}>{a.description}</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {g?.education && g.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                <View style={styles.eduList}>
                  {g.education.map((ed, i) => (
                    <View key={i} style={styles.eduEntry} wrap={false}>
                      <View style={styles.eduHeadRow}>
                        <Text style={styles.eduQual}>{ed.qualification}</Text>
                        <Text style={styles.eduPeriod}>{ed.period}</Text>
                      </View>
                      <Text style={styles.eduInst}>{ed.institution}</Text>
                      {ed.description && (
                        <Text style={styles.eduDesc}>{ed.description}</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {testimonials && testimonials.length > 0 && (
              <View style={styles.section} wrap={false}>
                <Text style={styles.sectionTitle}>Testimonials</Text>
                {testimonials.map((t, i) => (
                  <Text key={i} style={styles.testimonial}>
                    &quot;{t.text}&quot; — {t.author}
                  </Text>
                ))}
              </View>
            )}

            {g?.closingNote && (
              <Text style={styles.closingNote}>
                &quot;{g.closingNote}&quot;
              </Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
