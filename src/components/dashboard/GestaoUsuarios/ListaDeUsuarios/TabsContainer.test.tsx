import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import TabsContainer from "@/components/dashboard/GestaoUsuarios/TabsContainer";
import type { Usuario } from "@/types/usuarios";

const useGetUsuariosMock = vi.fn();
const listaUsuariosSpy = vi.fn();
const pendenciasSpy = vi.fn();

vi.mock("@/hooks/useGetUsuarios", () => ({
    useGetUsuarios: (...args: unknown[]) => useGetUsuariosMock(...args),
}));

vi.mock("@/components/dashboard/GestaoUsuarios/ListaDeUsuarios", () => ({
    __esModule: true,
    default: ({ status }: { status: "ativos" | "inativos" }) => {
        listaUsuariosSpy(status);
        return <div data-testid={`lista-${status}`}>Lista {status}</div>;
    },
}));

vi.mock(
    "@/components/dashboard/GestaoUsuarios/ListaDeUsuariosPendenciasAprovacao",
    () => ({
        __esModule: true,
        default: (props: {
            usuarios?: Usuario[];
            isLoading?: boolean;
            isError?: boolean;
            error?: { message?: string } | null;
        }) => {
            pendenciasSpy(props);
            const count = props.usuarios?.length ?? 0;
            return (
                <div data-testid="pendencias-component">
                    Pendencias ({count})
                </div>
            );
        },
    })
);

const usuariosPendentesMock: Usuario[] = [
    {
        id: 1,
        uuid: "1",
        perfil: "Diretor(a)",
        nome: "João Silva",
        rf_ou_cpf: "123456",
        email: "joao@example.com",
        rede: "Direta",
        diretoria_regional: "Butantã",
        unidade_educacional: "EMEF A",
    },
    {
        id: 2,
        uuid: "2",
        perfil: "Coordenador(a)",
        nome: "Maria Santos",
        rf_ou_cpf: "987654",
        email: "maria@example.com",
        rede: "Indireta",
        diretoria_regional: "Penha",
        unidade_educacional: "EMEF B",
    },
];

type UseGetUsuariosResult = {
    data?: Usuario[];
    isLoading: boolean;
    isError: boolean;
    error: { message?: string } | null;
};

const createHookResult = (
    overrides?: Partial<UseGetUsuariosResult>
): UseGetUsuariosResult => ({
    data: usuariosPendentesMock,
    isLoading: false,
    isError: false,
    error: null,
    ...overrides,
});

function renderTabs() {
    return render(<TabsContainer />);
}

describe("TabsContainer", () => {
    beforeEach(() => {
        useGetUsuariosMock.mockReset();
        listaUsuariosSpy.mockReset();
        pendenciasSpy.mockReset();
        useGetUsuariosMock.mockReturnValue(createHookResult());
    });

    it("consulta usuários pendentes e exibe contagem no badge", () => {
        renderTabs();

        expect(useGetUsuariosMock).toHaveBeenCalledWith(
            undefined,
            undefined,
            undefined,
            true
        );

        const pendenciasTab = screen.getByRole("tab", {
            name: /Pendências de aprovação\s*2/i,
        });
        expect(pendenciasTab).toBeInTheDocument();

        expect(pendenciasSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                usuarios: usuariosPendentesMock,
                isLoading: false,
                isError: false,
                error: null,
            })
        );
    });

    it("renderiza abas de ativos e inativos com o status correto", async () => {
        const user = userEvent.setup();
        renderTabs();

        await user.click(screen.getByRole("tab", { name: "Usuários ativos" }));
        expect(listaUsuariosSpy).toHaveBeenLastCalledWith("ativos");
        expect(screen.getByTestId("lista-ativos")).toBeInTheDocument();

        await user.click(screen.getByRole("tab", { name: "Usuários inativos" }));
        expect(listaUsuariosSpy).toHaveBeenLastCalledWith("inativos");
        expect(screen.getByTestId("lista-inativos")).toBeInTheDocument();
    });

    it("alterna as abas quando o usuário clica nos gatilhos", async () => {
        const user = userEvent.setup();
        renderTabs();

        const pendenciasTab = screen.getByRole("tab", {
            name: /Pendências de aprovação/i,
        });
        const ativosTab = screen.getByRole("tab", { name: "Usuários ativos" });
        const inativosTab = screen.getByRole("tab", {
            name: "Usuários inativos",
        });

        expect(pendenciasTab).toHaveAttribute("aria-selected", "true");

        await user.click(ativosTab);
        expect(ativosTab).toHaveAttribute("aria-selected", "true");
        expect(pendenciasTab).toHaveAttribute("aria-selected", "false");

        await user.click(inativosTab);
        expect(inativosTab).toHaveAttribute("aria-selected", "true");
        expect(ativosTab).toHaveAttribute("aria-selected", "false");
    });

    it("mostra contagem zero quando a requisição não retorna usuários", () => {
        useGetUsuariosMock.mockReturnValueOnce(
            createHookResult({ data: undefined })
        );

        renderTabs();

        const pendenciasTab = screen.getByRole("tab", {
            name: /Pendências de aprovação\s*0/i,
        });
        expect(pendenciasTab).toBeInTheDocument();

        expect(pendenciasSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                usuarios: undefined,
            })
        );
    });
});
