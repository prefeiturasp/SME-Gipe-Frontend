import { render, screen } from "@testing-library/react";
import RootLayout from "../dashboard/layout";

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

beforeAll(() => {
    window.matchMedia = (query: string) =>
        ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => {},
        } as unknown as MediaQueryList);
});

describe("Dashboard RootLayout", () => {
    it("renderiza o children ao lado da sidebar", () => {
        render(
            <RootLayout>
                <div data-testid="child">Conteúdo Dashboard</div>
            </RootLayout>
        );
        const child = screen.getByTestId("child");
        expect(child).toBeInTheDocument();
        const main = child.closest("main");
        expect(main).toBeInTheDocument();
        const flexDiv = main?.closest(".flex");
        expect(flexDiv).toBeInTheDocument();
    });
});
