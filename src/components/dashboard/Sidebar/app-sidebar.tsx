// src/components/dashboard/Sidebar/app-sidebar.tsx
"use client";

import Alert from "@/assets/icons/Alert";
import Bars from "@/assets/icons/Bars";
import Export from "@/assets/icons/Export";
import Gestao from "@/assets/icons/Gestao";
import User from "@/assets/icons/User";
import LogoGipeNome from "@/assets/images/logo-gipe-nome.webp";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import * as React from "react";
import { SidebarLink } from "./SidebarLink";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

import { useUserPermissions } from "@/hooks/useUserPermissions";

type NavItem = {
    title: string;
    url?: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children?: {
        title: string;
        url: string;
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
    }[];
};

const items: NavItem[] = [
    {
        title: "Intercorrência institucional",
        url: "/dashboard",
        icon: Alert,
    },
    {
        title: "Meus dados",
        url: "/dashboard/meus-dados",
        icon: User,
    },
    {
        title: "Gestão",
        icon: Gestao,
        children: [
            {
                title: "Gestão de perfis",
                url: "/dashboard/gestao-usuarios",
                icon: Gestao,
            },
            {
                title: "Gestão de Unidades Educacionais",
                url: "/dashboard/gestao-unidades-educacionais",
                icon: Gestao,
            },
            {
                title: "Relatórios",
                url: "/dashboard/relatorios",
                icon: Export,
            },
        ],
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const { open } = useSidebar(); // estado do sidebar (expandido/recolhido)
    const [openCollapsible, setOpenCollapsible] = React.useState(false);

    const { isGipe, isGipeAdmin } = useUserPermissions();

    const filteredItems = React.useMemo(
        () =>
            items
                .filter((item) => isGipeAdmin || item.title !== "Gestão")
                .map((item) =>
                    item.children
                        ? {
                              ...item,
                              children: item.children.filter(
                                  (child) =>
                                      child.title !== "Relatórios" ||
                                      (isGipe && isGipeAdmin),
                              ),
                          }
                        : item,
                ),
        [isGipeAdmin, isGipe],
    );

    return (
        <Sidebar
            className="bg-[--sidebar-background] text-[--sidebar-foreground] w-[--sidebar-width]"
            collapsible="icon"
            {...props}
        >
            <SidebarHeader>
                <SidebarTrigger logo={LogoGipeNome} />
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup className={open ? "p-2" : "p-1"}>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.map((item) => {
                                const hasChildren =
                                    !!item.children && item.children.length > 0;

                                const isActive = item.url
                                    ? pathname === item.url
                                    : false;
                                const isChildActive = hasChildren
                                    ? item.children!.some((child) =>
                                          pathname.startsWith(child.url),
                                      )
                                    : false;

                                // ESTILOS BASE
                                const simpleItemClasses = cn(
                                    isActive
                                        ? "bg-[--sidebar-accent]"
                                        : "bg-[--sidebar-accent-foreground] mb-1",
                                    open
                                        ? "w-[--sidebar-item-width] h-[--sidebar-item-height] flex flex-col items-center"
                                        : "h-[--sidebar-item-height-collapsed] w-[--sidebar-item-width-collapsed] flex flex-col items-center justify-center",
                                );

                                const parentItemClasses = cn(
                                    isActive || isChildActive || openCollapsible
                                        ? "bg-[--sidebar-accent] text[#000]"
                                        : "bg-[--sidebar-accent-foreground] mb-1",
                                    open
                                        ? "w-[--sidebar-item-width] flex flex-col items-stretch"
                                        : "w-[--sidebar-item-width-collapsed] flex flex-col items-stretch p-1!",
                                );

                                // CARD DO CABEÇALHO "Gestão"
                                const parentHeaderClasses = cn(
                                    isActive || isChildActive || openCollapsible
                                        ? "bg-[--sidebar-accent]"
                                        : "bg-[--sidebar-accent-foreground]",
                                );

                                // ---------------- ITEM SIMPLES ----------------
                                if (!hasChildren) {
                                    return (
                                        <SidebarMenuItem
                                            key={item.title}
                                            className={simpleItemClasses}
                                        >
                                            <SidebarMenuButton asChild>
                                                <SidebarLink
                                                    href={item.url!}
                                                    icon={item.icon}
                                                    title={item.title}
                                                    active={isActive}
                                                    rightIcon={Bars}
                                                />
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                }

                                // --------------- ITEM COM SUBITENS (Gestão) ---------------

                                return (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={isChildActive}
                                        open={openCollapsible}
                                        onOpenChange={setOpenCollapsible}
                                    >
                                        <SidebarMenuItem
                                            className={parentItemClasses}
                                        >
                                            {/* Cabeçalho "Gestão" */}
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    asChild
                                                    className={
                                                        parentHeaderClasses +
                                                        " w-full"
                                                    }
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="flex items-center gap-2">
                                                            <SidebarLink
                                                                href="#"
                                                                icon={item.icon}
                                                                title={
                                                                    item.title
                                                                }
                                                                active={
                                                                    isActive ||
                                                                    isChildActive ||
                                                                    openCollapsible
                                                                }
                                                                rightIcon={Bars}
                                                            />
                                                        </div>
                                                        {open && (
                                                            <>
                                                                {openCollapsible ? (
                                                                    <ChevronUp
                                                                        data-testid="chevron-up"
                                                                        className={cn(
                                                                            (isChildActive ||
                                                                                openCollapsible) &&
                                                                                "stroke-[--sidebar-accent-foreground]",
                                                                        )}
                                                                    />
                                                                ) : (
                                                                    <ChevronDown
                                                                        data-testid="chevron-down"
                                                                        className={cn(
                                                                            (isChildActive ||
                                                                                openCollapsible) &&
                                                                                "stroke-[--sidebar-accent-foreground]",
                                                                        )}
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>

                                            {/* Subitens */}
                                            <CollapsibleContent className="w-full">
                                                <SidebarMenu
                                                    className={cn(
                                                        open
                                                            ? "mt-2 w-full"
                                                            : "mt-1 w-full",
                                                    )}
                                                >
                                                    {item.children!.map(
                                                        (child) => {
                                                            const isChildRouteActive =
                                                                pathname.startsWith(
                                                                    child.url,
                                                                );

                                                            return (
                                                                <SidebarMenuItem
                                                                    key={
                                                                        child.title
                                                                    }
                                                                    className={cn(
                                                                        "w-full bg-[--sidebar-accent] border-t border-gray-100 min-h-[48px] flex items-center",
                                                                        open &&
                                                                            "px-6",
                                                                    )}
                                                                >
                                                                    <SidebarMenuButton
                                                                        asChild
                                                                    >
                                                                        <SidebarLink
                                                                            href={
                                                                                child.url
                                                                            }
                                                                            title={
                                                                                child.title
                                                                            }
                                                                            active={
                                                                                isChildRouteActive
                                                                            }
                                                                            subItem
                                                                        />
                                                                    </SidebarMenuButton>
                                                                </SidebarMenuItem>
                                                            );
                                                        },
                                                    )}
                                                </SidebarMenu>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}
