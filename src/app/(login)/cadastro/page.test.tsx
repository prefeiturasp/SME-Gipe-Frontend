import { render, screen } from "@testing-library/react";
import Page from "./page";

vi.mock("@/components/login/FormCadastro", () => ({
    __esModule: true,
    default: () => <div data-testid="form-cadastro">Mocked FormCadastro</div>,
}));

describe("Página inicial (src/app/page.tsx)", () => {
    it("renderiza FormCadastro corretamente", () => {
        render(<Page />);

        expect(screen.getByTestId("form-cadastro")).toBeInTheDocument();
    });
});
