// // lib/pdf-layouts/graph-stats.tsx
// //
// // Mirrors components/cv-layouts/graph-stats.tsx for print. @react-pdf/
// // renderer can't run recharts or CSS animation, so both "charts" here
// // are static bar lists sized by percentage — same computeSkillSignals()
// // / computeExperienceDepth() data the web version's Bar/Radar charts
// // use, just drawn with boxes instead of SVG.
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
// import {
//   computeSkillSignals,
//   computeExperienceDepth,
// } from "@/lib/skill-signal";

// function buildStyles(theme: PdfLayoutData["theme"]) {
//   return StyleSheet.create({
//     page: { padding: 44, fontSize: 10.5 },
//     headRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "flex-start",
//     },
//     headTextCol: { flex: 1, paddingRight: 16 },
//     photo: { width: 72, height: 72, borderRadius: 36, objectFit: "cover" },
//     name: { fontSize: 18, fontWeight: 700 },
//     headline: { fontSize: 10.5, color: theme.pdf.headline, marginTop: 2 },
//     contactRow: {
//       flexDirection: "row",
//       flexWrap: "wrap",
//       alignItems: "center",
//       marginTop: 6,
//     },
//     contactLink: { fontSize: 9, color: theme.pdf.link, textDecoration: "none" },
//     contactText: { fontSize: 9, color: "#555" },
//     contactSep: { fontSize: 9, color: "#999", marginHorizontal: 5 },
//     summary: { fontSize: 9.5, color: "#444", marginTop: 12, lineHeight: 1.5 },
//     section: { marginTop: 16 },
//     sectionTitle: {
//       fontSize: 9.5,
//       fontWeight: 700,
//       textTransform: "uppercase",
//       letterSpacing: 0.5,
//       borderBottomWidth: 1,
//       borderBottomColor: theme.pdf.accentBorder,
//       paddingBottom: 4,
//       marginBottom: 8,
//     },
//     skillRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
//     skillLabel: { fontSize: 8.5, width: 90 },
//     skillTrack: {
//       flex: 1,
//       height: 6,
//       borderRadius: 3,
//       backgroundColor: "#eee",
//       overflow: "hidden",
//     },
//     skillFill: {
//       height: 6,
//       borderRadius: 3,
//       backgroundColor: theme.pdf.accentBorder,
//     },
//     entry: { marginBottom: 8 },
//     entryHeadRow: { flexDirection: "row", justifyContent: "space-between" },
//     entryTitle: { fontSize: 9.5, fontWeight: 700 },
//     entryPeriod: { fontSize: 8.5, color: "#777" },
//     bullet: { fontSize: 9, color: "#444", marginTop: 2, lineHeight: 1.4 },
//     testimonial: {
//       fontSize: 9,
//       fontStyle: "italic",
//       color: "#555",
//       marginBottom: 4,
//     },
//     lineText: { fontSize: 9.5 },
//     listItem: { fontSize: 9, color: "#555", marginBottom: 3 },
//     closingNote: {
//       fontSize: 9.5,
//       color: theme.pdf.closingNote,
//       marginTop: 18,
//       textAlign: "center",
//     },
//   });
// }

// export function buildGraphStatsPdfDocument(data: PdfLayoutData) {
//   const {
//     cv,
//     theme,
//     g,
//     testimonials,
//     fullName,
//     email,
//     phone,
//     address,
//     idNumber,
//     photoUrl,
//   } = data;
//   const styles = buildStyles(theme);
//   const skillSignals = computeSkillSignals(g).slice(0, 8); // keep the printed page tidy
//   const experienceDepth = computeExperienceDepth(g);
//   const maxBullets = Math.max(...experienceDepth.map((e) => e.bullets), 1);

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.headRow}>
//           <View style={styles.headTextCol}>
//             <Text style={styles.name}>{fullName}</Text>
//             {g?.headline && <Text style={styles.headline}>{g.headline}</Text>}
//             <View style={styles.contactRow}>
//               {email && (
//                 <Link src={`mailto:${email}`} style={styles.contactLink}>
//                   {email}
//                 </Link>
//               )}
//               {phone && (
//                 <>
//                   <Text style={styles.contactSep}>·</Text>
//                   <Link
//                     src={`https://wa.me/${toWhatsAppNumber(phone)}`}
//                     style={styles.contactLink}
//                   >
//                     {phone}
//                   </Link>
//                 </>
//               )}
//               {address && (
//                 <>
//                   <Text style={styles.contactSep}>·</Text>
//                   <Text style={styles.contactText}>{address}</Text>
//                 </>
//               )}
//               {idNumber && (
//                 <>
//                   <Text style={styles.contactSep}>·</Text>
//                   <Text style={styles.contactText}>{idNumber}</Text>
//                 </>
//               )}
//             </View>
//           </View>
//           {photoUrl && <Image src={photoUrl} style={styles.photo} />}
//         </View>

//         {g?.summary && <Text style={styles.summary}>{g.summary}</Text>}

//         {skillSignals.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Skill signal</Text>
//             {skillSignals.map((s) => (
//               <View key={s.skill} style={styles.skillRow}>
//                 <Text style={styles.skillLabel}>{s.skill}</Text>
//                 <View style={styles.skillTrack}>
//                   <View style={[styles.skillFill, { width: `${s.score}%` }]} />
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* Static stand-in for the web version's Radar chart — react-pdf
//             can't run recharts, so this uses the same bar treatment as
//             Skill signal above, scaled to the deepest role's bullet count. */}
//         {experienceDepth.length > 1 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Experience depth</Text>
//             {experienceDepth.map((e, i) => (
//               <View key={`${e.label}-${i}`} style={styles.skillRow}>
//                 <Text style={styles.skillLabel}>{e.label}</Text>
//                 <View style={styles.skillTrack}>
//                   <View
//                     style={[
//                       styles.skillFill,
//                       { width: `${(e.bullets / maxBullets) * 100}%` },
//                     ]}
//                   />
//                 </View>
//               </View>
//             ))}
//           </View>
//         )}

//         {g && g.experience.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Experience</Text>
//             {g.experience.map((entry, i) => (
//               <View key={i} style={styles.entry}>
//                 <View style={styles.entryHeadRow}>
//                   <Text style={styles.entryTitle}>
//                     {entry.role} · {entry.company}
//                   </Text>
//                   <Text style={styles.entryPeriod}>{entry.period}</Text>
//                 </View>
//                 {entry.bullets.map((b, bi) => (
//                   <Text key={bi} style={styles.bullet}>
//                     • {b}
//                   </Text>
//                 ))}
//               </View>
//             ))}
//           </View>
//         )}

//         {g && g.education.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Education</Text>
//             {g.education.map((ed, i) => (
//               <View key={i} style={styles.entry}>
//                 <View style={styles.entryHeadRow}>
//                   <Text style={styles.entryTitle}>{ed.qualification}</Text>
//                   <Text style={styles.entryPeriod}>{ed.period}</Text>
//                 </View>
//                 <Text style={styles.bullet}>{ed.institution}</Text>
//               </View>
//             ))}
//           </View>
//         )}

//         {testimonials && testimonials.length > 0 && (
//           <View style={styles.section} wrap={false}>
//             <Text style={styles.sectionTitle}>Testimonials</Text>
//             {testimonials.map((t, i) => (
//               <Text key={i} style={styles.testimonial}>
//                 &quot;{t.text}&quot; — {t.author}
//               </Text>
//             ))}
//           </View>
//         )}

//         {(cv.links.length > 0 || cv.references.length > 0) && (
//           <View style={styles.section} wrap={false}>
//             {cv.links.length > 0 && (
//               <View style={{ marginBottom: 8 }}>
//                 <Text style={styles.sectionTitle}>Links</Text>
//                 {cv.links.map((l, i) => (
//                   <Link
//                     key={i}
//                     src={l.url}
//                     style={[
//                       styles.lineText,
//                       { color: theme.pdf.link, marginBottom: 2 },
//                     ]}
//                   >
//                     {l.label}
//                   </Link>
//                 ))}
//               </View>
//             )}
//             {cv.references.length > 0 && (
//               <View>
//                 <Text style={styles.sectionTitle}>References</Text>
//                 {cv.references.map((r, i) => (
//                   <Text key={i} style={styles.listItem}>
//                     {r.name}
//                     {r.relationship ? ` (${r.relationship})` : ""} — {r.contact}
//                   </Text>
//                 ))}
//               </View>
//             )}
//           </View>
//         )}

//         {g?.closingNote && (
//           <Text style={styles.closingNote}>{g.closingNote}</Text>
//         )}
//       </Page>
//     </Document>
//   );
// }

// lib/pdf-layouts/graph-stats.tsx
//
// Mirrors components/cv-layouts/graph-stats.tsx for print. @react-pdf/
// renderer can't run recharts or CSS animation, and it has no blur/
// filter support, so "animated glowing dial" becomes "static gradient
// dial with a soft translucent halo ring standing in for the glow" —
// same computeSkillSignals() / computeExperienceDepth() data the web
// version's dials and radar chart use, just drawn with react-pdf's SVG
// primitives (Svg/Circle/Defs/LinearGradient) instead of flat gray
// boxes, so the PDF and the web view now read as the same design.
import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  StyleSheet,
  Svg,
  Circle,
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from "@react-pdf/renderer";
import type { PdfLayoutData } from "./types";
import { toWhatsAppNumber } from "./types";
import {
  computeSkillSignals,
  computeExperienceDepth,
} from "@/lib/skill-signal";
import { getChartPalette } from "@/lib/chart-theme";

/* ---------------------------------------------------------------------- */
/* Small shared helpers                                                   */
/* ---------------------------------------------------------------------- */

// Mirrors the label bands used in the web tooltip (graph-stats.tsx) so the
// PDF prints the same plain-language read on a score instead of a bare
// number — since a static PDF has no hover state to reveal this on demand.
function signalLabel(score: number) {
  if (score >= 80) return "Very strong signal";
  if (score >= 60) return "Strong signal";
  if (score >= 40) return "Moderate signal";
  if (score >= 20) return "Light signal";
  return "Minimal signal";
}

// #rrggbb -> rgba(r,g,b,alpha). Falls back to a flat neutral if the input
// isn't a plain hex color (e.g. it's already an rgb()/hsl() string from the
// theme), so a themed panel tint never throws on an unexpected format.
function hexToRgba(hex: string, alpha: number) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return `rgba(0,0,0,${alpha})`;
  const int = parseInt(match[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// Well-known polar-to-cartesian / arc-description pair for drawing a
// circular progress ring as an SVG arc `Path`. This sidesteps
// `strokeDashoffset`, which @react-pdf/renderer's `Circle` type doesn't
// expose (even though the dasharray trick is what the web version uses via
// real browser SVG, react-pdf's types don't support it) — an explicit arc
// path is the reliable way to draw a partial ring here.
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function buildStyles(theme: PdfLayoutData["theme"]) {
  return StyleSheet.create({
    page: { padding: 44, fontSize: 10.5 },
    headRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    headTextCol: { flex: 1, paddingRight: 16 },
    photo: { width: 72, height: 72, borderRadius: 36, objectFit: "cover" },
    name: { fontSize: 18, fontWeight: 700 },
    headline: { fontSize: 10.5, color: theme.pdf.headline, marginTop: 2 },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      marginTop: 6,
    },
    contactLink: { fontSize: 9, color: theme.pdf.link, textDecoration: "none" },
    contactText: { fontSize: 9, color: "#555" },
    contactSep: { fontSize: 9, color: "#999", marginHorizontal: 5 },
    summary: { fontSize: 9.5, color: "#444", marginTop: 12, lineHeight: 1.5 },

    section: { marginTop: 16 },
    // Clean panel card: a faint, theme-tinted background box with a themed
    // border, echoing the web version's glass-panel cards without needing
    // a dedicated (and previously nonexistent) theme.pdf.panelTint field.
    panel: {
      marginTop: 16,
      padding: 14,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.pdf.accentBorder,
    },
    sectionTitle: {
      fontSize: 9.5,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      color: theme.pdf.headline,
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 8,
      color: "#777",
      marginBottom: 10,
    },

    // Dial grid (Skill signal)
    dialGrid: { flexDirection: "row", flexWrap: "wrap" },
    dialCell: {
      width: "25%",
      alignItems: "center",
      marginBottom: 14,
    },
    dialWrap: { position: "relative", width: 62, height: 62 },
    dialScore: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 62,
      height: 62,
      textAlign: "center",
      paddingTop: 21,
      fontSize: 11,
      fontWeight: 700,
      color: "#222",
    },
    dialLabel: {
      fontSize: 7.5,
      color: "#555",
      textAlign: "center",
      marginTop: 4,
      width: 74,
    },
    dialSublabel: {
      fontSize: 6.5,
      color: "#999",
      textAlign: "center",
      width: 74,
    },

    // Gradient bars (Experience depth)
    barRow: { flexDirection: "row", alignItems: "center", marginBottom: 9 },
    barLabel: { fontSize: 8.5, width: 96 },
    barValue: { fontSize: 8, color: "#777", width: 70, textAlign: "right" },

    entry: { marginBottom: 8 },
    entryHeadRow: { flexDirection: "row", justifyContent: "space-between" },
    entryTitle: { fontSize: 9.5, fontWeight: 700 },
    entryPeriod: { fontSize: 8.5, color: "#777" },
    bullet: { fontSize: 9, color: "#444", marginTop: 2, lineHeight: 1.4 },
    testimonial: {
      fontSize: 9,
      fontStyle: "italic",
      color: "#555",
      marginBottom: 4,
    },
    lineText: { fontSize: 9.5 },
    listItem: { fontSize: 9, color: "#555", marginBottom: 3 },
    closingNote: {
      fontSize: 9.5,
      color: theme.pdf.closingNote,
      marginTop: 18,
      textAlign: "center",
    },
  });
}

/** A gradient-filled radial gauge, drawn as an explicit arc `Path` (see
 *  describeArc above) rather than a dasharray/dashoffset `Circle`, since
 *  react-pdf's `Circle` type doesn't support `strokeDashoffset`. */
function SkillDialPdf({
  score,
  primary,
  secondary,
  gradientId,
}: {
  score: number;
  primary: string;
  secondary: string;
  gradientId: string;
}) {
  const size = 62;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const center = size / 2;

  // Clamp so a 0 score draws nothing and a 100 score doesn't degenerate
  // into a zero-length arc (start === end at exactly 360°).
  const clamped = Math.max(0, Math.min(100, score));
  const fillAngle = (clamped / 100) * 359.99;
  const arcPath =
    fillAngle > 0 ? describeArc(center, center, radius, 0, fillAngle) : null;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={primary} />
          <Stop offset="1" stopColor={secondary} />
        </LinearGradient>
      </Defs>

      {/* Track */}
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke="#e9e9ee"
        strokeWidth={stroke}
        fill="none"
      />

      {arcPath && (
        <>
          {/* Faux glow: wider, faint duplicate underneath the crisp arc */}
          <Path
            d={arcPath}
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke + 3}
            strokeLinecap="round"
            fill="none"
            opacity={0.25}
          />
          {/* Crisp gradient fill */}
          <Path
            d={arcPath}
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
    </Svg>
  );
}

/** A rounded, gradient-filled progress bar (used for Experience depth).
 *  Draws a real track + fill Rect — the previous version created an Svg
 *  with only a zero-radius Circle in it, so no bar was ever visible. */
function GradientBarPdf({
  pct,
  primary,
  secondary,
  gradientId,
  width = 220,
  height = 8,
}: {
  pct: number; // 0-1
  primary: string;
  secondary: string;
  gradientId: string;
  width?: number;
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(1, pct));
  const filledWidth = Math.max(clamped * width, clamped > 0 ? height : 0); // keep a visible nub for tiny nonzero values
  const radius = height / 2;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={primary} />
          <Stop offset="1" stopColor={secondary} />
        </LinearGradient>
      </Defs>
      {/* Track */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill="#eceef2"
      />
      {/* Fill */}
      {filledWidth > 0 && (
        <Rect
          x={0}
          y={0}
          width={filledWidth}
          height={height}
          rx={radius}
          ry={radius}
          fill={`url(#${gradientId})`}
        />
      )}
    </Svg>
  );
}

export function buildGraphStatsPdfDocument(data: PdfLayoutData) {
  const {
    cv,
    theme,
    g,
    testimonials,
    fullName,
    email,
    phone,
    address,
    idNumber,
    photoUrl,
  } = data;
  const styles = buildStyles(theme);
  const palette = getChartPalette(theme);
  const skillSignals = computeSkillSignals(g).slice(0, 8); // keep the printed page tidy
  const experienceDepth = computeExperienceDepth(g);
  const maxBullets = Math.max(...experienceDepth.map((e) => e.bullets), 1);
  const barWidth = 220;
  const panelTint = hexToRgba(palette.primary, 0.04);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headRow}>
          <View style={styles.headTextCol}>
            <Text style={styles.name}>{fullName}</Text>
            {g?.headline && <Text style={styles.headline}>{g.headline}</Text>}
            <View style={styles.contactRow}>
              {email && (
                <Link src={`mailto:${email}`} style={styles.contactLink}>
                  {email}
                </Link>
              )}
              {phone && (
                <>
                  <Text style={styles.contactSep}>·</Text>
                  <Link
                    src={`https://wa.me/${toWhatsAppNumber(phone)}`}
                    style={styles.contactLink}
                  >
                    {phone}
                  </Link>
                </>
              )}
              {address && (
                <>
                  <Text style={styles.contactSep}>·</Text>
                  <Text style={styles.contactText}>{address}</Text>
                </>
              )}
              {idNumber && (
                <>
                  <Text style={styles.contactSep}>·</Text>
                  <Text style={styles.contactText}>{idNumber}</Text>
                </>
              )}
            </View>
          </View>
          {photoUrl && <Image src={photoUrl} style={styles.photo} />}
        </View>

        {g?.summary && <Text style={styles.summary}>{g.summary}</Text>}

        {/* ---------- Skill signal — gradient dial grid ---------- */}
        {skillSignals.length > 0 && (
          <View
            style={[styles.panel, { backgroundColor: panelTint }]}
            wrap={false}
          >
            <Text style={styles.sectionTitle}>Skill signal</Text>
            <Text style={styles.sectionSubtitle}>
              How strongly each top skill shows up across the summary and
              experience.
            </Text>
            <View style={styles.dialGrid}>
              {skillSignals.map((s, i) => (
                <View key={s.skill} style={styles.dialCell}>
                  <View style={styles.dialWrap}>
                    <SkillDialPdf
                      score={s.score}
                      primary={palette.primary}
                      secondary={palette.secondary}
                      gradientId={`dial-grad-${i}`}
                    />
                    <Text style={styles.dialScore}>{s.score}</Text>
                  </View>
                  <Text style={styles.dialLabel}>{s.skill}</Text>
                  {/* Printed in place of the web version's hover tooltip,
                      since a static PDF has no hover state. */}
                  <Text style={styles.dialSublabel}>
                    {signalLabel(s.score)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ---------- Experience depth — gradient bars, stand-in for the
             web version's Radar chart (react-pdf can't run recharts). ---------- */}
        {experienceDepth.length > 1 && (
          <View
            style={[styles.panel, { backgroundColor: panelTint }]}
            wrap={false}
          >
            <Text style={styles.sectionTitle}>Experience depth</Text>
            <Text style={styles.sectionSubtitle}>
              Number of tailored highlights the AI wrote for each role.
            </Text>
            {experienceDepth.map((e, i) => (
              <View key={`${e.label}-${i}`} style={styles.barRow}>
                <Text style={styles.barLabel}>{e.label}</Text>
                <GradientBarPdf
                  pct={e.bullets / maxBullets}
                  primary={palette.primary}
                  secondary={palette.secondary}
                  gradientId={`bar-grad-${i}`}
                  width={barWidth}
                />
                {/* Printed value, same info the web tooltip shows on hover */}
                <Text style={styles.barValue}>
                  {e.bullets} highlight{e.bullets === 1 ? "" : "s"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {g && g.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {g.experience.map((entry, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.entryHeadRow}>
                  <Text style={styles.entryTitle}>
                    {entry.role} · {entry.company}
                  </Text>
                  <Text style={styles.entryPeriod}>{entry.period}</Text>
                </View>
                {entry.bullets.map((b, bi) => (
                  <Text key={bi} style={styles.bullet}>
                    • {b}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {g && g.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {g.education.map((ed, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.entryHeadRow}>
                  <Text style={styles.entryTitle}>{ed.qualification}</Text>
                  <Text style={styles.entryPeriod}>{ed.period}</Text>
                </View>
                <Text style={styles.bullet}>{ed.institution}</Text>
              </View>
            ))}
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

        {(cv.links.length > 0 || cv.references.length > 0) && (
          <View style={styles.section} wrap={false}>
            {cv.links.length > 0 && (
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.sectionTitle}>Links</Text>
                {cv.links.map((l, i) => (
                  <Link
                    key={i}
                    src={l.url}
                    style={[
                      styles.lineText,
                      { color: theme.pdf.link, marginBottom: 2 },
                    ]}
                  >
                    {l.label}
                  </Link>
                ))}
              </View>
            )}
            {cv.references.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>References</Text>
                {cv.references.map((r, i) => (
                  <Text key={i} style={styles.listItem}>
                    {r.name}
                    {r.relationship ? ` (${r.relationship})` : ""} — {r.contact}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {g?.closingNote && (
          <Text style={styles.closingNote}>{g.closingNote}</Text>
        )}
      </Page>
    </Document>
  );
}
