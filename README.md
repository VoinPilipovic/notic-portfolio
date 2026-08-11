This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Replacing Beta Content

Every piece of copy and every visual after the Hero is beta placeholder,
written to look and feel like the real thing rather than an obvious
"TODO" - but it's all real project data, isolated so it's a data edit,
not a design edit. Nothing about the layout, animation or component
structure needs to change to swap it for real content.

| What | File | Notes |
|---|---|---|
| Project copy (NOIR / VELOCITY / FORMA) | `src/data/projects.ts` | title, subtitle, role, year, tech, concept, `tone`/`accent` colors |
| Project hero images | `src/data/projects.ts` → `image`, files in `public/assets/work/` | Replace the `.svg` browser mockups with real photography or a video loop (swap `<GlassImage>` for a `<video>` element in `FeaturedProject.tsx` / `ProjectChapter.tsx` if using video) |
| NOIR case study (5 stages) | `src/data/caseStudy.ts` | `noirCaseStudy` - stage copy + artifact chips |
| Personal story timeline | `src/data/timeline.ts` | Seven milestones - year label doubles as an index, not a real date |
| Capabilities Lab entries | `src/data/capabilities.ts` | Title, description, tool list per capability |
| Working philosophy steps | `src/data/workflow.ts` | The five-stage diagram in `Philosophy.tsx` |
| NOTIC LAB experiment labels | `src/data/experiments.ts` | Metadata only - each experiment's actual preview lives in `src/components/sections/Lab/experiments/` |
| Bio / personal details | `src/data/bio.ts` | Name, role, location, background, availability, intro copy |
| Portrait | `src/components/sections/About/PortraitMark.tsx` | Currently a monogram mark - swap the whole panel for a real portrait `<Image>` |
| Social links + contact email | `src/data/socials.ts` | Also update the `mailto:` addresses hardcoded in `Contact.tsx` and `layout.tsx` metadata |
| Site metadata | `src/app/layout.tsx` | `<title>` / description |

The floating language toggle (`EN`/`FR`) is a visual placeholder only -
there is no i18n content pipeline yet, so it doesn't switch copy.
