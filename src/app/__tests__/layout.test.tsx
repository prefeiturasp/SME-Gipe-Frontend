import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import RootLayout from "../layout";

// Mock para next/font
vi.mock("next/font/google", () => ({
    Roboto: () => ({
        className: "mock-roboto",
        style: { fontFamily: "mock-roboto" },
    }),
}));

describe("RootLayout", () => {
    it("should render children with Roboto font class", () => {
        // Renderiza o componente
        const { getByTestId } = render(
            <RootLayout>
                <div data-testid="child">Test Child</div>
            </RootLayout>
        );

        // Verifica se o child foi renderizado
        const childElement = getByTestId("child");
        expect(childElement).toBeInTheDocument();
        expect(childElement.textContent).toBe("Test Child");

        // Verifica se o child está dentro de um body com as classes corretas
        const body = childElement.closest("body");
        expect(body).toHaveClass("mock-roboto");
        expect(body).toHaveClass("mx-auto");
        expect(body).toHaveClass("!px-0");

        // Verifica se o body está dentro de um html com lang="pt-br"
        const html = body?.closest("html");
        expect(html).toHaveAttribute("lang", "pt-br");
    });
});
