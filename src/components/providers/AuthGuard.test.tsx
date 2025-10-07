import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AuthGuard from "./AuthGuard";
import useMe from "@/hooks/useMe";
import { User, useUserStore } from "@/stores/useUserStore";

// Mocks
vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
}));

vi.mock("@/hooks/useMe", () => ({
    default: vi.fn(),
}));

vi.mock("@/stores/useUserStore");

vi.mock("@/components/ui/FullPageLoader", () => ({
    default: () => <div>FullPageLoader</div>,
}));

const mockRemoveQueries = vi.fn();
vi.mock("@tanstack/react-query", async (importOriginal) => {
    const actual = await importOriginal<
        typeof import("@tanstack/react-query")
    >();
    return {
        ...actual,
        useQueryClient: () => ({
            ...actual.useQueryClient(),
            removeQueries: mockRemoveQueries,
        }),
    };
});

const useMeMock = useMe as Mock;
const useRouterMock = useRouter as Mock;
const useUserStoreMock = useUserStore as unknown as Mock;

const mockPush = vi.fn();
const mockClearUser = vi.fn();

const TestChild = () => <div>Conteúdo Protegido</div>;

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

const renderWithProviders = (
    ui: React.ReactElement,
    queryClient: QueryClient
) => {
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};

describe("AuthGuard", () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient = createTestQueryClient();

        useRouterMock.mockReturnValue({ push: mockPush });
    });

    it("deve renderizar o FullPageLoader enquanto os dados do usuário estão carregando", () => {
        useMeMock.mockReturnValue({
            isLoading: true,
            isError: false,
            error: null,
        });
        useUserStoreMock.mockReturnValue({
            user: null,
            clearUser: mockClearUser,
        });

        renderWithProviders(
            <AuthGuard>
                <TestChild />
            </AuthGuard>,
            queryClient
        );

        expect(screen.getByText("FullPageLoader")).toBeInTheDocument();
        expect(
            screen.queryByText("Conteúdo Protegido")
        ).not.toBeInTheDocument();
    });

    it("deve renderizar o FullPageLoader se o carregamento terminar mas o usuário não estiver no store", () => {
        useMeMock.mockReturnValue({
            isLoading: false,
            isError: false,
            error: null,
        });
        useUserStoreMock.mockReturnValue({
            user: null,
            clearUser: mockClearUser,
        });

        renderWithProviders(
            <AuthGuard>
                <TestChild />
            </AuthGuard>,
            queryClient
        );

        expect(screen.getByText("FullPageLoader")).toBeInTheDocument();
        expect(
            screen.queryByText("Conteúdo Protegido")
        ).not.toBeInTheDocument();
    });

    it("deve redirecionar para /login e limpar o estado em caso de erro", async () => {
        const error = new Error("Não autorizado");
        useMeMock.mockReturnValue({ isLoading: false, isError: true, error });
        useUserStoreMock.mockReturnValue({
            user: null,
            clearUser: mockClearUser,
        });

        renderWithProviders(
            <AuthGuard>
                <TestChild />
            </AuthGuard>,
            queryClient
        );

        await waitFor(() => {
            expect(mockClearUser).toHaveBeenCalledTimes(1);
            expect(mockRemoveQueries).toHaveBeenCalledWith({
                queryKey: ["me"],
            });
            expect(mockPush).toHaveBeenCalledWith("/login");
        });

        expect(
            screen.queryByText("Conteúdo Protegido")
        ).not.toBeInTheDocument();
    });

    it("deve renderizar os filhos quando o usuário estiver autenticado", () => {
        const fakeUser: User = {
            name: "Usuário Teste",
            email: "teste@example.com",
            username: "teste.user",
            cpf: "111.222.333-44",
            rede: "SME",
            is_core_sso: false,
            is_validado: true,
            perfil_acesso: { codigo: 1, nome: "Padrão" },
            unidades: [],
        };

        useMeMock.mockReturnValue({
            isLoading: false,
            isError: false,
            error: null,
        });
        useUserStoreMock.mockReturnValue({
            user: fakeUser,
            clearUser: mockClearUser,
        });

        renderWithProviders(
            <AuthGuard>
                <TestChild />
            </AuthGuard>,
            queryClient
        );

        expect(screen.getByText("Conteúdo Protegido")).toBeInTheDocument();
        expect(screen.queryByText("FullPageLoader")).not.toBeInTheDocument();
    });
});
