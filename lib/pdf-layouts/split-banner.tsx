// // lib/pdf-layouts/split-banner.tsx
// //
// // Mirrors components/cv-layouts/split-banner.tsx: full-width colored
// // banner header, then a single flowing column with left-accent blocks.

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

// function buildStyles(theme: PdfLayoutData["theme"]) {
//   return StyleSheet.create({
//     page: { padding: 0, fontSize: 11 },
//     banner: {
//       backgroundColor: theme.pdf.headline,
//       color: "#fff",
//       padding: 32,
//       alignItems: "center",
//       textAlign: "center",
//     },
//     photo: {
//       width: 72,
//       height: 72,
//       borderRadius: 36,
//       marginBottom: 10,
//       objectFit: "cover",
//     },
//     name: { fontSize: 22, fontWeight: 700, color: "#fff" },
//     headline: { fontSize: 11, color: "#fff", opacity: 0.9, marginTop: 3 },
//     contactRow: {
//       flexDirection: "row",
//       flexWrap: "wrap",
//       justifyContent: "center",
//       marginTop: 10,
//     },
//     contactText: {
//       fontSize: 9,
//       color: "#fff",
//       opacity: 0.9,
//       marginHorizontal: 6,
//       marginBottom: 4,
//     },

//     body: { padding: 32 },
//     summary: {
//       fontSize: 10,
//       color: "#444",
//       textAlign: "center",
//       marginBottom: 16,
//       lineHeight: 1.5,
//     },
//     skillsRow: {
//       flexDirection: "row",
//       flexWrap: "wrap",
//       justifyContent: "center",
//       marginBottom: 18,
//     },
//     skillPill: {
//       fontSize: 9,
//       backgroundColor: theme.pdf.pillBg,
//       color: theme.pdf.pillText,
//       paddingVertical: 3,
//       paddingHorizontal: 9,
//       borderRadius: 10,
//       marginRight: 5,
//       marginBottom: 5,
//     },

//     section: { marginTop: 16 },
//     sectionTitle: {
//       fontSize: 13,
//       fontWeight: 700,
//       marginBottom: 8,
//       color: theme.pdf.headline,
//     },
//     entry: {
//       borderLeftWidth: 3,
//       borderLeftColor: theme.pdf.accentBorder,
//       paddingLeft: 10,
//       marginBottom: 10,
//     },
//     entryHeadRow: { flexDirection: "row", justifyContent: "space-between" },
//     entryTitle: { fontSize: 10.5, fontWeight: 700 },
//     entryPeriod: { fontSize: 8.5, color: "#777" },
//     bullet: { fontSize: 9, color: "#555", marginTop: 3, marginLeft: 4 },

//     grid2: { flexDirection: "row", flexWrap: "wrap" },
//     gridCard: {
//       width: "48%",
//       borderWidth: 1,
//       borderColor: theme.pdf.accentBorder,
//       borderRadius: 8,
//       padding: 10,
//       marginRight: "2%",
//       marginBottom: 8,
//     },
//     gridTitle: { fontSize: 9.5, fontWeight: 700 },
//     gridDesc: {
//       fontSize: 8.5,
//       color: "#666",
//       marginTop: 2,
//       fontStyle: "italic",
//     },

//     footerRow: {
//       flexDirection: "row",
//       marginTop: 16,
//       borderTopWidth: 1,
//       borderTopColor: "#E5E5E5",
//       paddingTop: 12,
//     },
//     footerCol: { flex: 1, paddingRight: 12 },
//     footerLabel: {
//       fontSize: 8,
//       textTransform: "uppercase",
//       letterSpacing: 0.5,
//       color: "#888",
//       marginBottom: 4,
//     },
//     footerLine: { fontSize: 9, color: theme.pdf.link, marginBottom: 2 },
//     footerLineMuted: { fontSize: 9, color: "#555", marginBottom: 2 },

//     closingNote: {
//       marginTop: 18,
//       fontSize: 10,
//       fontStyle: "italic",
//       color: theme.pdf.closingNote,
//       textAlign: "center",
//     },
//   });
// }

// export function buildSplitBannerPdfDocument(data: PdfLayoutData) {
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

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.banner}>
//           {photoUrl && (
//             // eslint-disable-next-line jsx-a11y/alt-text
//             <Image src={photoUrl} style={styles.photo} />
//           )}
//           <Text style={styles.name}>{fullName}</Text>
//           <Text style={styles.headline}>{g?.headline}</Text>
//           <View style={styles.contactRow}>
//             {email && (
//               <Link src={`mailto:${email}`} style={styles.contactText}>
//                 {email}
//               </Link>
//             )}
//             {phone && (
//               <Link
//                 src={`https://wa.me/${toWhatsAppNumber(phone)}`}
//                 style={styles.contactText}
//               >
//                 {phone}
//               </Link>
//             )}
//             {address && <Text style={styles.contactText}>{address}</Text>}
//           </View>
//         </View>

//         <View style={styles.body}>
//           {g?.summary && <Text style={styles.summary}>{g.summary}</Text>}

//           {g?.topSkills && g.topSkills.length > 0 && (
//             <View style={styles.skillsRow}>
//               {g.topSkills.map((skill, i) => (
//                 <Text key={i} style={styles.skillPill}>
//                   {skill}
//                 </Text>
//               ))}
//             </View>
//           )}

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Experience</Text>
//             {g?.experience?.map((e, i) => (
//               <View key={i} style={styles.entry} wrap={false}>
//                 <View style={styles.entryHeadRow}>
//                   <Text style={styles.entryTitle}>
//                     {e.role} · {e.company}
//                   </Text>
//                   <Text style={styles.entryPeriod}>{e.period}</Text>
//                 </View>
//                 {e.bullets?.map((b, j) => (
//                   <Text key={j} style={styles.bullet}>
//                     • {b}
//                   </Text>
//                 ))}
//               </View>
//             ))}
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Education</Text>
//             {g?.education?.map((ed, i) => (
//               <View key={i} style={styles.entry} wrap={false}>
//                 <View style={styles.entryHeadRow}>
//                   <Text style={styles.entryTitle}>
//                     {ed.qualification} · {ed.institution}
//                   </Text>
//                   <Text style={styles.entryPeriod}>{ed.period}</Text>
//                 </View>
//               </View>
//             ))}
//           </View>

//           {achievements && achievements.length > 0 && (
//             <View style={styles.section} wrap={false}>
//               <Text style={styles.sectionTitle}>Achievements</Text>
//               <View style={styles.grid2}>
//                 {achievements.map((a, i) => (
//                   <View key={i} style={styles.gridCard}>
//                     <Text style={styles.gridTitle}>{a.title}</Text>
//                     {a.description && (
//                       <Text style={styles.gridDesc}>{a.description}</Text>
//                     )}
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {testimonials && testimonials.length > 0 && (
//             <View style={styles.section} wrap={false}>
//               <Text style={styles.sectionTitle}>Testimonials</Text>
//               <View style={styles.grid2}>
//                 {testimonials.map((t, i) => (
//                   <View key={i} style={styles.gridCard}>
//                     <Text
//                       style={[styles.gridDesc, { fontSize: 9, marginTop: 0 }]}
//                     >
//                       &quot;{t.text}&quot; — {t.author}
//                     </Text>
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {(cv.interests.length > 0 ||
//             cv.links.length > 0 ||
//             cv.references.length > 0) && (
//             <View style={styles.footerRow} wrap={false}>
//               {cv.interests.length > 0 && (
//                 <View style={styles.footerCol}>
//                   <Text style={styles.footerLabel}>Interests</Text>
//                   <Text style={styles.footerLineMuted}>
//                     {cv.interests.join(", ")}
//                   </Text>
//                 </View>
//               )}
//               {cv.links.length > 0 && (
//                 <View style={styles.footerCol}>
//                   <Text style={styles.footerLabel}>Links</Text>
//                   {cv.links.map((l, i) => (
//                     <Link key={i} src={l.url} style={styles.footerLine}>
//                       {l.label}
//                     </Link>
//                   ))}
//                 </View>
//               )}
//               {cv.references.length > 0 && (
//                 <View style={styles.footerCol}>
//                   <Text style={styles.footerLabel}>References</Text>
//                   {cv.references.map((r, i) => (
//                     <Text key={i} style={styles.footerLineMuted}>
//                       {r.name} — {r.contact}
//                     </Text>
//                   ))}
//                 </View>
//               )}
//             </View>
//           )}

//           {g?.closingNote && (
//             <Text style={styles.closingNote}>&quot;{g.closingNote}&quot;</Text>
//           )}
//         </View>
//       </Page>
//     </Document>
//   );
// }
// lib/pdf-layouts/split-banner.tsx
//
// Mirrors components/cv-layouts/split-banner.tsx: full-width colored
// banner header, then a single flowing column with left-accent blocks.

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

function buildStyles(theme: PdfLayoutData["theme"]) {
  return StyleSheet.create({
    page: { padding: 0, fontSize: 11 },
    banner: {
      backgroundColor: theme.pdf.headline,
      color: "#fff",
      padding: 32,
      alignItems: "center",
      textAlign: "center",
    },
    photo: {
      width: 72,
      height: 72,
      borderRadius: 36,
      marginBottom: 10,
      objectFit: "cover",
    },
    name: { fontSize: 22, fontWeight: 700, color: "#fff" },
    headline: { fontSize: 11, color: "#fff", opacity: 0.9, marginTop: 3 },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 10,
    },
    contactText: {
      fontSize: 9,
      color: "#fff",
      opacity: 0.9,
      marginHorizontal: 6,
      marginBottom: 4,
    },

    body: { padding: 32 },
    summary: {
      fontSize: 10,
      color: "#444",
      textAlign: "center",
      marginBottom: 16,
      lineHeight: 1.5,
    },
    skillsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginBottom: 18,
    },
    skillPill: {
      fontSize: 9,
      backgroundColor: theme.pdf.pillBg,
      color: theme.pdf.pillText,
      paddingVertical: 3,
      paddingHorizontal: 9,
      borderRadius: 10,
      marginRight: 5,
      marginBottom: 5,
    },

    section: { marginTop: 16 },
    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 8,
      color: theme.pdf.headline,
    },
    entry: {
      borderLeftWidth: 3,
      borderLeftColor: theme.pdf.accentBorder,
      paddingLeft: 10,
      marginBottom: 10,
    },
    entryHeadRow: { flexDirection: "row", justifyContent: "space-between" },
    entryTitle: { fontSize: 10.5, fontWeight: 700 },
    entryPeriod: { fontSize: 8.5, color: "#777" },
    bullet: { fontSize: 9, color: "#555", marginTop: 3, marginLeft: 4 },
    eduDesc: {
      fontSize: 8.5,
      color: "#666",
      marginTop: 4,
      lineHeight: 1.4,
    },

    grid2: { flexDirection: "row", flexWrap: "wrap" },
    gridCard: {
      width: "48%",
      borderWidth: 1,
      borderColor: theme.pdf.accentBorder,
      borderRadius: 8,
      padding: 10,
      marginRight: "2%",
      marginBottom: 8,
    },
    gridTitle: { fontSize: 9.5, fontWeight: 700 },
    gridDesc: {
      fontSize: 8.5,
      color: "#666",
      marginTop: 2,
      fontStyle: "italic",
    },

    footerRow: {
      flexDirection: "row",
      marginTop: 16,
      borderTopWidth: 1,
      borderTopColor: "#E5E5E5",
      paddingTop: 12,
    },
    footerCol: { flex: 1, paddingRight: 12 },
    footerLabel: {
      fontSize: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      color: "#888",
      marginBottom: 4,
    },
    footerLine: { fontSize: 9, color: theme.pdf.link, marginBottom: 2 },
    footerLineMuted: { fontSize: 9, color: "#555", marginBottom: 2 },

    closingNote: {
      marginTop: 18,
      fontSize: 10,
      fontStyle: "italic",
      color: theme.pdf.closingNote,
      textAlign: "center",
    },
  });
}

export function buildSplitBannerPdfDocument(data: PdfLayoutData) {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.banner}>
          {photoUrl && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={photoUrl} style={styles.photo} />
          )}
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.headline}>{g?.headline}</Text>
          <View style={styles.contactRow}>
            {email && (
              <Link src={`mailto:${email}`} style={styles.contactText}>
                {email}
              </Link>
            )}
            {phone && (
              <Link
                src={`https://wa.me/${toWhatsAppNumber(phone)}`}
                style={styles.contactText}
              >
                {phone}
              </Link>
            )}
            {address && <Text style={styles.contactText}>{address}</Text>}
          </View>
        </View>

        <View style={styles.body}>
          {g?.summary && <Text style={styles.summary}>{g.summary}</Text>}

          {g?.topSkills && g.topSkills.length > 0 && (
            <View style={styles.skillsRow}>
              {g.topSkills.map((skill, i) => (
                <Text key={i} style={styles.skillPill}>
                  {skill}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {g?.experience?.map((e, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <View style={styles.entryHeadRow}>
                  <Text style={styles.entryTitle}>
                    {e.role} · {e.company}
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {g?.education?.map((ed, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <View style={styles.entryHeadRow}>
                  <Text style={styles.entryTitle}>
                    {ed.qualification} · {ed.institution}
                  </Text>
                  <Text style={styles.entryPeriod}>{ed.period}</Text>
                </View>
                {ed.description && (
                  <Text style={styles.eduDesc}>{ed.description}</Text>
                )}
              </View>
            ))}
          </View>

          {achievements && achievements.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <View style={styles.grid2}>
                {achievements.map((a, i) => (
                  <View key={i} style={styles.gridCard}>
                    <Text style={styles.gridTitle}>{a.title}</Text>
                    {a.description && (
                      <Text style={styles.gridDesc}>{a.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {testimonials && testimonials.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Testimonials</Text>
              <View style={styles.grid2}>
                {testimonials.map((t, i) => (
                  <View key={i} style={styles.gridCard}>
                    <Text
                      style={[styles.gridDesc, { fontSize: 9, marginTop: 0 }]}
                    >
                      &quot;{t.text}&quot; — {t.author}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {(cv.interests.length > 0 ||
            cv.links.length > 0 ||
            cv.references.length > 0) && (
            <View style={styles.footerRow} wrap={false}>
              {cv.interests.length > 0 && (
                <View style={styles.footerCol}>
                  <Text style={styles.footerLabel}>Interests</Text>
                  <Text style={styles.footerLineMuted}>
                    {cv.interests.join(", ")}
                  </Text>
                </View>
              )}
              {cv.links.length > 0 && (
                <View style={styles.footerCol}>
                  <Text style={styles.footerLabel}>Links</Text>
                  {cv.links.map((l, i) => (
                    <Link key={i} src={l.url} style={styles.footerLine}>
                      {l.label}
                    </Link>
                  ))}
                </View>
              )}
              {cv.references.length > 0 && (
                <View style={styles.footerCol}>
                  <Text style={styles.footerLabel}>References</Text>
                  {cv.references.map((r, i) => (
                    <Text key={i} style={styles.footerLineMuted}>
                      {r.name} — {r.contact}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {g?.closingNote && (
            <Text style={styles.closingNote}>&quot;{g.closingNote}&quot;</Text>
          )}
        </View>
      </Page>
    </Document>
  );
}
