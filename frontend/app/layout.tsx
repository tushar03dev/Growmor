"use client"

import "@/styles/globals.css"
import type { ReactNode } from "react"
import {ThemeProvider} from "@/components/theme-provider";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
        </ThemeProvider>
        </body>
        </html>
    )
}
