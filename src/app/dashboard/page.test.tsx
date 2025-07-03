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
            name: "Fake User",
            email: "fakeuser@gmail.com",
            role: "Admin",
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
            expect(screen.getByText(/fakeuser@gmail.com/i)).toBeInTheDocument();
            expect(screen.getByText(/admin/i)).toBeInTheDocument();
            expect(screen.getByText(/área protegida/i)).toBeInTheDocument();
        });
    });
});
