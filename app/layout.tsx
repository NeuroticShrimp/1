import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/query-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeSwitcher } from '@/components/theme-switcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pokédex App',
  description: 'A comprehensive Pokemon app with caching',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="pokemon-theme" sdfg1>
          <QueryProvider>
            <div className="fixed top-4 right-4 z-50">
              <ThemeSwitcher />
            </div>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
