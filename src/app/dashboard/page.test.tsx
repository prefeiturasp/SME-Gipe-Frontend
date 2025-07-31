import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "./page";

// Mock do Zustand store
vi.mock("@/stores/useUserStore", () => {
    return {
        useUserStore: vi.fn(),
    };
});

import { useUserStore } from "@/stores/useUserStore";

describe("Dashboard page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("mostra mensagem de 'Usuário não autenticado' se user for null", async () => {
        (
            useUserStore as unknown as {
                mockImplementation: (fn: () => unknown) => void;
            }
        ).mockImplementation(() => null);

        render(<Dashboard />);

        await waitFor(() => {
            expect(
                screen.getByText(/usuário não autenticado/i)
            ).toBeInTheDocument();
        });
    });

    it("renderiza conteúdo protegido se user estiver presente", async () => {
        const fakeUser = {
            nome: "Fake User",
            perfil_acesso: "Assistente de diretor",
            unidade: [{ nomeUnidade: "Escola Fake" }],
        };

        (
            useUserStore as unknown as {
                mockImplementation: (fn: () => unknown) => void;
            }
        ).mockImplementation(() => fakeUser);

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
            expect(screen.getAllByText(/fake user/i).length).toBeGreaterThan(0);
            expect(screen.getByText(/escola fake/i)).toBeInTheDocument();
            expect(
                screen.getByText(/assistente de diretor/i)
            ).toBeInTheDocument();
            expect(screen.getByText(/área protegida/i)).toBeInTheDocument();
        });
    });
});
