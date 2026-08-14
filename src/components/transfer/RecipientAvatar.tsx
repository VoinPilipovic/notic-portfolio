import type { Recipient } from "@/types/banking";
import { cn } from "@/lib/utils";

interface RecipientAvatarProps {
  recipient: Recipient;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES: Record<NonNullable<RecipientAvatarProps["size"]>, string> = {
  sm: "h-9 w-9 text-caption",
  md: "h-12 w-12 text-small",
  lg: "h-16 w-16 text-h2",
};

/** Initials on a restrained, consistent tone - a generated identity, never
 * a photo, and never a different hue per person (no rainbow of avatars). */
export function RecipientAvatar({ recipient, size = "md", className }: RecipientAvatarProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised font-display font-bold text-accent-hover",
        SIZES[size],
        className
      )}
    >
      {recipient.initials}
    </span>
  );
}
