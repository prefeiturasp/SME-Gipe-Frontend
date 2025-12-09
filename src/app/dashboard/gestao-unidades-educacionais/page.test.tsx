import { render, screen, waitFor } from "@testing-library/react";
import UnidadesEducacionais from "./page";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
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

    it("renderiza conteúdo da página de Unidades Educacionais", async () => {
        renderWithProvider(<UnidadesEducacionais />);

        await waitFor(() => {
            expect(
                screen.getByText(/Gestão de Unidades Educacionais/i)
            ).toBeInTheDocument();
        });
    });
});
