// lib/pdf-layouts/cover-banner.tsx
//
// Fills the TODO in lib/pdf-layouts/index.ts -- "cover-banner" was
// falling back to buildExecutiveFirstPdfDocument because this file
// didn't exist yet.
//
// Mirrors components/plan-layouts/cover-banner.tsx for print: a solid
// full-bleed accent-colored banner (logo, name, tagline, contact row,
// viability pill) up top -- same idea as the web version's colored
// rounded-2xl hero, just edge-to-edge since a PDF page has no
// max-w-4xl mx-auto to sit inside of -- followed by a flowing single
// column: KPI strip, viability detail, then left-accent-bordered
// narrative sections in plan order, same as the web layout's
// border-l-4 section blocks. Same data source (lib/plan-data.ts's
// preparePlanData()) as every other layout.
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
import { money, pct } from "@/lib/plan-data";

const NARRATIVE_SECTIONS: {
  title: string;
  key: keyof PdfLayoutData["g"];
}[] = [
  { title: "Executive Summary", key: "executiveSummary" },
  { title: "Company Overview", key: "companyOverview" },
  { title: "Products & Services", key: "productsAndServices" },
  { title: "Market Analysis", key: "marketAnalysis" },
  { title: "Marketing & Sales Plan", key: "marketingAndSalesPlan" },
  { title: "Operations Plan", key: "operationsPlan" },
  { title: "Management & Organization", key: "managementAndOrganization" },
  { title: "Funding Request", key: "fundingRequest" },
  { title: "Financial Plan", key: "financialPlanNarrative" },
  { title: "Appendix", key: "appendixNotes" },
];

function buildStyles(theme: PdfLayoutData["theme"]) {
  return StyleSheet.create({
    page: { padding: 0, fontSize: 10.5 },

    // -------- Full-bleed banner --------
    banner: {
      backgroundColor: theme.pdf.accentBorder,
      paddingVertical: 32,
      paddingHorizontal: 44,
      alignItems: "center",
      textAlign: "center",
    },
    logo: {
      width: 56,
      height: 56,
      borderRadius: 28,
      objectFit: "cover",
      marginBottom: 10,
    },
    name: { fontSize: 22, fontWeight: 700, color: "#FFFFFF" },
    tagline: { fontSize: 10.5, color: "#FFFFFF", opacity: 0.9, marginTop: 3 },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 10,
    },
    contactLink: {
      fontSize: 9,
      color: "#FFFFFF",
      textDecoration: "none",
      marginHorizontal: 5,
      marginTop: 4,
    },
    contactText: {
      fontSize: 9,
      color: "#FFFFFF",
      opacity: 0.9,
      marginHorizontal: 5,
      marginTop: 4,
    },
    viabilityPill: {
      fontSize: 9.5,
      color: "#FFFFFF",
      backgroundColor: "rgba(255,255,255,0.18)",
      borderRadius: 10,
      paddingVertical: 4,
      paddingHorizontal: 10,
      marginTop: 10,
    },

    // -------- Body --------
    body: { paddingHorizontal: 44, paddingTop: 26, paddingBottom: 44 },

    // -------- KPI strip (4 cells, centered) --------
    kpiGrid: { flexDirection: "row", justifyContent: "center" },
    kpiCell: { width: "25%", alignItems: "center" },
    kpiLabel: { fontSize: 8, color: "#777" },
    kpiValue: {
      fontSize: 13,
      fontWeight: 700,
      marginTop: 3,
      color: theme.pdf.headline,
    },

    // -------- Viability detail --------
    noteSection: { marginTop: 20 },
    sectionTitle: {
      fontSize: 9.5,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      color: theme.pdf.headline,
      marginBottom: 8,
    },
    noteHeading: {
      fontSize: 8.5,
      fontWeight: 700,
      color: "#666",
      marginTop: 6,
      marginBottom: 4,
    },
    noteRow: { flexDirection: "row", marginBottom: 4 },
    noteBullet: { fontSize: 9, color: "#999", marginRight: 5 },
    noteText: { fontSize: 9, color: "#444", lineHeight: 1.4, flex: 1 },

    // -------- Narrative (left-accent-bordered sections) --------
    section: {
      marginTop: 18,
      paddingLeft: 12,
      borderLeftWidth: 3,
      borderLeftColor: theme.pdf.accentBorder,
    },
    narrativeTitle: {
      fontSize: 11,
      fontWeight: 700,
      color: theme.pdf.headline,
      marginBottom: 5,
    },
    narrativeBody: { fontSize: 9.5, color: "#444", lineHeight: 1.55 },

    // -------- Links --------
    lineText: { fontSize: 9.5, marginBottom: 2 },
  });
}

export function buildCoverBannerPdfDocument(data: PdfLayoutData) {
  const {
    theme,
    g,
    calc,
    viability,
    businessName,
    tagline,
    email,
    phone,
    website,
    address,
    logoUrl,
    socialLinks,
  } = data;
  const styles = buildStyles(theme);

  const kpis: { label: string; value: string }[] = [
    { label: "Monthly revenue", value: money(calc.monthlyRevenueAtLaunch) },
    { label: "Gross margin", value: pct(calc.grossMarginPercent) },
    { label: "Monthly net profit", value: money(calc.monthlyNetProfit) },
    { label: "Funding gap", value: money(calc.fundingGap) },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* -------- Banner -------- */}
        <View style={styles.banner}>
          {logoUrl && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={logoUrl} style={styles.logo} />
          )}
          <Text style={styles.name}>{businessName}</Text>
          {tagline && <Text style={styles.tagline}>{tagline}</Text>}
          <View style={styles.contactRow}>
            {email && (
              <Link src={`mailto:${email}`} style={styles.contactLink}>
                {email}
              </Link>
            )}
            {phone && <Text style={styles.contactText}>{phone}</Text>}
            {website && (
              <Link src={website} style={styles.contactLink}>
                {website}
              </Link>
            )}
            {address && <Text style={styles.contactText}>{address}</Text>}
          </View>
          {viability && (
            <Text style={styles.viabilityPill}>
              Viability score: {viability.score}/100
            </Text>
          )}
        </View>

        {/* -------- Body -------- */}
        <View style={styles.body}>
          {/* KPI strip */}
          <View style={styles.kpiGrid}>
            {kpis.map((kpi) => (
              <View key={kpi.label} style={styles.kpiCell}>
                <Text style={styles.kpiLabel}>{kpi.label}</Text>
                <Text style={styles.kpiValue}>{kpi.value}</Text>
              </View>
            ))}
          </View>

          {/* Viability detail (flags + suggestions) */}
          {viability &&
            (viability.flags.length > 0 ||
              viability.suggestions.length > 0) && (
              <View style={styles.noteSection} wrap={false}>
                <Text style={styles.sectionTitle}>Viability notes</Text>
                {viability.flags.length > 0 && (
                  <>
                    <Text style={styles.noteHeading}>Flags</Text>
                    {viability.flags.map((flag, i) => (
                      <View key={i} style={styles.noteRow}>
                        <Text style={styles.noteBullet}>•</Text>
                        <Text style={styles.noteText}>{flag}</Text>
                      </View>
                    ))}
                  </>
                )}
                {viability.suggestions.length > 0 && (
                  <>
                    <Text style={styles.noteHeading}>Suggestions</Text>
                    {viability.suggestions.map((s, i) => (
                      <View key={i} style={styles.noteRow}>
                        <Text style={styles.noteBullet}>•</Text>
                        <Text style={styles.noteText}>{s}</Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            )}

          {/* Narrative sections */}
          {NARRATIVE_SECTIONS.filter(({ key }) => g[key]).map(
            ({ title, key }) => (
              <View key={key} style={styles.section} wrap>
                <Text style={styles.narrativeTitle}>{title}</Text>
                <Text style={styles.narrativeBody}>{g[key]}</Text>
              </View>
            ),
          )}

          {/* Social / reference links */}
          {socialLinks.length > 0 && (
            <View style={styles.noteSection} wrap={false}>
              <Text style={styles.sectionTitle}>Links</Text>
              {socialLinks.map((l, i) => (
                <Link
                  key={i}
                  src={l.url}
                  style={[styles.lineText, { color: theme.pdf.link }]}
                >
                  {l.label}
                </Link>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
