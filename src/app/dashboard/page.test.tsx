import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "./page";

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
});
