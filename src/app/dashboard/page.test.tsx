import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "./page";

// Mock do Zustand store
vi.mock("@/stores/useUserStore", () => {
    return {
        useUserStore: vi.fn(),
    };
});

// Mock da Navbar
vi.mock("@/components/ui/Navbar", () => ({
    __esModule: true,
    default: ({ user }: { user: { name: string } }) => (
        <nav data-testid="navbar">Navbar - {user.name}</nav>
    ),
}));

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
            name: "Guilherme",
            email: "gui@email.com",
            role: "Admin",
        };

        (
            useUserStore as unknown as {
                mockImplementation: (fn: () => unknown) => void;
            }
        ).mockImplementation(() => fakeUser);

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByTestId("navbar")).toBeInTheDocument();
            expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
            expect(screen.getAllByText(/guilherme/i).length).toBeGreaterThan(0);
            expect(screen.getByText(/gui@email.com/i)).toBeInTheDocument();
            expect(screen.getByText(/admin/i)).toBeInTheDocument();
            expect(screen.getByText(/área protegida/i)).toBeInTheDocument();
        });
    });
});
