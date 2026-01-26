import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import GestaoUsuarios from "./page";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn(() => null),
    }),
}));

const queryClient = new QueryClient();

const renderWithProvider = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};

describe("Perfil de usuário page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza conteúdo da página de Perfil de usuário", async () => {
        renderWithProvider(<GestaoUsuarios />);

        await waitFor(() => {
            expect(
                screen.getByText(
                    /Confira os perfis ativos, inativos e pendentes de aprovação. Selecione a opção desejada nas abas./i
                )
            ).toBeInTheDocument();
        });
    });
});
