
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListaDeUnidadesEducacionais from "./ListaDeUnidadesEducacionais";

export default function TabsContainer() {
    return (
        <Tabs defaultValue="ativas" className="w-full">
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
                <ListaDeUnidadesEducacionais status="ativas" />
            </TabsContent>
            <TabsContent value="inativas">
                <ListaDeUnidadesEducacionais status="inativas" />
            </TabsContent>
        </Tabs>
    )
}
