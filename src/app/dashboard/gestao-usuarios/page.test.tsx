import { render, screen, waitFor } from "@testing-library/react";
import GestaoUsuarios from "./page";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

describe("Pessoa Usuária page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza conteúdo da página de Pessoa Usuária", async () => {
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
