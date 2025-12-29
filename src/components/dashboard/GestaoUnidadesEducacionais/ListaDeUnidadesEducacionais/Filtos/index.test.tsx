import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import FiltrosUnidadesEducacionais from "./index";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as useUnidadesHook from "@/hooks/useUnidades";
import * as useUserStoreModule from "@/stores/useUserStore";

function renderWithQueryProvider(ui: React.ReactElement) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
}

function getDreSelect() {
    return screen.getByRole("combobox");
}

describe("FiltrosUnidadesEducacionais component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve renderizar o texto explicativo e o label", () => {
        vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
            error: null,
        } as never);

        renderWithQueryProvider(<FiltrosUnidadesEducacionais />);

        expect(
            screen.getByText(
                /Você pode filtrar as UEs por Diretorias Regionais/i
            )
        ).toBeInTheDocument();
        expect(screen.getByText("Diretoria Regional")).toBeInTheDocument();
    });

    it("deve mostrar 'Carregando...' quando isLoadingDres é true", () => {
        vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            error: null,
        } as never);

        renderWithQueryProvider(<FiltrosUnidadesEducacionais />);

        expect(screen.getByText("Carregando...")).toBeInTheDocument();
    });

    it("deve mostrar 'Erro ao carregar DREs' quando isErrorDres é true", () => {
        vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: new Error("Erro"),
        } as never);

        renderWithQueryProvider(<FiltrosUnidadesEducacionais />);

        expect(screen.getByText("Erro ao carregar DREs")).toBeInTheDocument();
    });

    it("deve renderizar as opções de DRE quando os dados são carregados", async () => {
        const mockDREs = [
            { uuid: "dre-1", nome: "DRE Centro" },
            { uuid: "dre-2", nome: "DRE Norte" },
            { uuid: "dre-3", nome: "DRE Sul" },
        ];

        vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
            data: mockDREs,
            isLoading: false,
            isError: false,
            error: null,
        } as never);

        const user = userEvent.setup();
        renderWithQueryProvider(<FiltrosUnidadesEducacionais />);

        const dreSelect = getDreSelect();
        await user.click(dreSelect);

        await waitFor(() => {
            expect(screen.getByText("DRE Centro")).toBeInTheDocument();
            expect(screen.getByText("DRE Norte")).toBeInTheDocument();
            expect(screen.getByText("DRE Sul")).toBeInTheDocument();
        });
    });

    it("deve chamar onFilterChange quando uma DRE é selecionada", async () => {
        const mockDREs = [
            { uuid: "dre-1", nome: "DRE Centro" },
            { uuid: "dre-2", nome: "DRE Norte" },
        ];

        vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
            data: mockDREs,
            isLoading: false,
            isError: false,
            error: null,
        } as never);

        const onFilterChange = vi.fn();
        const user = userEvent.setup();
        renderWithQueryProvider(
            <FiltrosUnidadesEducacionais onFilterChange={onFilterChange} />
        );

        const dreSelect = getDreSelect();
        await user.click(dreSelect);

        const dreOption = await screen.findByText("DRE Centro");
        await user.click(dreOption);

        await waitFor(() => {
            expect(onFilterChange).toHaveBeenLastCalledWith({
                dreUuid: "dre-1",
            });
        });
    });

    it("deve pré-selecionar a DRE e desabilitar o select quando o usuário é Ponto Focal", async () => {
        const mockUserStore = {
            user: {
                perfil_acesso: {
                    codigo: 1,
                    descricao: "Ponto Focal",
                },
                unidades: [
                    {
                        dre: {
                            dre_uuid: "dre-ponto-focal-123",
                            nome: "DRE Ponto Focal Teste",
                        },
                    },
                ],
            },
        };

        const useUserStoreSpy = vi.spyOn(
            useUserStoreModule,
            "useUserStore"
        );
        useUserStoreSpy.mockImplementation((selector) => {
            if (typeof selector === "function") {
                return selector(mockUserStore as never);
            }
            return mockUserStore;
        });

        const mockDREs = [
            { uuid: "dre-ponto-focal-123", nome: "DRE Ponto Focal Teste" },
            { uuid: "dre-2", nome: "DRE Outra" },
        ];

        vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
            data: mockDREs,
            isLoading: false,
            isError: false,
            error: null,
        } as never);

        const onFilterChange = vi.fn();
        renderWithQueryProvider(
            <FiltrosUnidadesEducacionais onFilterChange={onFilterChange} />
        );

        await waitFor(() => {
            expect(onFilterChange).toHaveBeenCalledWith({
                dreUuid: "dre-ponto-focal-123",
            });
        });

        expect(getDreSelect()).toBeDisabled();

        useUserStoreSpy.mockRestore();
    });
});
