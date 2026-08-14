import type {
  Account,
  AnalyticsPeriod,
  AnalyticsPeriodData,
  CardControls,
  CardDetails,
  PaymentCardData,
  Recipient,
  SavingsGoal,
  SpendingCategory,
  Transaction,
} from "@/types/banking";

// All data on this page is fictional - a design/development portfolio demo,
// not a real bank. See the "Concept / Demo" mark in the UI.

export const demoCredentials = {
  demoId: "4000 1234 5678 9010",
  pin: "1234",
};

export const account: Account = {
  holderName: "Voin Pilipović",
  balance: 12480.5,
  currency: "EUR",
  status: "Active",
  iban: "NT12 3456 7890 1234",
};

export const card: PaymentCardData = {
  network: "NOTIC NETWORK",
  holderName: "VOIN PILIPOVIĆ",
  numberMasked: "•••• •••• •••• 4821",
  expiry: "09/29",
  type: "Debit",
};

export const transactions: Transaction[] = [
  { id: "t1", label: "Netflix", category: "Entertainment", amount: -12.99, date: "Today" },
  { id: "t2", label: "Salary", category: "Income", amount: 2450, date: "Today" },
  { id: "t3", label: "Apple Store", category: "Shopping", amount: -149, date: "Yesterday" },
  { id: "t4", label: "Coffee", category: "Food", amount: -6.8, date: "Yesterday" },
  { id: "t5", label: "Transfer — Marko", category: "Transfer", amount: -70, date: "2 days ago" },
];

export const spending: SpendingCategory[] = [
  { category: "Food", amount: 320, percent: 38 },
  { category: "Shopping", amount: 240, percent: 29 },
  { category: "Transport", amount: 140, percent: 17 },
  { category: "Entertainment", amount: 130, percent: 16 },
];

export const spendingTotal = spending.reduce((sum, item) => sum + item.amount, 0);

// Fictional recent recipients for the Send Money demo - initials only, no
// photos.
export const recipients: Recipient[] = [
  { id: "p1", name: "Andrea", initials: "AN" },
  { id: "p2", name: "Marko", initials: "MK" },
  { id: "p3", name: "Luka", initials: "LK" },
  { id: "p4", name: "Nina", initials: "NN" },
];

// Fictional full card details for the "view details" demo reveal - never
// shown by default, and clearly not a real card.
export const cardDetails: CardDetails = {
  numberFull: "4000 1234 5678 4821",
  cvv: "482",
};

export const defaultCardControls: CardControls = {
  onlinePayments: true,
  contactless: true,
  atmWithdrawals: true,
  magneticStripe: false,
  spendingLimit: 2000,
  currentSpend: 830,
};

export const savingsGoals: SavingsGoal[] = [
  { id: "g1", title: "M4 Fund", current: 8420, target: 20000, targetDate: "Dec 2026" },
  { id: "g2", title: "Travel", current: 1850, target: 3000, targetDate: "Mar 2027" },
  { id: "g3", title: "Emergency Fund", current: 4100, target: 7500 },
];

// Analytics - one dataset per period. Category ratios are deliberately
// stable across periods (this is a mock demo, not a simulation), so the
// breakdown reads as plausible rather than random.
export const analyticsData: Record<AnalyticsPeriod, AnalyticsPeriodData> = {
  week: {
    points: [
      { label: "Mon", spend: 38, income: 0 },
      { label: "Tue", spend: 42, income: 0 },
      { label: "Wed", spend: 55, income: 0 },
      { label: "Thu", spend: 30, income: 0 },
      { label: "Fri", spend: 65, income: 0 },
      { label: "Sat", spend: 48, income: 0 },
      { label: "Sun", spend: 27, income: 0 },
    ],
    totalSpent: 305,
    income: 0,
    netFlow: -305,
    avgDailySpend: 43.6,
    categories: [
      { category: "Food", amount: 95, percent: 31 },
      { category: "Shopping", amount: 70, percent: 23 },
      { category: "Transport", amount: 45, percent: 15 },
      { category: "Entertainment", amount: 55, percent: 18 },
      { category: "Bills", amount: 40, percent: 13 },
    ],
  },
  month: {
    points: [
      { label: "W1", spend: 260, income: 0 },
      { label: "W2", spend: 300, income: 2450 },
      { label: "W3", spend: 240, income: 0 },
      { label: "W4", spend: 250, income: 0 },
    ],
    totalSpent: 1050,
    income: 2450,
    netFlow: 1400,
    avgDailySpend: 35,
    categories: [
      { category: "Food", amount: 320, percent: 30 },
      { category: "Shopping", amount: 240, percent: 23 },
      { category: "Transport", amount: 140, percent: 13 },
      { category: "Entertainment", amount: 130, percent: 12 },
      { category: "Bills", amount: 220, percent: 22 },
    ],
  },
  "3months": {
    points: [
      { label: "Jun", spend: 980, income: 2450 },
      { label: "Jul", spend: 1120, income: 2600 },
      { label: "Aug", spend: 1050, income: 2450 },
    ],
    totalSpent: 3150,
    income: 7500,
    netFlow: 4350,
    avgDailySpend: 35,
    categories: [
      { category: "Food", amount: 960, percent: 30 },
      { category: "Shopping", amount: 720, percent: 23 },
      { category: "Transport", amount: 420, percent: 13 },
      { category: "Entertainment", amount: 390, percent: 12 },
      { category: "Bills", amount: 660, percent: 22 },
    ],
  },
  year: {
    points: [
      { label: "Jan", spend: 1050, income: 2450 },
      { label: "Feb", spend: 890, income: 2450 },
      { label: "Mar", spend: 1200, income: 2450 },
      { label: "Apr", spend: 970, income: 2450 },
      { label: "May", spend: 1080, income: 2450 },
      { label: "Jun", spend: 980, income: 2450 },
      { label: "Jul", spend: 1120, income: 2600 },
      { label: "Aug", spend: 1050, income: 2450 },
      { label: "Sep", spend: 940, income: 2450 },
      { label: "Oct", spend: 1010, income: 2450 },
      { label: "Nov", spend: 1150, income: 3200 },
      { label: "Dec", spend: 1300, income: 2450 },
    ],
    totalSpent: 12740,
    income: 30300,
    netFlow: 17560,
    avgDailySpend: 34.9,
    categories: [
      { category: "Food", amount: 3885, percent: 31 },
      { category: "Shopping", amount: 2915, percent: 23 },
      { category: "Transport", amount: 1700, percent: 13 },
      { category: "Entertainment", amount: 1575, percent: 12 },
      { category: "Bills", amount: 2665, percent: 21 },
    ],
  },
};
