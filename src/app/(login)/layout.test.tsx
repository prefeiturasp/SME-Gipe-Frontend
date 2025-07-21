import { render, screen } from "@testing-library/react";
import LoginLayout from "../(login)/layout";

describe("LoginLayout", () => {
    it("renderiza o children centralizado", () => {
        render(
            <LoginLayout>
                <div data-testid="child">Conteúdo Login</div>
            </LoginLayout>
        );
        const child = screen.getByTestId("child");
        expect(child).toBeInTheDocument();
        const main = child.closest("main");
        expect(main).toHaveClass("min-h-screen");
        expect(main).toHaveClass("flex");
        expect(main).toHaveClass("items-center");
        expect(main).toHaveClass("justify-center");
        expect(main).toHaveClass("bg-background");
    });
});
