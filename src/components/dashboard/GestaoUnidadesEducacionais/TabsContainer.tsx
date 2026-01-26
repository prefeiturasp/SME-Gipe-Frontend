"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import ListaDeUnidadesEducacionais from "./ListaDeUnidadesEducacionais";

export default function TabsContainer() {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab");

    const defaultTab =
        tabParam === "ativas" || tabParam === "inativas" ? tabParam : "ativas";

    return (
        <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="justify-between w-full h-12 ">
                <TabsTrigger
                    className="flex items-center justify-between data-[state=active]:text-[--sidebar-accent-foreground] data-[state=active]:font-semibold"
                    value="ativas"
                >
                    Unidades Educacionais ativas
                </TabsTrigger>
                <TabsTrigger
                    className="flex items-center justify-between data-[state=active]:text-[--sidebar-accent-foreground] data-[state=active]:font-semibold"
                    value="inativas"
                >
                    Unidades Educacionais inativas
                </TabsTrigger>
            </TabsList>
            <TabsContent value="ativas">
                <ListaDeUnidadesEducacionais status="ativa" />
            </TabsContent>
            <TabsContent value="inativas">
                <ListaDeUnidadesEducacionais status="inativa" />
            </TabsContent>
        </Tabs>
    );
}
