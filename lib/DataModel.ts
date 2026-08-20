// STUB for type-checking only -- mirrors the real convex/schema.ts shapes.

export interface ViabilityAnalysis {
  score: number;
  flags: string[];
  suggestions: string[];
}

export interface BusinessPlanDoc {
  _id: string;
  _creationTime: number;
  userId: string;
  title: string;
  shareId: string;
  activeVersionId?: string;
  status: "draft" | "generating" | "ready" | "failed";
  generationError?: string;
  identity: {
    businessName: string;
    tradingName?: string;
    legalStructure?: string;
    registrationDate?: string;
    registrationNumber?: string;
    physicalAddress?: string;
    mailingAddress?: string;
    website?: string;
    phone?: string;
    email?: string;
    socialLinks: { label: string; url: string }[];
    logoUrl?: string;
    foundingYear?: number;
    stage?: "idea" | "pre_revenue" | "startup" | "growth" | "established";
    industry?: string;
    industryCode?: string;
    missionStatement?: string;
    visionStatement?: string;
    coreValues: string[];
    problemStatement?: string;
    uniqueValueProposition?: string;
    shortTermGoals: string[];
    mediumTermGoals: string[];
    longTermGoals: string[];
  };
  funding: {
    startupCosts: { category: string; amount: number }[];
    fundingSources: { source: string; amount: number }[];
    fundingRequestAmount?: number;
    equityOffered?: string;
  };
  financials: {
    projectionHorizonMonths?: number;
    monthlySalesVolume?: number;
    avgSellingPrice?: number;
    materialCostPerUnit?: number;
    [key: string]: unknown;
  };
  createdAt: number;
  updatedAt: number;
}

export interface BusinessPlanVersionDoc {
  _id: string;
  _creationTime: number;
  planId: string;
  userId: string;
  versionNumber: number;
  label: string;
  style?: string;
  layout?: string;
  generatedContent: unknown;
  viabilityAnalysis?: ViabilityAnalysis;
  createdAt: number;
  editedAt?: number;
}

export interface DataModel {
  businessPlans: BusinessPlanDoc;
  businessPlanVersions: BusinessPlanVersionDoc;
}

export type Doc<T extends keyof DataModel> = DataModel[T];
export type Id<T extends keyof DataModel> = string & { __tableName: T };
