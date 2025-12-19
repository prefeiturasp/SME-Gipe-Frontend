import { render, screen } from "@testing-library/react";
import ListaDeUnidadesEducacionais from ".";
import { UnidadeEducacional } from "@/types/unidades";
import { useGetUnidades } from "@/hooks/useGetUnidades";

vi.mock("@/hooks/useGetUnidades", () => ({
    useGetUnidades: vi.fn(),
}));

vi.mock("./TabelaUnidades", () => ({
    __esModule: true,
    default: ({ dataUnidades }: { dataUnidades: UnidadeEducacional[] }) => (
        <div data-testid="tabela-unidades">
            Renderizando {dataUnidades.length} unidades
        </div>
    ),
}));

const mockedUseGetUnidades = vi.mocked(useGetUnidades);

describe("ListaDeUnidadesEducacionais", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve buscar e renderizar as unidades quando houver dados", () => {
        const unidadesMock: UnidadeEducacional[] = [
            {
                id: 1,
                uuid: "uuid-1",
                nome: "Unidade 1",
                tipo_unidade: "Tipo A",
                rede_label: "Rede 1",
                codigo_eol: "123",
                dre_nome: "DRE 1",
                sigla: "D1",
                status: "ativa",
            },
        ];

        mockedUseGetUnidades.mockReturnValue({
            data: unidadesMock,
        } as never);

        render(<ListaDeUnidadesEducacionais status="ativa" />);

        expect(mockedUseGetUnidades).toHaveBeenCalledWith(true);
        expect(screen.getByTestId("tabela-unidades")).toHaveTextContent(
            "Renderizando 1 unidades"
        );
    });

    it("não deve renderizar a tabela quando não houver dados", () => {
        mockedUseGetUnidades.mockReturnValue({
            data: [],
        } as never);

        render(<ListaDeUnidadesEducacionais status="inativa" />);

        expect(mockedUseGetUnidades).toHaveBeenCalledWith(false);
        expect(screen.queryByTestId("tabela-unidades")).not.toBeInTheDocument();
    });
});
