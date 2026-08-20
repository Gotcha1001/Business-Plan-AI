// lib/pdf-layouts/financial-charts.tsx
//
// TRANSFORMED FROM: lib/pdf-layouts/graph-stats.tsx
//
// Mirrors components/plan-layouts/financial-charts.tsx for print.
// @react-pdf/renderer can't run recharts, so both "charts" here are
// static bar rows instead of line charts: one row per projection month,
// with two stacked bars (revenue vs. net profit, or revenue vs. total
// cost) scaled to the highest value in that section -- same idea as the
// old skill-signal / experience-depth bar treatment, just plotting
// calc.projection (lib/financial-calculations.ts's MonthlyProjection[])
// instead of computeSkillSignals() / computeExperienceDepth().

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
import { getChartPalette } from "@/lib/chart-theme";
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
    headRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    headTextCol: { flex: 1, paddingRight: 16 },
    logo: { width: 72, height: 72, objectFit: "contain" },
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
    viabilityPill: {
      fontSize: 9,
      color: theme.pdf.pillText,
      backgroundColor: theme.pdf.pillBg,
      borderRadius: 10,
      paddingVertical: 3,
      paddingHorizontal: 8,
      marginTop: 8,
      alignSelf: "flex-start",
    },
    section: { marginTop: 16 },
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
    sectionSubtitle: {
      fontSize: 8.5,
      color: "#777",
      marginTop: -6,
      marginBottom: 8,
    },
    chartRow: { marginBottom: 6 },
    chartRowLabel: { fontSize: 8, color: "#777", marginBottom: 2 },
    barTrack: {
      height: 5,
      borderRadius: 2.5,
      backgroundColor: "#eee",
      overflow: "hidden",
      marginBottom: 2,
    },
    barFillPrimary: { height: 5, borderRadius: 2.5 },
    barFillSecondary: { height: 5, borderRadius: 2.5 },
    legendRow: { flexDirection: "row", marginBottom: 8 },
    legendItem: { flexDirection: "row", alignItems: "center", marginRight: 14 },
    legendDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 4 },
    legendText: { fontSize: 8, color: "#555" },
    kpiGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
    kpiCell: { width: "25%", marginBottom: 10 },
    kpiLabel: { fontSize: 8, color: "#777" },
    kpiValue: { fontSize: 12, fontWeight: 700, marginTop: 2 },
    lineText: { fontSize: 9.5 },
    narrativeTitle: { fontSize: 9.5, fontWeight: 700, marginTop: 2 },
    narrativeBody: {
      fontSize: 9,
      color: "#444",
      marginTop: 4,
      lineHeight: 1.5,
    },
    closingNote: {
      fontSize: 9.5,
      color: theme.pdf.closingNote,
      marginTop: 18,
      textAlign: "center",
    },
  });
}

export function buildFinancialChartsPdfDocument(data: PdfLayoutData) {
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
  const palette = getChartPalette(theme);

  const maxTrajectoryValue = Math.max(
    ...calc.projection.map((p) => Math.max(p.revenue, p.netProfit)),
    1,
  );
  const maxBreakEvenValue = Math.max(
    ...calc.projection.map((p) =>
      Math.max(p.revenue, p.cogs + p.operatingExpenses),
    ),
    1,
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headRow}>
          <View style={styles.headTextCol}>
            <Text style={styles.name}>{businessName}</Text>
            {tagline && <Text style={styles.headline}>{tagline}</Text>}
            <View style={styles.contactRow}>
              {email && (
                <Link src={`mailto:${email}`} style={styles.contactLink}>
                  {email}
                </Link>
              )}
              {phone && (
                <>
                  <Text style={styles.contactSep}>·</Text>
                  <Text style={styles.contactText}>{phone}</Text>
                </>
              )}
              {website && (
                <>
                  <Text style={styles.contactSep}>·</Text>
                  <Link src={website} style={styles.contactLink}>
                    {website}
                  </Link>
                </>
              )}
              {address && (
                <>
                  <Text style={styles.contactSep}>·</Text>
                  <Text style={styles.contactText}>{address}</Text>
                </>
              )}
            </View>
            {viability && (
              <Text style={styles.viabilityPill}>
                Viability score: {viability.score}/100
              </Text>
            )}
          </View>
          {logoUrl && <Image src={logoUrl} style={styles.logo} />}
        </View>

        {/* -------- Revenue / profit trajectory (static bar stand-in) -------- */}
        {calc.projection.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Revenue &amp; profit trajectory
            </Text>
            <Text style={styles.sectionSubtitle}>
              Month-by-month revenue and net profit over the{" "}
              {calc.projection.length}-month projection.
            </Text>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: palette.primary },
                  ]}
                />
                <Text style={styles.legendText}>Revenue</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: palette.secondary },
                  ]}
                />
                <Text style={styles.legendText}>Net profit</Text>
              </View>
            </View>
            {calc.projection.map((p) => (
              <View key={p.month} style={styles.chartRow}>
                <Text style={styles.chartRowLabel}>
                  M{p.month} · {money(p.revenue)} rev / {money(p.netProfit)}{" "}
                  profit
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFillPrimary,
                      {
                        backgroundColor: palette.primary,
                        width: `${(p.revenue / maxTrajectoryValue) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFillSecondary,
                      {
                        backgroundColor: palette.secondary,
                        width: `${(Math.max(p.netProfit, 0) / maxTrajectoryValue) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* -------- Break-even (static bar stand-in) -------- */}
        {calc.projection.length > 1 && (
          <View style={styles.section} break>
            <Text style={styles.sectionTitle}>Break-even</Text>
            <Text style={styles.sectionSubtitle}>
              {calc.breakEvenUnits !== null
                ? `Break-even at ${calc.breakEvenUnits.toLocaleString()} units (${money(
                    calc.breakEvenRevenue,
                  )}) -- where revenue overtakes total cost below.`
                : "Revenue does not cross total cost within this projection at current assumptions."}
            </Text>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: palette.primary },
                  ]}
                />
                <Text style={styles.legendText}>Revenue</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: palette.secondary },
                  ]}
                />
                <Text style={styles.legendText}>Total cost</Text>
              </View>
            </View>
            {calc.projection.map((p) => {
              const totalCost = p.cogs + p.operatingExpenses;
              return (
                <View key={p.month} style={styles.chartRow}>
                  <Text style={styles.chartRowLabel}>
                    M{p.month} · {money(p.revenue)} rev / {money(totalCost)}{" "}
                    cost
                  </Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFillPrimary,
                        {
                          backgroundColor: palette.primary,
                          width: `${(p.revenue / maxBreakEvenValue) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFillSecondary,
                        {
                          backgroundColor: palette.secondary,
                          width: `${(totalCost / maxBreakEvenValue) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* -------- KPI grid -------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financials at a glance</Text>
          <View style={styles.kpiGrid}>
            {[
              { label: "Gross margin", value: pct(calc.grossMarginPercent) },
              { label: "Net margin", value: pct(calc.netMarginPercent) },
              { label: "ROI (Year 1)", value: pct(calc.roiPercentYear1) },
              {
                label: "Payback period",
                value:
                  calc.paybackPeriodMonths !== null
                    ? `${calc.paybackPeriodMonths} mo`
                    : "n/a",
              },
            ].map((kpi) => (
              <View key={kpi.label} style={styles.kpiCell}>
                <Text style={styles.kpiLabel}>{kpi.label}</Text>
                <Text style={styles.kpiValue}>{kpi.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* -------- Narrative sections -------- */}
        {NARRATIVE_SECTIONS.filter(({ key }) => g[key]).map(
          ({ title, key }) => (
            <View key={key} style={styles.section} wrap>
              <Text style={styles.sectionTitle}>{title}</Text>
              <Text style={styles.narrativeBody}>{g[key]}</Text>
            </View>
          ),
        )}

        {/* -------- Social / reference links (replaces the CV app's links+references) -------- */}
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

        {viability && viability.flags.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Flags</Text>
            {viability.flags.map((flag, i) => (
              <Text key={i} style={styles.narrativeBody}>
                • {flag}
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
