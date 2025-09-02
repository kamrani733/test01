import type React from "react";
import "@/app/_styles/globals.css";
import localFont from "next/font/local";
import { type Locale } from "@/core/lib/dict";
import { Toaster } from "@/components/ui/sonner";
import { AuthInitializer } from "@/components/account/AuthInitializer";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Metadata } from "next";
import { getSettings } from "@/core/lib/api/main/setting";
import ClientQueryProvider from "@/core/lib/queryClient";

// Persian fonts
const iranYekanBold = localFont({
  src: "../../../public/fonts/IRANYekanXFaNum-DemiBold.woff2",
  variable: "--font-primary-bold",
  display: "swap",
});

const iranYekan = localFont({
  src: "../../../public/fonts/IRANYekanXFaNum-Light.woff2",
  variable: "--font-primary",
  display: "swap",
});

// English fonts
const NeueMontrealMedium = localFont({
  src: "../../../public/fonts/NeueMontreal-Medium.otf",
  variable: "--font-primary-bold",
  display: "swap",
});

const NeueMontreal = localFont({
  src: "../../../public/fonts/NeueMontreal-Regular.otf",
  variable: "--font-primary",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: {
      default: settings?.site_title || "Eram Home",
      template: `%s | ${settings?.site_title || "Eram Home"}`,
    },
    description: settings?.meta_description || "Eram Home Description",
    icons: {
      icon: settings?.fav_icon,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;

  const fontClassName =
    lang === "en"
      ? `${NeueMontreal.variable} ${NeueMontrealMedium.variable}`
      : `${iranYekan.variable} ${iranYekanBold.variable}`;

  return (
    <html lang={lang} dir={lang === "en" ? "ltr" : "rtl"}>
      <body className={`${fontClassName} antialiased`}>
        <ClientQueryProvider>
          <NuqsAdapter>
            <AuthInitializer>{children}</AuthInitializer>
            <Toaster theme="light" position="top-center" richColors />
          </NuqsAdapter>
        </ClientQueryProvider>
      </body>
    </html>
  );
}
