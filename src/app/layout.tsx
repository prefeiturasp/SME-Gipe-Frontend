import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import ReactQueryProvider from "@/lib/ReactQueryProvider";

import "@/styles/globals.scss";

const roboto = Roboto({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "GIPE",
    description: "Gabinete integrado de Proteção Escolar",
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
            </body>
        </html>
    );
}
