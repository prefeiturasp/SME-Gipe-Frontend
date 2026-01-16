import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import UnidadesEducacionais from "./page";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn().mockReturnValue(null),
    }),
}));

const queryClient = new QueryClient();

const renderWithProvider = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};

describe("Unidades educacionais page", () => {
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
