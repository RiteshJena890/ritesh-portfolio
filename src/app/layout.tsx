import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/content/profile";
import { MotionRoot } from "@/components/core/motion-root";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.title}, .NET, React and AI`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Ritesh Jena",
    "Software Consultant",
    "ASP.NET MVC developer",
    "React developer",
    "SQL Server",
    "Generative AI",
    "Agentic AI",
    "Bhubaneswar",
    "ITPlusPoint",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: site.url,
    siteName: site.name,
    title: `${site.name} · ${site.title}`,
    description: site.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.title}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#eceef1",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Runs before paint: applies a saved theme choice and flags motion support,
// so there is no flash of the wrong theme or of un-animated content.
const bootScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion');})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.title,
  worksFor: { "@type": "Organization", name: site.company },
  address: { "@type": "PostalAddress", addressLocality: "Bhubaneswar", addressRegion: "Odisha", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Synergy Institute of Technology" },
  email: `mailto:${site.email}`,
  url: site.url,
  sameAs: [site.linkedin, site.github].filter(Boolean),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-[var(--ink)] focus:px-5 focus:py-3 focus:text-[var(--bg)]">
          Skip to content
        </a>
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
