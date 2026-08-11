export interface SocialLink {
  label: string;
  href: string;
}

// Replace hrefs with real profile URLs and the email with a real inbox -
// see README "Replacing Beta Content".
export const socials: SocialLink[] = [
  { label: "Email", href: "mailto:hello@notic.dev" },
  { label: "Instagram", href: "https://instagram.com/notic" },
  { label: "LinkedIn", href: "https://linkedin.com/in/notic" },
  { label: "GitHub", href: "https://github.com/notic" },
];
