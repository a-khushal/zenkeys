"use client"

import { RecoilRoot } from "recoil"
import { ThemeProvider } from "./components/themeProvider"

export default function Provider({ children }: {
    children: React.ReactNode
}) {
    return (
        <RecoilRoot>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </RecoilRoot>
    )
}