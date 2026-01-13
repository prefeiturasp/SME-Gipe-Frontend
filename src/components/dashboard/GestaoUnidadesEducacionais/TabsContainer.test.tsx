import TabsContainer from "@/components/dashboard/GestaoUnidadesEducacionais/TabsContainer";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

const mockGet = vi.fn();
vi.mock("next/navigation", () => ({
    useSearchParams: () => ({
        get: mockGet,
    }),
}));

vi.mock(
    "@/components/dashboard/GestaoUnidadesEducacionais/ListaDeUnidadesEducacionais",
    () => ({
        __esModule: true,
        default: ({ status }: { status: "ativa" | "inativa" }) => {
            return (
                <div data-testid={`lista-unidades-${status}`}>
                    Exibindo o status: {status}
                </div>
            );
        },
    })
);

describe("TabsContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGet.mockReturnValue(null);
    });

    it("deve renderizar as abas corretamente", () => {
        render(<TabsContainer />);

        expect(
            screen.getByRole("tab", {
                name: /Unidades Educacionais ativas/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("tab", {
                name: /Unidades Educacionais inativas/i,
            })
        ).toBeInTheDocument();
    });

    it("deve alternar entre as abas ao clicar nos gatilhos", async () => {
        render(<TabsContainer />);
        const user = userEvent.setup();

        const abaAtivas = screen.getByRole("tab", {
            name: /Unidades Educacionais ativa/i,
        });
        const abaInativas = screen.getByRole("tab", {
            name: /Unidades Educacionais inativa/i,
        });

        expect(screen.getByTestId("lista-unidades-ativa")).toBeInTheDocument();

        await user.click(abaInativas);

        expect(
            screen.getByTestId("lista-unidades-inativa")
        ).toBeInTheDocument();

        await user.click(abaAtivas);

        expect(screen.getByTestId("lista-unidades-ativa")).toBeInTheDocument();
    });

    it("deve iniciar com a aba 'ativas' quando não há parâmetro na URL", () => {
        mockGet.mockReturnValue(null);

        render(<TabsContainer />);

        expect(screen.getByTestId("lista-unidades-ativa")).toBeInTheDocument();
    });

    it("deve iniciar com a aba 'inativas' quando o parâmetro tab=inativas está na URL", () => {
        mockGet.mockReturnValue("inativas");

        render(<TabsContainer />);

        expect(
            screen.getByTestId("lista-unidades-inativa")
        ).toBeInTheDocument();
    });

    it("deve iniciar com a aba 'ativas' quando o parâmetro tab=ativas está na URL", () => {
        mockGet.mockReturnValue("ativas");

        render(<TabsContainer />);

        expect(screen.getByTestId("lista-unidades-ativa")).toBeInTheDocument();
    });

    it("deve iniciar com a aba 'ativas' quando o parâmetro tab tem valor inválido", () => {
        mockGet.mockReturnValue("invalido");

        render(<TabsContainer />);

        expect(screen.getByTestId("lista-unidades-ativa")).toBeInTheDocument();
    });
});
