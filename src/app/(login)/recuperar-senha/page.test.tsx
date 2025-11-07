import { render, screen } from "@testing-library/react";
import Page from "./page";

vi.mock("@/components/login/FormRecuperarSenha", () => ({
    __esModule: true,
    default: () => (
        <div data-testid="form-recuperar-senha">Mocked FormRecuperarSenha</div>
    ),
}));

describe("Página inicial (src/app/(login)/recuperar-senha/page.tsx)", () => {
    it("renderiza FormRecuperarSenha corretamente", () => {
        render(<Page />);

        expect(screen.getByTestId("form-recuperar-senha")).toBeInTheDocument();
    });
});
