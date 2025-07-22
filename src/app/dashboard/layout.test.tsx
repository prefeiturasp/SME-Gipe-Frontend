import { render, screen } from "@testing-library/react";
import DashboardLayout from "@/app/dashboard/layout";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => "/dashboard",
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

beforeAll(() => {
    window.matchMedia = () =>
        ({
            matches: false,
            media: "",
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        } as unknown as MediaQueryList);
});

describe("DashboardLayout (layout.tsx)", () => {
    it("renderiza sidebar, navbar e conteúdo corretamente", async () => {
        render(
            <DashboardLayout>
                <div data-testid="child">Conteúdo de teste</div>
            </DashboardLayout>
        );

        const child = await screen.findByTestId("child");
        expect(child).toBeInTheDocument();

        expect(screen.getByText(/sair/i)).toBeInTheDocument();

        expect(
            screen.getByText(/intercorrência institucional/i)
        ).toBeInTheDocument();
    });
});
