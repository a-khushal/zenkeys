"use client"

import { ThemeProvider } from "./components/themeProvider"

export default function Provider({ children }: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    )
}