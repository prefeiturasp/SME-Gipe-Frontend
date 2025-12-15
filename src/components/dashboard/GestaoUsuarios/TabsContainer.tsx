"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ListaDeUsuarios from "./ListaDeUsuarios";
import ListaDeUsuariosPendenciasAprovacao from "./ListaDeUsuariosPendenciasAprovacao";

import { useGetUsuarios } from "@/hooks/useGetUsuarios";

export default function TabsContainer() {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab");

    const {
        data: usuarios,
        isLoading,
        isError,
        error,
    } = useGetUsuarios(undefined, undefined, undefined, true);

    const pendenciasDeAprovacaoCount = useMemo(
        () => usuarios?.length ?? 0,
        [usuarios]
    );

    const defaultTab =
        tabParam === "ativos" || tabParam === "inativos"
            ? tabParam
            : "pendencias";

    return (
        <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="justify-between w-full h-12 ">
                <TabsTrigger
                    className="flex items-center justify-between data-[state=active]:text-[--sidebar-accent-foreground] data-[state=active]:font-semibold"
                    value="pendencias"
                >
                    Pendências de aprovação{" "}
                    <Badge
                        variant="destructive"
                        className="h-5 min-w-5 rounded-full px-2"
                    >
                        {pendenciasDeAprovacaoCount}
                    </Badge>
                </TabsTrigger>
                <TabsTrigger
                    className="flex items-center justify-between data-[state=active]:text-[--sidebar-accent-foreground] data-[state=active]:font-semibold"
                    value="ativos"
                >
                    Usuários ativos
                </TabsTrigger>
                <TabsTrigger
                    className="flex items-center justify-between data-[state=active]:text-[--sidebar-accent-foreground] data-[state=active]:font-semibold"
                    value="inativos"
                >
                    Usuários inativos
                </TabsTrigger>
            </TabsList>
            <TabsContent value="pendencias">
                <ListaDeUsuariosPendenciasAprovacao
                    usuarios={usuarios}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                />
            </TabsContent>
            <TabsContent value="ativos">
                <ListaDeUsuarios status="ativos" />
            </TabsContent>
            <TabsContent value="inativos">
                <ListaDeUsuarios status="inativos" />
            </TabsContent>
        </Tabs>
    );
}
