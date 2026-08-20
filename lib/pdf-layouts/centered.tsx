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

// // Same threshold the web view (CvAnimatedView) uses to decide whether
// // an interest gets a full-width row instead of an inline pill.
// const LONG_INTEREST_THRESHOLD = 40;

// // Rough height estimates (in points) used with minPresenceAhead to push
// // the Interests/Links cards to the next page as a whole when they won't
// // fit in the remaining space. These are deliberately generous rather
// // than exact — overestimating just means the card moves down a touch
// // earlier than strictly necessary, which is harmless; underestimating
// // risks the card splitting mid-entry.
// const CARD_PADDING_AND_TITLE = 24 /* card padding */ + 15; /* title + margin */

// function estimateInterestsPresence(interests: string[]) {
//   // Pills wrap within a ~34%-page-width sidebar column. Assume short
//   // entries average ~2 per row and long entries (full-width) take their
//   // own row. This is intentionally rough — see note above.
//   const longCount = interests.filter(
//     (i) => i.length > LONG_INTEREST_THRESHOLD,
//   ).length;
//   const shortCount = interests.length - longCount;
//   const shortRows = Math.ceil(shortCount / 2);
//   const pillRowHeight = 9 * 1.4 + 8 /* padding */ + 6; /* marginBottom */
//   const longRowHeight =
//     9 * 1.4 * 2 + 12 /* padding */ + 6; /* marginBottom, ~2 lines */
//   return (
//     CARD_PADDING_AND_TITLE +
//     shortRows * pillRowHeight +
//     longCount * longRowHeight
//   );
// }

// function estimateLinksPresence(count: number) {
//   // Each link renders as a wrapping Text (label + optional description)
//   // at fontSize 10 / lineHeight 1.4 with marginBottom 3. Assume ~2 lines
//   // average per entry.
//   const perEntry = 10 * 1.4 * 2 + 3;
//   return CARD_PADDING_AND_TITLE + count * perEntry;
// }

// function buildStyles(theme: PdfLayoutData["theme"]) {
//   return StyleSheet.create({
//     page: { padding: 40, fontSize: 11 },
//     header: { alignItems: "center", textAlign: "center", marginBottom: 8 },
//     photo: {
//       width: 100,
//       height: 100,
//       borderRadius: 50,
//       marginBottom: 12,
//       objectFit: "cover",
//     },
//     name: { fontSize: 22, marginBottom: 2, textAlign: "center" },
//     headline: {
//       fontSize: 12,
//       color: theme.pdf.headline,
//       marginBottom: 6,
//       textAlign: "center",
//     },
//     summary: {
//       marginTop: 2,
//       marginBottom: 10,
//       color: "#444",
//       textAlign: "center",
//     },
//     contactRow: {
//       flexDirection: "row",
//       flexWrap: "wrap",
//       justifyContent: "center",
//       marginBottom: 4,
//     },
//     contactPill: {
//       fontSize: 9,
//       backgroundColor: theme.pdf.pillBg,
//       color: theme.pdf.pillText,
//       paddingVertical: 4,
//       paddingHorizontal: 10,
//       borderRadius: 10,
//       marginRight: 6,
//       marginBottom: 6,
//     },
//     contactPillLink: {
//       fontSize: 9,
//       backgroundColor: theme.pdf.pillBg,
//       color: theme.pdf.pillText,
//       paddingVertical: 4,
//       paddingHorizontal: 10,
//       borderRadius: 10,
//       marginRight: 6,
//       marginBottom: 6,
//       textDecoration: "none",
//     },
//     card: {
//       borderWidth: 1,
//       borderColor: theme.pdf.accentBorder,
//       borderRadius: 8,
//       padding: 12,
//     },
//     section: { marginTop: 14 },
//     sectionTitle: { fontSize: 13, marginBottom: 6 },
//     sectionFlow: { marginTop: 14 },
//     sectionFlowTitleBox: { marginBottom: 8 },
//     sectionFlowTitle: { fontSize: 13 },
//     entryCard: { marginBottom: 10 },
//     bullet: { marginLeft: 10, marginBottom: 2 },
//     educationEntry: {},
//     skillsRow: { flexDirection: "row", flexWrap: "wrap" },
//     skillPill: {
//       fontSize: 9,
//       backgroundColor: theme.pdf.pillBg,
//       color: theme.pdf.pillText,
//       paddingVertical: 3,
//       paddingHorizontal: 8,
//       borderRadius: 10,
//       marginRight: 6,
//       marginBottom: 6,
//     },
//     testimonial: { marginBottom: 8 },
//     testimonialText: { fontStyle: "italic" },
//     testimonialAuthor: { fontSize: 9, color: "#555", marginTop: 2 },
//     referenceLine: { fontSize: 10, marginBottom: 3, color: "#333" },
//     linkLine: {
//       fontSize: 10,
//       marginBottom: 3,
//       color: theme.pdf.link,
//       lineHeight: 1.4,
//     },
//     achievementBlock: { marginBottom: 8 },
//     achievementTitle: { fontSize: 11 },
//     achievementMeta: { fontSize: 9, color: "#555", marginTop: 1 },
//     achievementDesc: { fontSize: 9, color: "#555", marginTop: 1 },
//     // Interests: wrapped pills (short entries) + full-width blocks
//     // (long entries), mirroring the web view's pill/flex-wrap design.
//     interestsRow: { flexDirection: "row", flexWrap: "wrap" },
//     interestPill: {
//       fontSize: 9,
//       color: theme.pdf.pillText,
//       backgroundColor: theme.pdf.pillBg,
//       paddingVertical: 4,
//       paddingHorizontal: 10,
//       borderRadius: 10,
//       marginRight: 6,
//       marginBottom: 6,
//     },
//     interestBlock: {
//       fontSize: 9,
//       color: theme.pdf.pillText,
//       backgroundColor: theme.pdf.pillBg,
//       lineHeight: 1.4,
//       paddingVertical: 6,
//       paddingHorizontal: 10,
//       borderRadius: 8,
//       marginBottom: 6,
//       width: "100%",
//     },
//     closingNote: {
//       marginTop: 20,
//       fontSize: 10,
//       fontStyle: "italic",
//       color: theme.pdf.closingNote,
//       textAlign: "center",
//     },
//     body: { flexDirection: "row", marginTop: 4 },
//     sidebarCol: { width: "34%", paddingRight: 16 },
//     mainCol: { width: "66%" },
//     sidebarSection: { marginBottom: 14 },
//     sidebarSectionTitle: {
//       fontSize: 9,
//       textTransform: "uppercase",
//       letterSpacing: 0.5,
//       color: "#666",
//       marginBottom: 6,
//     },
//   });
// }

// export function buildCenteredPdfDocument(data: PdfLayoutData) {
//   const {
//     cv,
//     theme,
//     g,
//     testimonials,
//     achievements,
//     hasSidebarContent,
//     fullName,
//     idNumber,
//     address,
//     email,
//     phone,
//     photoUrl,
//   } = data;
//   const styles = buildStyles(theme);

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.header}>
//           {photoUrl ? (
//             // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop
//             <Image src={photoUrl} style={styles.photo} />
//           ) : null}
//           <Text style={styles.name}>{fullName}</Text>
//           <Text style={styles.headline}>{g?.headline}</Text>
//           <Text style={styles.summary}>{g?.summary}</Text>
//           <View style={styles.contactRow}>
//             {email && (
//               <Link src={`mailto:${email}`} style={styles.contactPillLink}>
//                 {email}
//               </Link>
//             )}
//             {phone && (
//               <Link
//                 src={`https://wa.me/${toWhatsAppNumber(phone)}`}
//                 style={styles.contactPillLink}
//               >
//                 {phone}
//               </Link>
//             )}
//             {address && <Text style={styles.contactPill}>{address}</Text>}
//             {idNumber && <Text style={styles.contactPill}>ID: {idNumber}</Text>}
//           </View>
//         </View>

//         {g?.topSkills && g.topSkills.length > 0 && (
//           <View style={[styles.section, styles.card]} wrap={false}>
//             <Text style={styles.sectionTitle}>Top skills</Text>
//             <View style={styles.skillsRow}>
//               {g.topSkills.map((skill, i) => (
//                 <Text key={i} style={styles.skillPill}>
//                   {skill}
//                 </Text>
//               ))}
//             </View>
//           </View>
//         )}

//         <View style={styles.body}>
//           {hasSidebarContent && (
//             <View style={styles.sidebarCol}>
//               {cv.interests.length > 0 && (
//                 <View
//                   style={[styles.sidebarSection, styles.card]}
//                   minPresenceAhead={estimateInterestsPresence(cv.interests)}
//                 >
//                   <Text style={styles.sidebarSectionTitle}>Interests</Text>
//                   <View style={styles.interestsRow}>
//                     {cv.interests.map((interest, i) => {
//                       const isLong = interest.length > LONG_INTEREST_THRESHOLD;
//                       return (
//                         <Text
//                           key={i}
//                           style={
//                             isLong ? styles.interestBlock : styles.interestPill
//                           }
//                         >
//                           {interest}
//                         </Text>
//                       );
//                     })}
//                   </View>
//                 </View>
//               )}
//               {cv.links.length > 0 && (
//                 <View
//                   style={[styles.sidebarSection, styles.card]}
//                   minPresenceAhead={estimateLinksPresence(cv.links.length)}
//                 >
//                   <Text style={styles.sidebarSectionTitle}>Links</Text>
//                   {cv.links.map((l, i) => (
//                     <Link key={i} src={l.url} style={styles.linkLine}>
//                       {l.label}
//                       {l.description ? ` — ${l.description}` : ""}
//                     </Link>
//                   ))}
//                 </View>
//               )}
//               {cv.references.length > 0 && (
//                 <View style={[styles.sidebarSection, styles.card]} wrap={false}>
//                   <Text style={styles.sidebarSectionTitle}>References</Text>
//                   {cv.references.map((r, i) => (
//                     <Text key={i} style={styles.referenceLine}>
//                       {r.name}
//                       {r.relationship ? ` (${r.relationship})` : ""} —{" "}
//                       {r.contact}
//                     </Text>
//                   ))}
//                 </View>
//               )}
//             </View>
//           )}

//           <View style={styles.mainCol}>
//             <View style={styles.sectionFlow}>
//               <View
//                 style={[styles.sectionFlowTitleBox, styles.card]}
//                 wrap={false}
//               >
//                 <Text style={styles.sectionFlowTitle}>Experience</Text>
//               </View>
//               {g?.experience?.map((e, i) => (
//                 <View
//                   key={i}
//                   style={[styles.entryCard, styles.card]}
//                   wrap={false}
//                 >
//                   <Text>
//                     {e.role} — {e.company} ({e.period})
//                   </Text>
//                   {e.bullets?.map((b, j) => (
//                     <Text key={j} style={styles.bullet}>
//                       • {b}
//                     </Text>
//                   ))}
//                 </View>
//               ))}
//             </View>

//             <View style={styles.sectionFlow}>
//               <View
//                 style={[styles.sectionFlowTitleBox, styles.card]}
//                 wrap={false}
//               >
//                 <Text style={styles.sectionFlowTitle}>Education</Text>
//               </View>
//               {g?.education?.map((e, i) => (
//                 <View
//                   key={i}
//                   style={[styles.entryCard, styles.card, styles.educationEntry]}
//                   wrap={false}
//                 >
//                   <Text>
//                     ({e.period}) {e.qualification} — {e.institution}
//                   </Text>
//                 </View>
//               ))}
//             </View>

//             {testimonials && testimonials.length > 0 && (
//               <View style={[styles.section, styles.card]} wrap={false}>
//                 <Text style={styles.sectionTitle}>Testimonials</Text>
//                 {testimonials.map((t, i) => (
//                   <View key={i} style={styles.testimonial}>
//                     <Text style={styles.testimonialText}>
//                       &quot;{t.text}&quot;
//                     </Text>
//                     <Text style={styles.testimonialAuthor}>— {t.author}</Text>
//                   </View>
//                 ))}
//               </View>
//             )}

//             {achievements && achievements.length > 0 && (
//               <View style={[styles.section, styles.card]} wrap={false}>
//                 <Text style={styles.sectionTitle}>Achievements</Text>
//                 {achievements.map((a, i) => (
//                   <View key={i} style={styles.achievementBlock}>
//                     <Text style={styles.achievementTitle}>
//                       {a.title}
//                       {"date" in a && a.date ? ` (${a.date})` : ""}
//                     </Text>
//                     {a.description && (
//                       <Text style={styles.achievementDesc}>
//                         {a.description}
//                       </Text>
//                     )}
//                   </View>
//                 ))}
//               </View>
//             )}
//           </View>
//         </View>

//         {g?.closingNote && (
//           <Text style={styles.closingNote}>&quot;{g.closingNote}&quot;</Text>
//         )}
//       </Page>
//     </Document>
//   );
// }

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

// Same threshold the web view (CvAnimatedView) uses to decide whether
// an interest gets a full-width row instead of an inline pill.
const LONG_INTEREST_THRESHOLD = 40;

// Rough height estimates (in points) used with minPresenceAhead to push
// the Interests/Links cards to the next page as a whole when they won't
// fit in the remaining space. These are deliberately generous rather
// than exact — overestimating just means the card moves down a touch
// earlier than strictly necessary, which is harmless; underestimating
// risks the card splitting mid-entry.
const CARD_PADDING_AND_TITLE = 24 /* card padding */ + 15; /* title + margin */

function estimateInterestsPresence(interests: string[]) {
  // Pills wrap within a ~34%-page-width sidebar column. Assume short
  // entries average ~2 per row and long entries (full-width) take their
  // own row. This is intentionally rough — see note above.
  const longCount = interests.filter(
    (i) => i.length > LONG_INTEREST_THRESHOLD,
  ).length;
  const shortCount = interests.length - longCount;
  const shortRows = Math.ceil(shortCount / 2);
  const pillRowHeight = 9 * 1.4 + 8 /* padding */ + 6; /* marginBottom */
  const longRowHeight =
    9 * 1.4 * 2 + 12 /* padding */ + 6; /* marginBottom, ~2 lines */
  return (
    CARD_PADDING_AND_TITLE +
    shortRows * pillRowHeight +
    longCount * longRowHeight
  );
}

function estimateLinksPresence(count: number) {
  // Each link renders as a wrapping Text (label + optional description)
  // at fontSize 10 / lineHeight 1.4 with marginBottom 3. Assume ~2 lines
  // average per entry.
  const perEntry = 10 * 1.4 * 2 + 3;
  return CARD_PADDING_AND_TITLE + count * perEntry;
}

function buildStyles(theme: PdfLayoutData["theme"]) {
  return StyleSheet.create({
    page: { padding: 40, fontSize: 11 },
    header: { alignItems: "center", textAlign: "center", marginBottom: 8 },
    photo: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 12,
      objectFit: "cover",
    },
    name: { fontSize: 22, marginBottom: 2, textAlign: "center" },
    headline: {
      fontSize: 12,
      color: theme.pdf.headline,
      marginBottom: 6,
      textAlign: "center",
    },
    summary: {
      marginTop: 2,
      marginBottom: 10,
      color: "#444",
      textAlign: "center",
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginBottom: 4,
    },
    contactPill: {
      fontSize: 9,
      backgroundColor: theme.pdf.pillBg,
      color: theme.pdf.pillText,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginRight: 6,
      marginBottom: 6,
    },
    contactPillLink: {
      fontSize: 9,
      backgroundColor: theme.pdf.pillBg,
      color: theme.pdf.pillText,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginRight: 6,
      marginBottom: 6,
      textDecoration: "none",
    },
    card: {
      borderWidth: 1,
      borderColor: theme.pdf.accentBorder,
      borderRadius: 8,
      padding: 12,
    },
    section: { marginTop: 14 },
    sectionTitle: { fontSize: 13, marginBottom: 6 },
    sectionFlow: { marginTop: 14 },
    sectionFlowTitleBox: { marginBottom: 8 },
    sectionFlowTitle: { fontSize: 13 },
    entryCard: { marginBottom: 10 },
    bullet: { marginLeft: 10, marginBottom: 2 },
    educationEntry: {},
    educationDesc: {
      fontSize: 9,
      color: "#555",
      marginTop: 4,
      lineHeight: 1.4,
    },
    skillsRow: { flexDirection: "row", flexWrap: "wrap" },
    skillPill: {
      fontSize: 9,
      backgroundColor: theme.pdf.pillBg,
      color: theme.pdf.pillText,
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: 10,
      marginRight: 6,
      marginBottom: 6,
    },
    testimonial: { marginBottom: 8 },
    testimonialText: { fontStyle: "italic" },
    testimonialAuthor: { fontSize: 9, color: "#555", marginTop: 2 },
    referenceLine: { fontSize: 10, marginBottom: 3, color: "#333" },
    linkLine: {
      fontSize: 10,
      marginBottom: 3,
      color: theme.pdf.link,
      lineHeight: 1.4,
    },
    achievementBlock: { marginBottom: 8 },
    achievementTitle: { fontSize: 11 },
    achievementMeta: { fontSize: 9, color: "#555", marginTop: 1 },
    achievementDesc: { fontSize: 9, color: "#555", marginTop: 1 },
    // Interests: wrapped pills (short entries) + full-width blocks
    // (long entries), mirroring the web view's pill/flex-wrap design.
    interestsRow: { flexDirection: "row", flexWrap: "wrap" },
    interestPill: {
      fontSize: 9,
      color: theme.pdf.pillText,
      backgroundColor: theme.pdf.pillBg,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginRight: 6,
      marginBottom: 6,
    },
    interestBlock: {
      fontSize: 9,
      color: theme.pdf.pillText,
      backgroundColor: theme.pdf.pillBg,
      lineHeight: 1.4,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      marginBottom: 6,
      width: "100%",
    },
    closingNote: {
      marginTop: 20,
      fontSize: 10,
      fontStyle: "italic",
      color: theme.pdf.closingNote,
      textAlign: "center",
    },
    body: { flexDirection: "row", marginTop: 4 },
    sidebarCol: { width: "34%", paddingRight: 16 },
    mainCol: { width: "66%" },
    sidebarSection: { marginBottom: 14 },
    sidebarSectionTitle: {
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      color: "#666",
      marginBottom: 6,
    },
  });
}

export function buildCenteredPdfDocument(data: PdfLayoutData) {
  const {
    cv,
    theme,
    g,
    testimonials,
    achievements,
    hasSidebarContent,
    fullName,
    idNumber,
    address,
    email,
    phone,
    photoUrl,
  } = data;
  const styles = buildStyles(theme);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {photoUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop
            <Image src={photoUrl} style={styles.photo} />
          ) : null}
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.headline}>{g?.headline}</Text>
          <Text style={styles.summary}>{g?.summary}</Text>
          <View style={styles.contactRow}>
            {email && (
              <Link src={`mailto:${email}`} style={styles.contactPillLink}>
                {email}
              </Link>
            )}
            {phone && (
              <Link
                src={`https://wa.me/${toWhatsAppNumber(phone)}`}
                style={styles.contactPillLink}
              >
                {phone}
              </Link>
            )}
            {address && <Text style={styles.contactPill}>{address}</Text>}
            {idNumber && <Text style={styles.contactPill}>ID: {idNumber}</Text>}
          </View>
        </View>

        {g?.topSkills && g.topSkills.length > 0 && (
          <View style={[styles.section, styles.card]} wrap={false}>
            <Text style={styles.sectionTitle}>Top skills</Text>
            <View style={styles.skillsRow}>
              {g.topSkills.map((skill, i) => (
                <Text key={i} style={styles.skillPill}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        <View style={styles.body}>
          {hasSidebarContent && (
            <View style={styles.sidebarCol}>
              {cv.interests.length > 0 && (
                <View
                  style={[styles.sidebarSection, styles.card]}
                  minPresenceAhead={estimateInterestsPresence(cv.interests)}
                >
                  <Text style={styles.sidebarSectionTitle}>Interests</Text>
                  <View style={styles.interestsRow}>
                    {cv.interests.map((interest, i) => {
                      const isLong = interest.length > LONG_INTEREST_THRESHOLD;
                      return (
                        <Text
                          key={i}
                          style={
                            isLong ? styles.interestBlock : styles.interestPill
                          }
                        >
                          {interest}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              )}
              {cv.links.length > 0 && (
                <View
                  style={[styles.sidebarSection, styles.card]}
                  minPresenceAhead={estimateLinksPresence(cv.links.length)}
                >
                  <Text style={styles.sidebarSectionTitle}>Links</Text>
                  {cv.links.map((l, i) => (
                    <Link key={i} src={l.url} style={styles.linkLine}>
                      {l.label}
                      {l.description ? ` — ${l.description}` : ""}
                    </Link>
                  ))}
                </View>
              )}
              {cv.references.length > 0 && (
                <View style={[styles.sidebarSection, styles.card]} wrap={false}>
                  <Text style={styles.sidebarSectionTitle}>References</Text>
                  {cv.references.map((r, i) => (
                    <Text key={i} style={styles.referenceLine}>
                      {r.name}
                      {r.relationship ? ` (${r.relationship})` : ""} —{" "}
                      {r.contact}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={styles.mainCol}>
            <View style={styles.sectionFlow}>
              <View
                style={[styles.sectionFlowTitleBox, styles.card]}
                wrap={false}
              >
                <Text style={styles.sectionFlowTitle}>Experience</Text>
              </View>
              {g?.experience?.map((e, i) => (
                <View
                  key={i}
                  style={[styles.entryCard, styles.card]}
                  wrap={false}
                >
                  <Text>
                    {e.role} — {e.company} ({e.period})
                  </Text>
                  {e.bullets?.map((b, j) => (
                    <Text key={j} style={styles.bullet}>
                      • {b}
                    </Text>
                  ))}
                </View>
              ))}
            </View>

            <View style={styles.sectionFlow}>
              <View
                style={[styles.sectionFlowTitleBox, styles.card]}
                wrap={false}
              >
                <Text style={styles.sectionFlowTitle}>Education</Text>
              </View>
              {g?.education?.map((e, i) => (
                <View
                  key={i}
                  style={[styles.entryCard, styles.card, styles.educationEntry]}
                  wrap={false}
                >
                  <Text>
                    ({e.period}) {e.qualification} — {e.institution}
                  </Text>
                  {e.description && (
                    <Text style={styles.educationDesc}>{e.description}</Text>
                  )}
                </View>
              ))}
            </View>

            {testimonials && testimonials.length > 0 && (
              <View style={[styles.section, styles.card]} wrap={false}>
                <Text style={styles.sectionTitle}>Testimonials</Text>
                {testimonials.map((t, i) => (
                  <View key={i} style={styles.testimonial}>
                    <Text style={styles.testimonialText}>
                      &quot;{t.text}&quot;
                    </Text>
                    <Text style={styles.testimonialAuthor}>— {t.author}</Text>
                  </View>
                ))}
              </View>
            )}

            {achievements && achievements.length > 0 && (
              <View style={[styles.section, styles.card]} wrap={false}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                {achievements.map((a, i) => (
                  <View key={i} style={styles.achievementBlock}>
                    <Text style={styles.achievementTitle}>
                      {a.title}
                      {"date" in a && a.date ? ` (${a.date})` : ""}
                    </Text>
                    {a.description && (
                      <Text style={styles.achievementDesc}>
                        {a.description}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {g?.closingNote && (
          <Text style={styles.closingNote}>&quot;{g.closingNote}&quot;</Text>
        )}
      </Page>
    </Document>
  );
}
