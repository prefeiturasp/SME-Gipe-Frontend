import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import Dashboard from "./page";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
}));
vi.mock("@/hooks/useOcorrencias", () => ({
    useOcorrencias: () => ({
        data: [],
        isLoading: false,
        isError: false,
    }),
}));

vi.mock("@/hooks/useUserPermissions", () => ({
    useUserPermissions: vi.fn(),
}));

vi.mock("@/hooks/useTiposOcorrencia", () => ({
    useTiposOcorrencia: () => ({
        data: [],
        isLoading: false,
        isError: false,
    }),
}));

vi.mock("@/hooks/useUnidades", () => ({
    useFetchDREs: () => ({
        data: [],
        isLoading: false,
        isError: false,
    }),
    useFetchTodasUEs: () => ({
        data: [],
        isLoading: false,
        isError: false,
    }),
}));

import { useUserPermissions } from "@/hooks/useUserPermissions";

const queryClient = new QueryClient();

const renderWithProvider = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};

describe("Dashboard page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza conteúdo protegido", async () => {
        (useUserPermissions as Mock).mockReturnValue({
            isAssistenteOuDiretor: true,
            isGipe: false,
            isPontoFocal: false,
            isGipeAdmin: false,
        });

        renderWithProvider(<Dashboard />);

        await waitFor(() => {
            expect(
                screen.getByText(/intercorrências institucionais/i)
            ).toBeInTheDocument();
        });
    });

    it("deve exibir Header com botão Nova ocorrência para perfil assistente ou diretor", async () => {
        (useUserPermissions as Mock).mockReturnValue({
            isAssistenteOuDiretor: true,
            isGipe: false,
            isPontoFocal: false,
            isGipeAdmin: false,
        });

        renderWithProvider(<Dashboard />);

        await waitFor(() => {
            expect(
                screen.getByText(
                    /Para registrar uma nova intercorrência institucional/i
                )
            ).toBeInTheDocument();
        });

        expect(
            screen.getByRole("link", { name: /Nova ocorrência/i })
        ).toBeInTheDocument();
    });

    it("não deve exibir Header para perfil GIPE", async () => {
        (useUserPermissions as Mock).mockReturnValue({
            isAssistenteOuDiretor: false,
            isGipe: true,
            isPontoFocal: false,
            isGipeAdmin: false,
        });

        renderWithProvider(<Dashboard />);

        await waitFor(() => {
            expect(
                screen.getByText(/intercorrências institucionais/i)
            ).toBeInTheDocument();
        });

        expect(
            screen.queryByText(
                /Para registrar uma nova intercorrência institucional/i
            )
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: /Nova ocorrência/i })
        ).not.toBeInTheDocument();
    });

    it("não deve exibir Header para perfil Ponto Focal", async () => {
        (useUserPermissions as Mock).mockReturnValue({
            isAssistenteOuDiretor: false,
            isGipe: false,
            isPontoFocal: true,
            isGipeAdmin: false,
        });

        renderWithProvider(<Dashboard />);

        await waitFor(() => {
            expect(
                screen.getByText(/intercorrências institucionais/i)
            ).toBeInTheDocument();
        });

        expect(
            screen.queryByText(
                /Para registrar uma nova intercorrência institucional/i
            )
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: /Nova ocorrência/i })
        ).not.toBeInTheDocument();
    });
});
