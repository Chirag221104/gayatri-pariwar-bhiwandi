import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Sans_Devanagari, Noto_Sans_Gujarati } from "next/font/google";
import "../globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { getMessages } from 'next-intl/server';
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  weight: ["400", "500", "600", "700", "900"]
});
const gujarati = Noto_Sans_Gujarati({
  subsets: ["gujarati"],
  variable: "--font-gujarati",
  weight: ["400", "500", "600", "700", "900"]
});

export const metadata: Metadata = {
  title: "Gayatri Pariwar Bhiwandi | Official Website",
  description: "Official website of Gayatri Pariwar Bhiwandi Branch. Awaken divinity within and experience spiritual growth through Yagya, Sanskars, and Sadhana.",
  keywords: ["Gayatri Pariwar", "Bhiwandi", "Mandir", "Spiritual", "Yagya", "Sadhana", "Shantikunj", "Pandit Shriram Sharma Acharya"],
  authors: [{ name: "Gayatri Pariwar Bhiwandi" }],
  verification: {
    google: "aR7nCM2EvLA3BLsieaex8TNpqAu7y6aTk8jGwGuY0s4",
  },
  openGraph: {
    title: "Gayatri Pariwar Bhiwandi",
    description: "Awakening Divinity in Human Beings",
    url: "https://gayatri-pariwar-bhiwandi.vercel.app",
    siteName: "Gayatri Pariwar Bhiwandi",
    images: [
      {
        url: "/masall.jpg",
        width: 800,
        height: 800,
        alt: "Gayatri Pariwar Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gayatri Pariwar Bhiwandi",
    description: "Awakening Divinity in Human Beings",
    images: ["/masall.jpg"],
  },
  icons: {
    icon: "/masall.jpg",
    apple: "/masall.jpg",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${devanagari.variable} ${gujarati.variable}`}>
      <body className="flex flex-col min-h-screen font-body bg-background text-foreground" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ReligiousOrganization',
              name: 'Gayatri Pariwar Bhiwandi',
              url: 'https://gayatri-pariwar-bhiwandi.vercel.app',
              logo: 'https://gayatri-pariwar-bhiwandi.vercel.app/masall.jpg',
              description: 'Awakening Divinity in Human Beings through Yagya, Sanskars, and Sadhana.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Bhiwandi',
                addressRegion: 'Maharashtra',
                addressCountry: 'IN'
              },
              sameAs: [
                'https://www.facebook.com/GayatriPariwarBhiwandi', // Example
                'https://www.instagram.com/gayatripariwarbhiwandi' // Example
              ]
            })
          }}
        />
        <Providers locale={locale} messages={messages}>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
