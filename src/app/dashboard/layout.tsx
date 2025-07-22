import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/Sidebar/app-sidebar";
import { Navbar } from "@/components/dashboard/Navbar/Navbar";
import { HydrationGuard } from "@/components/dashboard/HydrationGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <HydrationGuard>
            <div className="flex h-screen">
                <SidebarProvider>
                    <AppSidebar />
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <Navbar />
                        <main className="flex-1 overflow-auto bg-muted p-4">
                            {children}
                        </main>
                    </div>
                </SidebarProvider>
            </div>
        </HydrationGuard>
    );
}
