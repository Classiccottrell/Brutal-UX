import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { InkProvider } from "@/components/ink-provider"
import { InkToggle } from "@/components/ink-toggle"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "BRUTAL UX",
  description: "Utility is the only aesthetic.",
}

// Runs before hydration so the stored ink (black/cobalt) paints on first
// frame instead of flashing the default and then swapping.
const INK_BLOCKING_SCRIPT = `(function(){try{if(localStorage.getItem("brutal-ink")==="cobalt"){document.documentElement.dataset.ink="cobalt"}}catch(e){}})();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", "font-mono")}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INK_BLOCKING_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <InkProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <InkToggle />
          </InkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
