import { CreditCard, LayoutGrid, LineChart, Send, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: LayoutGrid },
  { id: "cards", label: "Cards", icon: CreditCard },
  { id: "payments", label: "Payments", icon: Send },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "profile", label: "Profile", icon: UserRound },
];
