import type { Account } from "@/types/banking";

interface AccountPanelProps {
  account: Account;
}

/** Real account metadata (IBAN, holder, currency) that had a typed field
 * in the mock data but nowhere to appear - fills the desktop rail with
 * genuinely useful information instead of empty space, not a filler card. */
export function AccountPanel({ account }: AccountPanelProps) {
  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: "Holder", value: account.holderName },
    { label: "IBAN", value: account.iban, mono: true },
    { label: "Currency", value: account.currency },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <span className="font-mono text-caption uppercase tracking-widest text-muted">Account</span>
      <dl className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="text-small text-muted">{row.label}</dt>
            <dd className={row.mono ? "font-mono text-caption tabular text-foreground" : "text-small text-foreground"}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
