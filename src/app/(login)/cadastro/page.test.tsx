import { render, screen } from "@testing-library/react";
import Page from "./page";

vi.mock("@/components/login/FormCadastro", () => ({
    __esModule: true,
    default: () => <div data-testid="form-cadastro">Mocked FormCadastro</div>,
}));

vi.mock("next/image", () => ({
    default: (props: Record<string, unknown>) => {
        // eslint-disable-next-line @next/next/no-img-element, @typescript-eslint/no-unused-vars
        const { priority, fetchPriority, fill, ...rest } = props || {};
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={typeof rest.alt === "string" ? rest.alt : ""} {...rest} />
        );
    },
}));

describe("Página inicial (src/app/page.tsx)", () => {
    it("renderiza FormCadastro corretamente", () => {
        render(<Page />);

        expect(screen.getByTestId("form-cadastro")).toBeInTheDocument();
    });
});
