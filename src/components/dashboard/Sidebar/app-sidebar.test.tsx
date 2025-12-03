import { render, screen, waitFor } from "@testing-library/react";
import { AppSidebar } from "./app-sidebar";
import { usePathname } from "next/navigation";
import * as sidebarUi from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import userEvent from "@testing-library/user-event";

vi.mock("@/assets/images/logo-gipe-nome.webp", () => ({
    default: {
        src: "/logo-gipe-nome.webp",
        height: 40,
        width: 120,
    },
}));

vi.mock("next/navigation", () => ({
    usePathname: vi.fn(),
}));

vi.spyOn(sidebarUi, "useSidebar").mockReturnValue({
    state: "expanded",
    open: true,
    setOpen: () => {},
    openMobile: false,
    setOpenMobile: () => {},
    isMobile: false,
    toggleSidebar: () => {},
});

beforeAll(() => {
    window.matchMedia = (query: string) =>
        ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => {},
        } as unknown as MediaQueryList);
});

describe("AppSidebar", () => {
    beforeEach(() => {
        (usePathname as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
            "/dashboard"
        );
    });

    const renderWithProvider = (ui: React.ReactNode) =>
        render(<SidebarProvider>{ui}</SidebarProvider>);

    it("renderiza os itens do menu e destaca o ativo", () => {
        renderWithProvider(<AppSidebar />);
        expect(
            screen.getByText("Intercorrência institucional")
        ).toBeInTheDocument();
        expect(screen.getByText("Meus dados")).toBeInTheDocument();
        expect(
            screen
                .getByText("Intercorrência institucional")
                .closest(".bg-[--sidebar-accent]")
        );
        expect(screen.getByTestId("icon-alert")).toBeInTheDocument();
        expect(screen.getByTestId("icon-user")).toBeInTheDocument();
    });

    it("destaca o menu correto conforme a rota", () => {
        (usePathname as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
            "/meus-dados"
        );
        renderWithProvider(<AppSidebar />);
        expect(
            screen.getByText("Meus dados").closest(".bg-[--sidebar-accent]")
        );
    });

    it("renderiza corretamente quando a sidebar está fechada (collapsed)", () => {
        vi.spyOn(sidebarUi, "useSidebar").mockReturnValue({
            state: "collapsed",
            open: false,
            setOpen: () => {},
            openMobile: false,
            setOpenMobile: () => {},
            isMobile: false,
            toggleSidebar: () => {},
        });
        renderWithProvider(<AppSidebar />);
        expect(screen.getByTestId("icon-alert")).toBeInTheDocument();
        expect(
            screen.getByText("Intercorrência institucional")
        ).toBeInTheDocument();
        expect(screen.getByTestId("icon-user")).toBeInTheDocument();
        expect(screen.getByText("Meus dados")).toBeInTheDocument();
    });

    it("renderiza o menu Gestão e seus subitens quando expandido", () => {
        vi.spyOn(sidebarUi, "useSidebar").mockReturnValue({
            state: "expanded",
            open: true,
            setOpen: () => {},
            openMobile: false,
            setOpenMobile: () => {},
            isMobile: false,
            toggleSidebar: () => {},
        });
        renderWithProvider(<AppSidebar />);
        expect(screen.getByText("Gestão")).toBeInTheDocument();
    });

    it("renderiza ChevronDown quando o collapsible está fechado", () => {
        vi.spyOn(sidebarUi, "useSidebar").mockReturnValue({
            state: "expanded",
            open: true,
            setOpen: () => {},
            openMobile: false,
            setOpenMobile: () => {},
            isMobile: false,
            toggleSidebar: () => {},
        });
        renderWithProvider(<AppSidebar />);
        const chevronDown = screen.getByTestId("chevron-down");
        expect(chevronDown).toBeInTheDocument();
    });

    it("renderiza ChevronUp quando o collapsible está aberto", async () => {
        vi.spyOn(sidebarUi, "useSidebar").mockReturnValue({
            state: "expanded",
            open: true,
            setOpen: () => {},
            openMobile: false,
            setOpenMobile: () => {},
            isMobile: false,
            toggleSidebar: () => {},
        });
        const user = userEvent.setup();
        renderWithProvider(<AppSidebar />);

        const gestaoButton = screen.getByText("Gestão");
        await user.click(gestaoButton);

        const chevronUp = screen.getByTestId("chevron-up");
        expect(chevronUp).toBeInTheDocument();

        // Verifica se os subitens estão visíveis
        expect(screen.getByText("Gestão de pessoa usuária")).toBeInTheDocument();
        expect(screen.getByText("Gestão de Unidades Educacionais")).toBeInTheDocument();
    });

    it("aplica a classe correta no ChevronUp quando isChildActive é true", async () => {
        vi.spyOn(sidebarUi, "useSidebar").mockReturnValue({
            state: "expanded",
            open: true,
            setOpen: () => {},
            openMobile: false,
            setOpenMobile: () => {},
            isMobile: false,
            toggleSidebar: () => {},
        });
        (usePathname as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
            "/dashboard/gestao/pessoa-usuaria"
        );
        const user = userEvent.setup();
        renderWithProvider(<AppSidebar />);

        // Clica para abrir o collapsible
        const gestaoButton = screen.getByText("Gestão");
        await user.click(gestaoButton);

        const chevronUp = screen.getByTestId("chevron-up");
        expect(chevronUp).toBeInTheDocument();
        expect(chevronUp).toHaveClass("stroke-[--sidebar-accent-foreground]");
    });

    it("aplica a classe correta no ChevronDown quando isChildActive é false", () => {
        vi.spyOn(sidebarUi, "useSidebar").mockReturnValue({
            state: "expanded",
            open: true,
            setOpen: () => {},
            openMobile: false,
            setOpenMobile: () => {},
            isMobile: false,
            toggleSidebar: () => {},
        });
        (usePathname as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
            "/dashboard"
        );
        renderWithProvider(<AppSidebar />);

        const chevronDown = screen.getByTestId("chevron-down");
        expect(chevronDown).toBeInTheDocument();
        expect(chevronDown).not.toHaveClass("stroke-[--sidebar-accent-foreground]");
    });

    it("renderiza os subitens de Gestão quando o collapsible é aberto", async () => {
        vi.spyOn(sidebarUi, "useSidebar").mockReturnValue({
            state: "expanded",
            open: true,
            setOpen: () => {},
            openMobile: false,
            setOpenMobile: () => {},
            isMobile: false,
            toggleSidebar: () => {},
        });
        (usePathname as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
            "/dashboard"
        );
        const user = userEvent.setup();
        renderWithProvider(<AppSidebar />);

        const gestaoButton = screen.getByText("Gestão");
        await user.click(gestaoButton);

        await waitFor(() => {
            expect(screen.getByText("Gestão de pessoa usuária")).toBeInTheDocument();
            expect(screen.getByText("Gestão de Unidades Educacionais")).toBeInTheDocument();
        });
    });
});
