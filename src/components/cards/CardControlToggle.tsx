import type { LucideIcon } from "lucide-react";

import { Switch } from "./Switch";

interface CardControlToggleProps {
  icon: LucideIcon;
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

export function CardControlToggle({ icon: Icon, label, description, checked, onChange }: CardControlToggleProps) {
  return (
    <div className="flex items-center gap-3.5 border-b border-border py-3.5 last:border-b-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-raised text-foreground/80">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-small font-medium text-foreground">{label}</span>
        <span className="font-mono text-caption text-muted">{description}</span>
      </div>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}
