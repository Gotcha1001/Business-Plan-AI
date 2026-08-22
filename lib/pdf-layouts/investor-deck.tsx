// lib/pdf-layouts/investor-deck.tsx
//
// Fills the TODO in lib/pdf-layouts/index.ts: PDF_LAYOUT_BUILDERS["investor-deck"]
// was falling back to buildExecutiveFirstPdfDocument. This is a real,
// standalone builder now.
//
// Deliberately NOT a re-skin of executive-first.tsx. "Investor deck" implies
// the pitch-deck reading pattern -- one idea per page, cover slide, an
// explicit "ask" slide before the numbers, then narrative broken into
// individual slides -- rather than executive-first's single-scroll,
// number-dense page. Every section below is its own <Page>, with a
// slide-number footer (n / total) via react-pdf's render-prop <Text>, which
// is the one thing that can't be hand-computed up front since narrative
// sections are filtered by which ones actually have content.
//
// Mirrors components/plan-layouts/investor-deck.tsx for print -- see that
// file for the web equivalent of each slide.

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
    // -------- Shared slide chrome --------
    slide: { padding: 44, fontSize: 10.5, minHeight: "100%" },
    footer: {
      position: "absolute",
      bottom: 24,
      left: 44,
      right: 44,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    footerLabel: {
      fontSize: 7.5,
      color: "#999",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    footerCount: { fontSize: 7.5, color: "#999" },

    // -------- Cover slide (full-bleed, theme-colored) --------
    coverPage: {
      padding: 0,
      fontSize: 10.5,
      backgroundColor: theme.pdf.accentBorder,
    },
    coverInner: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 56,
    },
    coverKicker: {
      fontSize: 9,
      color: "#FFFFFF",
      opacity: 0.75,
      textTransform: "uppercase",
      letterSpacing: 2,
      marginBottom: 14,
    },
    coverLogo: {
      width: 64,
      height: 64,
      objectFit: "contain",
      marginBottom: 14,
    },
    coverName: {
      fontSize: 30,
      fontWeight: 700,
      color: "#FFFFFF",
      textAlign: "center",
    },
    coverTagline: {
      fontSize: 12.5,
      color: "#FFFFFF",
      opacity: 0.9,
      textAlign: "center",
      marginTop: 10,
      maxWidth: 380,
    },
    coverPillRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 18,
    },
    coverPill: {
      fontSize: 8.5,
      color: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#FFFFFF",
      borderRadius: 10,
      paddingVertical: 3,
      paddingHorizontal: 9,
      marginHorizontal: 3,
      marginTop: 4,
    },
    coverContactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 28,
    },
    coverContactText: {
      fontSize: 9,
      color: "#FFFFFF",
      opacity: 0.85,
      marginHorizontal: 6,
      marginTop: 4,
    },

    // -------- Slide headers (non-cover) --------
    slideKicker: {
      fontSize: 8.5,
      color: theme.pdf.headline,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginBottom: 6,
    },
    slideTitle: {
      fontSize: 21,
      fontWeight: 700,
      marginBottom: 18,
    },

    // -------- "The Ask" slide --------
    askRow: { flexDirection: "row", marginTop: 8 },
    askCell: { flex: 1, paddingRight: 16 },
    askLabel: {
      fontSize: 8.5,
      color: "#777",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    askValue: { fontSize: 22, fontWeight: 700, marginTop: 6 },
    askDivider: {
      borderBottomWidth: 1,
      borderBottomColor: theme.pdf.accentBorder,
      marginVertical: 16,
    },
    askNote: { fontSize: 9.5, color: "#555", lineHeight: 1.5 },

    // -------- KPI grid --------
    kpiGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
    kpiCell: { width: "33.33%", marginBottom: 16, paddingRight: 10 },
    kpiLabel: { fontSize: 8, color: "#777" },
    kpiValue: { fontSize: 15, fontWeight: 700, marginTop: 3 },

    // -------- Viability --------
    viabilityPill: {
      alignSelf: "flex-start",
      fontSize: 10.5,
      color: theme.pdf.pillText,
      backgroundColor: theme.pdf.pillBg,
      borderRadius: 10,
      paddingVertical: 5,
      paddingHorizontal: 12,
      marginTop: 4,
      marginBottom: 14,
    },
    noteRow: { flexDirection: "row", marginBottom: 4 },
    noteBullet: { fontSize: 9, color: "#999", marginRight: 5 },
    noteText: { fontSize: 9, color: "#444", lineHeight: 1.4, flex: 1 },
    noteHeading: {
      fontSize: 8.5,
      fontWeight: 700,
      color: "#666",
      marginTop: 10,
      marginBottom: 4,
    },

    // -------- Narrative slide body --------
    narrativeBody: { fontSize: 11, color: "#333", lineHeight: 1.65 },

    // -------- Links slide --------
    lineText: { fontSize: 10.5 },
  });
}

export function buildInvestorDeckPdfDocument(data: PdfLayoutData) {
  const {
    plan,
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

  const { fundingRequestAmount, equityOffered } = plan.funding;
  const narrativeSlides = NARRATIVE_SECTIONS.filter(({ key }) => g[key]);

  // Cover + Ask + Traction are always present; each populated narrative
  // section is its own slide; Links only appears if there are any.
  const totalSlides =
    3 + narrativeSlides.length + (socialLinks.length > 0 ? 1 : 0);

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
    { label: "Break-even revenue", value: money(calc.breakEvenRevenue) },
  ];

  const Footer = ({ label }: { label: string }) => (
    <View style={styles.footer} fixed>
      <Text style={styles.footerLabel}>
        {businessName} · {label}
      </Text>
      <Text
        style={styles.footerCount}
        render={({ pageNumber }) => `${pageNumber} / ${totalSlides}`}
      />
    </View>
  );

  return (
    <Document>
      {/* -------- Slide 1: Cover -------- */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverInner}>
          <Text style={styles.coverKicker}>Investor Deck</Text>
          {logoUrl && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={logoUrl} style={styles.coverLogo} />
          )}
          <Text style={styles.coverName}>{businessName}</Text>
          {tagline && <Text style={styles.coverTagline}>{tagline}</Text>}

          {viability && (
            <View style={styles.coverPillRow}>
              <Text style={styles.coverPill}>
                Viability: {viability.score}/100 · {scoreLabel(viability.score)}
              </Text>
            </View>
          )}

          <View style={styles.coverContactRow}>
            {email && <Text style={styles.coverContactText}>{email}</Text>}
            {phone && <Text style={styles.coverContactText}>{phone}</Text>}
            {website && <Text style={styles.coverContactText}>{website}</Text>}
            {address && <Text style={styles.coverContactText}>{address}</Text>}
          </View>
        </View>
      </Page>

      {/* -------- Slide 2: The Ask -------- */}
      <Page size="A4" style={styles.slide}>
        <Text style={styles.slideKicker}>Slide 02</Text>
        <Text style={styles.slideTitle}>The Ask</Text>

        <View style={styles.askRow}>
          <View style={styles.askCell}>
            <Text style={styles.askLabel}>Funding requested</Text>
            <Text style={styles.askValue}>
              {fundingRequestAmount !== undefined
                ? money(fundingRequestAmount)
                : "n/a"}
            </Text>
          </View>
          <View style={styles.askCell}>
            <Text style={styles.askLabel}>Equity offered</Text>
            <Text style={styles.askValue}>{equityOffered || "n/a"}</Text>
          </View>
          <View style={styles.askCell}>
            <Text style={styles.askLabel}>Funding gap</Text>
            <Text style={styles.askValue}>{money(calc.fundingGap)}</Text>
          </View>
        </View>

        <View style={styles.askDivider} />

        {g.fundingRequest ? (
          <Text style={styles.askNote}>{g.fundingRequest}</Text>
        ) : (
          <Text style={styles.askNote}>
            No funding-request narrative provided for this version.
          </Text>
        )}
        <Footer label="The Ask" />
      </Page>

      {/* -------- Slide 3: Traction & Financials -------- */}
      <Page size="A4" style={styles.slide}>
        <Text style={styles.slideKicker}>Slide 03</Text>
        <Text style={styles.slideTitle}>Traction & Financials</Text>

        {viability && (
          <Text style={styles.viabilityPill}>
            Viability score: {viability.score}/100 ·{" "}
            {scoreLabel(viability.score)}
          </Text>
        )}

        <View style={styles.kpiGrid}>
          {kpis.map((kpi) => (
            <View key={kpi.label} style={styles.kpiCell}>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
            </View>
          ))}
        </View>

        {viability &&
          (viability.flags.length > 0 || viability.suggestions.length > 0) && (
            <View wrap={false}>
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
        <Footer label="Traction" />
      </Page>

      {/* -------- Slides 4..N: one narrative section per slide -------- */}
      {narrativeSlides.map(({ title, key }, i) => (
        <Page key={key} size="A4" style={styles.slide}>
          <Text style={styles.slideKicker}>
            Slide {String(i + 4).padStart(2, "0")}
          </Text>
          <Text style={styles.slideTitle}>{title}</Text>
          <Text style={styles.narrativeBody}>{g[key]}</Text>
          <Footer label={title} />
        </Page>
      ))}

      {/* -------- Final slide: Links (only if any) -------- */}
      {socialLinks.length > 0 && (
        <Page size="A4" style={styles.slide}>
          <Text style={styles.slideKicker}>
            Slide {String(totalSlides).padStart(2, "0")}
          </Text>
          <Text style={styles.slideTitle}>Links</Text>
          {socialLinks.map((l, i) => (
            <Link
              key={i}
              src={l.url}
              style={[
                styles.lineText,
                { color: theme.pdf.link, marginBottom: 6 },
              ]}
            >
              {l.label}
            </Link>
          ))}
          <Footer label="Links" />
        </Page>
      )}
    </Document>
  );
}
