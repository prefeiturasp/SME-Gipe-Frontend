import Header from "@/components/dashboard/Gestao/Header";
import PageHeader from "@/components/dashboard/PageHeader/PageHeader";
import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import React from "react";
export default function GestaoLayout({
    children,
}: {
    readonly children: React.ReactNode;
}) {
    return (
        <main className="flex-1 bg-muted pt-4">
            <PageHeader title="Gestão de usuários" showBackButton={false} />
            <QuadroBranco>
                <Header />
            </QuadroBranco>
            {children}
        </main>
    );
}
