import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/Sidebar/app-sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen">
            <SidebarProvider>
                <AppSidebar />
                <main>{children}</main>
            </SidebarProvider>
        </div>
    );
}
