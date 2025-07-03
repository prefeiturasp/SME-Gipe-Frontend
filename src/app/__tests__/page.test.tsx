import { render, screen } from "@testing-library/react";
import Page from "../page";

// Mockando componentes usados na página
vi.mock("@/components/login/LoginForm", () => ({
    __esModule: true,
    default: () => <div data-testid="login-form">Mocked LoginForm</div>,
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
    it("renderiza Navbar e LoginForm corretamente", () => {
        render(<Page />);

        expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });
});
