// lib/pdf-layouts/minimal-clean.tsx
//
// Fills the remaining TODO in lib/pdf-layouts/index.ts -- "minimal-clean"
// was falling back to buildExecutiveFirstPdfDocument because this file
// didn't exist yet.
//
// Mirrors components/plan-layouts/minimal-clean.tsx for print: plain
// single column, no banner, no cards, no closing-note quote block --
// just a name/contact header, a thin rule under each section title
// (same idea as the web version's border-b pb-1), a financials grid,
// flags list, then narrative sections in plan order. Deliberately the
// least decorated of the five PDF layouts, same as its web twin.
// Same data source (lib/plan-data.ts's preparePlanData()) as every
// other layout.

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
    page: { padding: 44, fontSize: 10.5 },
    // -------- Header --------
    headerRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    identityRow: { flexDirection: "row", alignItems: "flex-start" },
    logo: {
      width: 48,
      height: 48,
      objectFit: "contain",
      marginRight: 12,
    },
    name: { fontSize: 18, fontWeight: 700 },
    tagline: { fontSize: 10, color: theme.pdf.headline, marginTop: 2 },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 6,
    },
    contactLink: {
      fontSize: 9,
      color: theme.pdf.link,
      textDecoration: "none",
      marginRight: 10,
    },
    contactText: {
      fontSize: 9,
      color: "#666",
      marginRight: 10,
    },
    viabilityLine: { fontSize: 9.5, color: "#666", marginTop: 10 },
    // -------- Section rule (thin underline, like web's border-b) --------
    sectionTitle: {
      fontSize: 9.5,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      borderBottomWidth: 1,
      borderBottomColor: "#DDDDDD",
      paddingBottom: 3,
      marginBottom: 8,
      marginTop: 18,
    },
    // -------- Financials grid (4 cells, left-aligned) --------
    kpiGrid: { flexDirection: "row", flexWrap: "wrap" },
    kpiCell: { width: "25%", marginBottom: 6 },
    kpiLabel: { fontSize: 8, color: "#888" },
    kpiValue: { fontSize: 11, marginTop: 2 },
    // -------- Flags --------
    flagRow: { flexDirection: "row", marginBottom: 3 },
    flagBullet: { fontSize: 9, color: "#999", marginRight: 5 },
    flagText: { fontSize: 9, color: "#555", lineHeight: 1.4, flex: 1 },
    // -------- Narrative --------
    narrativeBody: { fontSize: 9.5, color: "#555", lineHeight: 1.55 },
    // -------- Links --------
    lineText: { fontSize: 9.5, marginBottom: 2, color: theme.pdf.link },
  });
}

export function buildMinimalCleanPdfDocument(data: PdfLayoutData) {
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
    { label: "Net profit", value: money(calc.monthlyNetProfit) },
    { label: "Funding gap", value: money(calc.fundingGap) },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* -------- Header -------- */}
        <View style={styles.headerRow}>
          <View style={styles.identityRow}>
            {logoUrl && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={logoUrl} style={styles.logo} />
            )}
            <View>
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
            </View>
          </View>
        </View>

        {viability && (
          <Text style={styles.viabilityLine}>
            Viability score: {viability.score}/100
          </Text>
        )}

        {/* -------- Financials -------- */}
        <Text style={styles.sectionTitle}>Financials</Text>
        <View style={styles.kpiGrid}>
          {kpis.map((kpi) => (
            <View key={kpi.label} style={styles.kpiCell}>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
            </View>
          ))}
        </View>

        {/* -------- Flags -------- */}
        {viability && viability.flags.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Flags</Text>
            {viability.flags.map((flag, i) => (
              <View key={i} style={styles.flagRow}>
                <Text style={styles.flagBullet}>•</Text>
                <Text style={styles.flagText}>{flag}</Text>
              </View>
            ))}
          </>
        )}

        {/* -------- Narrative sections -------- */}
        {NARRATIVE_SECTIONS.filter(({ key }) => g[key]).map(
          ({ title, key }) => (
            <View key={key} wrap>
              <Text style={styles.sectionTitle}>{title}</Text>
              <Text style={styles.narrativeBody}>{g[key]}</Text>
            </View>
          ),
        )}

        {/* -------- Social / reference links -------- */}
        {socialLinks.length > 0 && (
          <View wrap={false}>
            <Text style={styles.sectionTitle}>Links</Text>
            {socialLinks.map((l, i) => (
              <Link key={i} src={l.url} style={styles.lineText}>
                {l.label}
              </Link>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
