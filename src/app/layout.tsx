import ReactQueryProvider from "@/lib/ReactQueryProvider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner";

import "@/styles/globals.scss";

const roboto = Roboto({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "GIPE",
    description: "Gestão de Intercorrências de Proteção Escolar",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br">
            <body className={`${roboto.className} mx-auto !px-0`}>
                <ReactQueryProvider>{children}</ReactQueryProvider>
                <Toaster position="top-right" closeButton />
            </body>
        </html>
    );
}
