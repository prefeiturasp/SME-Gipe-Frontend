import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "./page";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
}));

describe("Dashboard page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza conteúdo protegido", async () => {
        render(<Dashboard />);

        await waitFor(() => {
            expect(
                screen.getByText(/intercorrências institucionais/i)
            ).toBeInTheDocument();
            expect(screen.getByText(/\+ nova ocorrência/i)).toBeInTheDocument();
        });
    });

    it("deve ter um link para a página de nova ocorrência", () => {
        render(<Dashboard />);
        const link = screen.getByRole("link", { name: /\+ nova ocorrência/i });
        expect(link).toHaveAttribute("href", "/dashboard/nova-ocorrencia");
    });
});
