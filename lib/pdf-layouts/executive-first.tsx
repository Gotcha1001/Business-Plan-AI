// lib/pdf-layouts/executive-first.tsx
//
// TRANSFORMED FROM: lib/pdf-layouts/centered.tsx
//
// Mirrors components/plan-layouts/executive-first.tsx for print: header
// band with identity + contact info, viability pill, a KPI grid (8 cells
// instead of financial-charts.tsx's 4 -- this layout leans on the numbers
// instead of the bar charts), a full viability detail block (flags +
// suggestions, not just flags), then the narrative sections in plan order.
// No chart rows here on purpose -- that's what financial-charts.tsx is for;
// this is the "friendly default" layout and stays number-dense, not
// graph-dense.

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
import { pct } from "@/lib/plan-data";
import { formatMoney } from "@/lib/currency";

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

/** Same 80/55 thresholds as components/viability-badge.tsx's scoreBand(). */
function scoreLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 55) return "Workable";
  return "Needs work";
}

function buildStyles(theme: PdfLayoutData["theme"]) {
  return StyleSheet.create({
    page: { padding: 44, fontSize: 10.5 },

    // -------- Header band (centered, like the web hero) --------
    headWrap: { alignItems: "center", textAlign: "center" },
    logo: { width: 56, height: 56, objectFit: "contain", marginBottom: 8 },
    name: { fontSize: 20, fontWeight: 700 },
    headline: { fontSize: 10.5, color: theme.pdf.headline, marginTop: 3 },
    pillRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 8,
    },
    pill: {
      fontSize: 8,
      color: theme.pdf.pillText,
      backgroundColor: theme.pdf.pillBg,
      borderRadius: 10,
      paddingVertical: 3,
      paddingHorizontal: 8,
      marginHorizontal: 3,
      marginTop: 4,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 8,
    },
    contactLink: {
      fontSize: 9,
      color: theme.pdf.link,
      textDecoration: "none",
      marginHorizontal: 3,
      marginTop: 4,
    },
    contactText: {
      fontSize: 9,
      color: "#555",
      marginHorizontal: 3,
      marginTop: 4,
    },
    viabilityPill: {
      fontSize: 9.5,
      color: theme.pdf.pillText,
      backgroundColor: theme.pdf.pillBg,
      borderRadius: 10,
      paddingVertical: 4,
      paddingHorizontal: 10,
      marginTop: 12,
    },

    // -------- Sections --------
    section: { marginTop: 18 },
    sectionTitle: {
      fontSize: 9.5,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      borderBottomWidth: 1,
      borderBottomColor: theme.pdf.accentBorder,
      paddingBottom: 4,
      marginBottom: 8,
    },

    // -------- KPI grid (8 cells, 4 per row) --------
    kpiGrid: { flexDirection: "row", flexWrap: "wrap" },
    kpiCell: { width: "25%", marginBottom: 10, paddingRight: 6 },
    kpiLabel: { fontSize: 8, color: "#777" },
    kpiValue: { fontSize: 12, fontWeight: 700, marginTop: 2 },

    // -------- Viability detail --------
    noteRow: { flexDirection: "row", marginBottom: 4 },
    noteBullet: { fontSize: 9, color: "#999", marginRight: 5 },
    noteText: { fontSize: 9, color: "#444", lineHeight: 1.4, flex: 1 },
    noteHeading: {
      fontSize: 8.5,
      fontWeight: 700,
      color: "#666",
      marginTop: 6,
      marginBottom: 4,
    },

    // -------- Narrative --------
    narrativeBody: { fontSize: 9.5, color: "#444", lineHeight: 1.55 },

    // -------- Links --------
    lineText: { fontSize: 9.5 },
  });
}

export function buildExecutiveFirstPdfDocument(data: PdfLayoutData) {
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
    currency,
  } = data;
  const money = formatMoney(currency);
  const styles = buildStyles(theme);

  const kpis: { label: string; value: string }[] = [
    {
      label: "Monthly revenue at launch",
      value: money(calc.monthlyRevenueAtLaunch),
    },
    { label: "Gross margin", value: pct(calc.grossMarginPercent) },
    { label: "Monthly net profit", value: money(calc.monthlyNetProfit) },
    { label: "Net margin", value: pct(calc.netMarginPercent) },
    {
      label: "Break-even",
      value:
        calc.breakEvenUnits !== null
          ? `${calc.breakEvenUnits.toLocaleString()} units`
          : "n/a",
    },
    { label: "ROI (Year 1)", value: pct(calc.roiPercentYear1) },
    {
      label: "Payback period",
      value:
        calc.paybackPeriodMonths !== null
          ? `${calc.paybackPeriodMonths} mo`
          : "n/a",
    },
    { label: "Funding gap", value: money(calc.fundingGap) },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* -------- Header band -------- */}
        <View style={styles.headWrap}>
          {logoUrl && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={logoUrl} style={styles.logo} />
          )}
          <Text style={styles.name}>{businessName}</Text>
          {tagline && <Text style={styles.headline}>{tagline}</Text>}

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
              Viability score: {viability.score}/100 ·{" "}
              {scoreLabel(viability.score)}
            </Text>
          )}
        </View>

        {/* -------- Financial KPI grid -------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financials at a glance</Text>
          <View style={styles.kpiGrid}>
            {kpis.map((kpi) => (
              <View key={kpi.label} style={styles.kpiCell}>
                <Text style={styles.kpiLabel}>{kpi.label}</Text>
                <Text style={styles.kpiValue}>{kpi.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* -------- Viability detail (flags + suggestions) -------- */}
        {viability &&
          (viability.flags.length > 0 || viability.suggestions.length > 0) && (
            <View style={styles.section} wrap={false}>
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

        {/* -------- Narrative sections -------- */}
        {NARRATIVE_SECTIONS.filter(({ key }) => g[key]).map(
          ({ title, key }) => (
            <View key={key} style={styles.section} wrap>
              <Text style={styles.sectionTitle}>{title}</Text>
              <Text style={styles.narrativeBody}>{g[key]}</Text>
            </View>
          ),
        )}

        {/* -------- Social / reference links -------- */}
        {socialLinks.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Links</Text>
            {socialLinks.map((l, i) => (
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
      </Page>
    </Document>
  );
}
