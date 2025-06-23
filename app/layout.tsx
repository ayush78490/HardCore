import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/toaster"
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Analytics } from '@vercel/analytics/react' // ✅ Add this

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "HardCore Gaming - Play. Earn. Dominate",
    template: "%s | HardCore Gaming"
  },
  description: "Experience the future of gaming on Core blockchain with Hardcore Gaming platform",
  generator: 'Ayush Raj',
  keywords: [
    'gaming',
    'blockchain games',
    'web3 gaming',
    'Core blockchain',
    'play to earn',
    'hardcore gaming'
  ],
  authors: [{ name: 'Ayush Raj' }],
  icons: {
    icon: [
      { url: "/logo/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/logo/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/logo/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: "/logo/favicon-180x180.png",
  },
  manifest: "/logo/site.webmanifest",
  openGraph: {
    title: "HardCore Gaming - Play. Earn. Dominate",
    description: "Experience the future of gaming on Core blockchain with Hardcore Gaming platform",
    url: "https://yourdomain.com",
    siteName: "HardCore Gaming",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HardCore Gaming - Play. Earn. Dominate",
    description: "Experience the future of gaming on Core blockchain with Hardcore Gaming platform",
    creator: "@yourtwitter",
    images: ["https://yourdomain.com/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: '#f97316',
              colorTextOnPrimaryBackground: '#ffffff',
              colorTextSecondary: '#94a3b8',
              colorBackground: '#111827',
              colorInputBackground: '#1f2937',
              colorInputText: '#f8fafc',
            },
            elements: {
              formButtonPrimary: 'bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors',
              formButtonSecondary: 'bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors',
              card: 'bg-gray-900 border border-gray-700 rounded-xl shadow-lg',
              headerTitle: 'text-white font-bold text-2xl',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton: 'border-gray-700 hover:bg-gray-800 text-white transition-colors',
              dividerLine: 'bg-gray-700',
              formFieldInput: 'bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-lg transition-all',
              formFieldLabel: 'text-gray-300',
              footerActionLink: 'text-orange-400 hover:text-orange-300 transition-colors',
              footerActionText: 'text-gray-400',
              logoImage: 'filter brightness-0 invert',
              userButtonPopoverCard: 'bg-gray-900 border border-gray-700',
            }
          }}
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          {children}
          <Toaster />
          <Analytics /> 
        </ClerkProvider>
      </body>
    </html>
  )
}
