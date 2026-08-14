export interface Account {
  holderName: string;
  balance: number;
  currency: string;
  status: "Active" | "Frozen";
  iban: string;
}

export interface PaymentCardData {
  network: string;
  holderName: string;
  numberMasked: string;
  expiry: string;
  type: "Debit" | "Virtual";
}

export type TransactionCategory =
  | "Food"
  | "Shopping"
  | "Transport"
  | "Entertainment"
  | "Income"
  | "Transfer";

export interface Transaction {
  id: string;
  label: string;
  category: TransactionCategory;
  amount: number;
  date: string;
}

export interface SpendingCategory {
  category: string;
  amount: number;
  percent: number;
}

export interface Recipient {
  id: string;
  name: string;
  initials: string;
}

export interface CardDetails {
  numberFull: string;
  cvv: string;
}

export interface CardControls {
  onlinePayments: boolean;
  contactless: boolean;
  atmWithdrawals: boolean;
  magneticStripe: boolean;
  spendingLimit: number;
  currentSpend: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  targetDate?: string;
}

export type AnalyticsPeriod = "week" | "month" | "3months" | "year";

export interface AnalyticsPoint {
  label: string;
  spend: number;
  income: number;
}

export interface AnalyticsCategoryBreakdown {
  category: string;
  amount: number;
  percent: number;
}

export interface AnalyticsPeriodData {
  points: AnalyticsPoint[];
  totalSpent: number;
  income: number;
  netFlow: number;
  avgDailySpend: number;
  categories: AnalyticsCategoryBreakdown[];
}
