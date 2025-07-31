"use client";

import * as React from "react";
import Alert from "@/assets/icons/Alert";
import User from "@/assets/icons/User";
import Bars from "@/assets/icons/Bars";
import { cn } from "@/lib/utils";
import { SidebarLink } from "./SidebarLink";
import { usePathname } from "next/navigation";
import LogoGipeNome from "@/assets/images/logo-gipe-nome.webp";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";

const items = [
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
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    const { open } = useSidebar();
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
                <SidebarGroup className={`${open ? "p-2" : "p-1"}`}>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname === item.url;

                                return (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className={cn(
                                            isActive
                                                ? "bg-[--sidebar-accent]"
                                                : "bg-[--sidebar-accent-foreground]",
                                            open
                                                ? "w-[--sidebar-item-width]"
                                                : "h-[--sidebar-item-height-collapsed] w-[--sidebar-item-width-collapsed] flex flex-col items-center justify-center"
                                        )}
                                    >
                                        <SidebarMenuButton asChild>
                                            <SidebarLink
                                                href={item.url}
                                                icon={item.icon}
                                                title={item.title}
                                                active={isActive}
                                                rightIcon={Bars}
                                            />
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
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
