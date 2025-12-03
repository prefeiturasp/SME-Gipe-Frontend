import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ListaDeUsuarios from "./ListaDeUsuarios";

export default function TabsContainer() {
    return (
        <Tabs defaultValue="pendencias" className="w-full">
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
                        9
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
                Aqui as Pendências de aprovação
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
