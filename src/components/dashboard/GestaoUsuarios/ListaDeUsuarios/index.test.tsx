import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ListaDeUsuarios from ".";

import type { Usuario } from "@/types/usuarios";
import { usuariosMock } from "@/components/mocks/usuarios-mock";

const useGetUsuariosMock = vi.fn();
const tabelaUsuariosPropsSpy = vi.fn();
const FILTER_VALUES = { dreUuid: "dre-uuid", ueUuid: "ue-uuid" };

vi.mock("@/hooks/useGetUsuarios", () => ({
    useGetUsuarios: (...args: unknown[]) => useGetUsuariosMock(...args),
}));

vi.mock("./Filtros", () => ({
    __esModule: true,
    default: ({
        onFilterChange,
    }: {
        onFilterChange?: (filters: { dreUuid?: string; ueUuid?: string }) => void;
    }) => (
        <div>
            <button
                type="button"
                data-testid="aplicar-filtros"
                onClick={() => onFilterChange?.(FILTER_VALUES)}
            >
                Aplicar filtros
            </button>
            <button
                type="button"
                data-testid="reaplicar-filtros"
                onClick={() => onFilterChange?.(FILTER_VALUES)}
            >
                Reaplicar filtros
            </button>
        </div>
    ),
}));

vi.mock("./TabelaUsuarios", () => ({
    __esModule: true,
    default: ({ dataUsuarios }: { dataUsuarios: Usuario[] }) => {
        tabelaUsuariosPropsSpy({ dataUsuarios });
        return (
            <div data-testid="tabela-usuarios">
                Tabela mock ({dataUsuarios.length})
            </div>
        );
    },
}));



function renderListaDeUsuarios(status: "ativos" | "inativos" = "ativos") {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <ListaDeUsuarios status={status} />
        </QueryClientProvider>
    );
}

describe("ListaDeUsuarios", () => {
    beforeEach(() => {
        useGetUsuariosMock.mockReset();
        tabelaUsuariosPropsSpy.mockReset();
        useGetUsuariosMock.mockReturnValue({
            data: usuariosMock,
            isLoading: false,
            isError: false,
            error: null,
        });
    });

    it("renderiza a tabela quando há usuários", () => {
        renderListaDeUsuarios();

        expect(screen.getByTestId("tabela-usuarios")).toHaveTextContent(
            "Tabela mock (2)"
        );
        expect(tabelaUsuariosPropsSpy).toHaveBeenCalledWith(
            expect.objectContaining({ dataUsuarios: usuariosMock })
        );
        expect(
            screen.queryByText("Carregando usuários...")
        ).not.toBeInTheDocument();
    });

    it("exibe mensagem de carregamento enquanto busca os usuários", () => {
        useGetUsuariosMock.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            error: null,
        });

        renderListaDeUsuarios();

        expect(screen.getByText("Carregando usuários...")).toBeInTheDocument();
        expect(
            screen.queryByTestId("tabela-usuarios")
        ).not.toBeInTheDocument();
    });

    it("exibe mensagem de erro quando a busca falha", () => {
        useGetUsuariosMock.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: { message: "Falha na API" },
        });

        renderListaDeUsuarios();

        expect(
            screen.getByText("Erro ao carregar usuários. Falha na API")
        ).toBeInTheDocument();
        expect(
            screen.queryByTestId("tabela-usuarios")
        ).not.toBeInTheDocument();
    });

    it("exibe mensagem quando não há usuários", () => {
        useGetUsuariosMock.mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
            error: null,
        });

        renderListaDeUsuarios();

        expect(
            screen.getByText("Nenhum usuário encontrado.")
        ).toBeInTheDocument();
        expect(
            screen.queryByTestId("tabela-usuarios")
        ).not.toBeInTheDocument();
    });

    it("passa o status correto ao hook quando ativos", () => {
        renderListaDeUsuarios("ativos");

        expect(useGetUsuariosMock).toHaveBeenCalledWith(
            true,
            undefined,
            undefined
        );
    });

    it("passa o status correto ao hook quando inativos", () => {
        renderListaDeUsuarios("inativos");

        expect(useGetUsuariosMock).toHaveBeenCalledWith(
            false,
            undefined,
            undefined
        );
    });

    it("reexecuta a busca quando filtros mudam e evita repetição com os mesmos valores", async () => {
        const user = userEvent.setup();

        renderListaDeUsuarios();
        expect(useGetUsuariosMock).toHaveBeenCalledTimes(1);

        await user.click(screen.getByTestId("aplicar-filtros"));
        expect(useGetUsuariosMock).toHaveBeenCalledTimes(2);
        expect(useGetUsuariosMock).toHaveBeenLastCalledWith(
            true,
            FILTER_VALUES.dreUuid,
            FILTER_VALUES.ueUuid
        );

        await user.click(screen.getByTestId("reaplicar-filtros"));
        expect(useGetUsuariosMock).toHaveBeenCalledTimes(3);
    });
});
