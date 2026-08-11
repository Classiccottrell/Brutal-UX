import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { InkProvider } from "@/components/ink-provider"
import { InkToggle } from "@/components/ink-toggle"
import { CommentModeProvider } from "@/components/comment-mode-provider"
import { CommentModeToggle } from "@/components/comment-mode-toggle"
import { CommentPinPopoverHost } from "@/components/comment-pin-popover-host"
import { PinDataProvider } from "@/components/pin-data-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { COMMENTS_CONFIG } from "@/lib/comments/config"
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
            <CommentModeProvider>
              <PinDataProvider
                giscusHost={COMMENTS_CONFIG.giscusHost}
                repo={COMMENTS_CONFIG.repo}
                category={COMMENTS_CONFIG.category}
                strict={COMMENTS_CONFIG.strict}
              >
                <TooltipProvider>{children}</TooltipProvider>
                <InkToggle />
                <CommentModeToggle />
                <CommentPinPopoverHost />
              </PinDataProvider>
            </CommentModeProvider>
          </InkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
