import type { Metadata, Viewport } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NavigationDock } from "@/components/navigation-dock"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/sonner"

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

// ─── SEO: Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL("https://zorvyn.finance"),
  title: {
    default: "Zorvyn – Finance Dashboard",
    template: "%s | Zorvyn",
  },
  description:
    "A clean, interactive finance dashboard to track spending, view insights, and manage transactions.",
  keywords: [
    "finance dashboard",
    "expense tracker",
    "budget management",
    "income tracking",
    "financial insights",
    "personal finance",
  ],
  authors: [{ name: "Ashutosh Kumar" }],
  creator: "Ashutosh Kumar",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://zorvyn.finance",
    siteName: "Zorvyn Finance",
    title: "Zorvyn – Finance Dashboard",
    description:
      "Track spending, view insights, and manage transactions with a modern finance dashboard.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zorvyn – Finance Dashboard",
    description:
      "Track spending, view insights, and manage transactions with a modern finance dashboard.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// ─── Viewport (exported separately in Next.js 16) ─────────────────────────────

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Zorvyn Finance Dashboard",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "A clean, interactive finance dashboard to track spending, view insights, and manage transactions.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    author: {
      "@type": "Person",
      name: "Ashutosh Kumar",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// ─── Root Layout (Server Component) ───────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <JsonLd />
        <link rel="canonical" href="https://zorvyn.finance" />
      </head>
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {/* ─── App Shell: Dock + Content ─────────────────────────── */}
            <div className="flex h-screen flex-col sm:flex-row">
              {/* Left dock (desktop) / bottom bar (mobile) */}
              <NavigationDock />

              {/* Main content area */}
              <div className="flex flex-1 flex-col overflow-hidden sm:ml-16 mb-14 sm:mb-0">
                <Header />
                <main className="flex-1 overflow-auto p-4 md:p-6">
                  {children}
                </main>
              </div>
            </div>
          </TooltipProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}

