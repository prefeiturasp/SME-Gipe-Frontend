import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardLayout from "@/app/dashboard/layout";
import { useUserStore } from "@/stores/useUserStore";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => "/dashboard",
}));

vi.mock("@/hooks/useMe", () => ({
    default: () => ({
        isLoading: false,
        isError: false,
    }),
}));

const queryClient = new QueryClient();

const mockUser = {
    username: "testuser",
    name: "Test User",
    email: "test@example.com",
    cpf: "123.456.789-00",
    rede: "SME",
    is_core_sso: false,
    is_validado: true,
    perfil_acesso: {
        codigo: 1,
        nome: "Perfil Teste",
    },
    unidades: [
        {
            ue: {
                codigo_eol: "123",
                nome: "UE Teste",
                sigla: "UET",
            },
            dre: {
                codigo_eol: "456",
                nome: "DRE Teste",
                sigla: "DRET",
            },
        },
    ],
};

beforeAll(() => {
    window.matchMedia = () =>
        ({
            matches: false,
            media: "",
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        } as unknown as MediaQueryList);
});

describe("DashboardLayout (layout.tsx)", () => {
    beforeEach(() => {
        useUserStore.setState({ user: mockUser });
    });

    afterEach(() => {
        useUserStore.setState({ user: null });
        vi.clearAllMocks();
    });

    it("renderiza sidebar, navbar e conteúdo corretamente", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <DashboardLayout>
                    <div data-testid="child">Conteúdo de teste</div>
                </DashboardLayout>
            </QueryClientProvider>
        );

        const child = screen.getByTestId("child");
        expect(child).toBeInTheDocument();

        expect(await screen.findByText(mockUser.name)).toBeInTheDocument();

        expect(screen.getByText(/sair/i)).toBeInTheDocument();

        expect(
            screen.getByText(/intercorrência institucional/i)
        ).toBeInTheDocument();
    });
});
