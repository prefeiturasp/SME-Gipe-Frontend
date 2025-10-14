import { render, screen } from "@testing-library/react";
import Page from "./page";

// Mockando componentes usados na página
vi.mock("@/components/login/LoginForm", () => ({
    __esModule: true,
    default: () => <div data-testid="login-form">Mocked LoginForm</div>,
}));

describe("Página inicial (src/app/page.tsx)", () => {
    it("renderiza LoginForm corretamente", () => {
        render(<Page />);

        expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });
});
