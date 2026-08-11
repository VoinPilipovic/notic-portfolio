import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Show the trailing arrow glyph and its hover nudge. Defaults to true for "primary". */
  showArrow?: boolean;
}

const baseStyles =
  "group relative inline-flex w-fit items-center gap-2 pb-1 text-small tracking-wide transition-colors duration-[var(--duration-base)] ease-out-expo focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent after:absolute after:inset-x-0 after:bottom-0 after:h-px after:transition-colors after:duration-[var(--duration-base)] after:ease-out-expo";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "font-medium text-foreground after:bg-accent hover:text-accent-hover after:hover:bg-accent-hover",
  secondary: "text-muted after:bg-border hover:text-foreground hover:after:bg-accent",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", showArrow = variant === "primary", type = "button", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
        {showArrow && (
          <span
            aria-hidden
            className="inline-block transition-transform duration-[var(--duration-base)] ease-out-expo group-hover:translate-x-1"
          >
            &#8594;
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
