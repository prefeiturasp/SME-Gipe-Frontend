import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import FiltrosUsuarios from "./index";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as useUnidadesHook from "@/hooks/useUnidades";

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

// Helper para pegar combobox por índice
function getDreSelect() {
    return screen.getAllByRole("combobox")[0];
}

function getUeCombobox() {
    return screen.getAllByRole("combobox")[1];
}

describe("FiltrosUsuarios component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Renderização inicial", () => {
        it("deve renderizar o texto explicativo", () => {
            vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            vi.spyOn(useUnidadesHook, "useFetchUEs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            renderWithQueryProvider(<FiltrosUsuarios />);

            expect(
                screen.getByText(
                    /Você pode filtrar as pessoas que possuem acesso ao GIPE/i
                )
            ).toBeInTheDocument();
        });

        it("deve renderizar os labels dos filtros", () => {
            vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            vi.spyOn(useUnidadesHook, "useFetchUEs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            renderWithQueryProvider(<FiltrosUsuarios />);

            expect(screen.getByText("Diretoria Regional")).toBeInTheDocument();
            expect(screen.getByText("Unidade Educacional")).toBeInTheDocument();
        });
    });

    describe("Select de DRE", () => {
        it("deve mostrar 'Carregando...' quando isLoadingDres é true", () => {
            vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
                data: undefined,
                isLoading: true,
                isError: false,
                error: null,
            } as never);

            vi.spyOn(useUnidadesHook, "useFetchUEs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            renderWithQueryProvider(<FiltrosUsuarios />);

            expect(screen.getByText("Carregando...")).toBeInTheDocument();
        });

        it("deve mostrar 'Erro ao carregar DREs' quando isErrorDres é true", () => {
            vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
                data: undefined,
                isLoading: false,
                isError: true,
                error: new Error("Erro"),
            } as never);

            vi.spyOn(useUnidadesHook, "useFetchUEs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            renderWithQueryProvider(<FiltrosUsuarios />);

            expect(
                screen.getByText("Erro ao carregar DREs")
            ).toBeInTheDocument();
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

            vi.spyOn(useUnidadesHook, "useFetchUEs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            const user = userEvent.setup();
            renderWithQueryProvider(<FiltrosUsuarios />);

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

            vi.spyOn(useUnidadesHook, "useFetchUEs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            const onFilterChange = vi.fn();
            const user = userEvent.setup();
            renderWithQueryProvider(
                <FiltrosUsuarios onFilterChange={onFilterChange} />
            );

            const dreSelect = getDreSelect();
            await user.click(dreSelect);

            const dreOption = await screen.findByText("DRE Centro");
            await user.click(dreOption);

            await waitFor(() => {
                expect(onFilterChange).toHaveBeenCalledWith({
                    dreUuid: "dre-1",
                    ueUuid: undefined,
                });
            });
        });
    });

    describe("Combobox de UE", () => {
        it("deve mostrar 'Selecione primeiro uma DRE' quando nenhuma DRE está selecionada", () => {
            vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            vi.spyOn(useUnidadesHook, "useFetchUEs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            renderWithQueryProvider(<FiltrosUsuarios />);

            expect(
                screen.getByText("Selecione primeiro uma DRE")
            ).toBeInTheDocument();
        });

        it("deve estar desabilitado quando nenhuma DRE está selecionada", () => {
            vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            vi.spyOn(useUnidadesHook, "useFetchUEs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            renderWithQueryProvider(<FiltrosUsuarios />);

            const ueCombobox = getUeCombobox();
            expect(ueCombobox).toBeDisabled();
        });

        it("deve mostrar 'Carregando...' quando isLoadingUes é true", async () => {
            const mockDREs = [{ uuid: "dre-1", nome: "DRE Centro" }];

            vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
                data: mockDREs,
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            const useFetchUEsMock = vi
                .spyOn(useUnidadesHook, "useFetchUEs")
                .mockReturnValue({
                    data: undefined,
                    isLoading: true,
                    isError: false,
                    error: null,
                } as never);

            const user = userEvent.setup();
            renderWithQueryProvider(<FiltrosUsuarios />);

            const dreSelect = getDreSelect();
            await user.click(dreSelect);

            const dreOption = await screen.findByText("DRE Centro");
            await user.click(dreOption);

            await waitFor(() => {
                expect(useFetchUEsMock).toHaveBeenCalledWith("dre-1", "TODAS");
            });

            await waitFor(() => {
                expect(
                    screen.getByText("Carregando...", { selector: "span" })
                ).toBeInTheDocument();
            });
        });

        it("deve mostrar 'Erro ao carregar UEs' quando isErrorUes é true", async () => {
            const mockDREs = [{ uuid: "dre-1", nome: "DRE Centro" }];

            vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
                data: mockDREs,
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            const useFetchUEsMock = vi
                .spyOn(useUnidadesHook, "useFetchUEs")
                .mockReturnValue({
                    data: undefined,
                    isLoading: false,
                    isError: true,
                    error: new Error("Erro"),
                } as never);

            const user = userEvent.setup();
            renderWithQueryProvider(<FiltrosUsuarios />);

            const dreSelect = getDreSelect();
            await user.click(dreSelect);

            const dreOption = await screen.findByText("DRE Centro");
            await user.click(dreOption);

            await waitFor(() => {
                expect(useFetchUEsMock).toHaveBeenCalledWith("dre-1", "TODAS");
            });

            await waitFor(() => {
                expect(
                    screen.getByText("Erro ao carregar UEs")
                ).toBeInTheDocument();
            });
        });

        it("deve renderizar as opções de UE quando uma DRE é selecionada e os dados são carregados", async () => {
            const mockDREs = [{ uuid: "dre-1", nome: "DRE Centro" }];
            const mockUEs = [
                { uuid: "ue-1", nome: "EMEF José Silva" },
                { uuid: "ue-2", nome: "EMEI Maria Santos" },
                { uuid: "ue-3", nome: "CEI Paulo Freire" },
            ];

            vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
                data: mockDREs,
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            const useFetchUEsMock = vi
                .spyOn(useUnidadesHook, "useFetchUEs")
                .mockReturnValue({
                    data: mockUEs,
                    isLoading: false,
                    isError: false,
                    error: null,
                } as never);

            const user = userEvent.setup();
            renderWithQueryProvider(<FiltrosUsuarios />);

            // Seleciona a DRE
            const dreSelect = getDreSelect();
            await user.click(dreSelect);

            const dreOption = await screen.findByText("DRE Centro");
            await user.click(dreOption);

            await waitFor(() => {
                expect(useFetchUEsMock).toHaveBeenCalledWith("dre-1", "TODAS");
            });

            // Abre o combobox de UE
            const ueCombobox = getUeCombobox();
            await user.click(ueCombobox);

            // Verifica se as opções estão disponíveis
            await waitFor(() => {
                const popover = screen.getByRole("dialog");
                expect(
                    within(popover).getByText("EMEF José Silva")
                ).toBeInTheDocument();
                expect(
                    within(popover).getByText("EMEI Maria Santos")
                ).toBeInTheDocument();
                expect(
                    within(popover).getByText("CEI Paulo Freire")
                ).toBeInTheDocument();
            });
        });

        it("deve chamar onFilterChange quando uma UE é selecionada", async () => {
            const mockDREs = [{ uuid: "dre-1", nome: "DRE Centro" }];
            const mockUEs = [
                { uuid: "ue-1", nome: "EMEF José Silva" },
                { uuid: "ue-2", nome: "EMEI Maria Santos" },
            ];

            vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
                data: mockDREs,
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            vi.spyOn(useUnidadesHook, "useFetchUEs").mockReturnValue({
                data: mockUEs,
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            const onFilterChange = vi.fn();
            const user = userEvent.setup();
            renderWithQueryProvider(
                <FiltrosUsuarios onFilterChange={onFilterChange} />
            );

            // Seleciona a DRE
            const dreSelect = getDreSelect();
            await user.click(dreSelect);

            const dreOption = await screen.findByText("DRE Centro");
            await user.click(dreOption);

            // Aguarda atualização do estado
            await waitFor(() => {
                expect(onFilterChange).toHaveBeenLastCalledWith({
                    dreUuid: "dre-1",
                    ueUuid: undefined,
                });
            });

            // Seleciona a UE
            const ueCombobox = getUeCombobox();
            await user.click(ueCombobox);

            const ueOption = await screen.findByText("EMEF José Silva");
            await user.click(ueOption);

            await waitFor(() => {
                expect(onFilterChange).toHaveBeenLastCalledWith({
                    dreUuid: "dre-1",
                    ueUuid: "ue-1",
                });
            });
        });
    });

    describe("Integração do filtro", () => {
        it("deve chamar useFetchUEs com dreUuid vazio quando nenhuma DRE está selecionada", () => {
            vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            const useFetchUEsMock = vi
                .spyOn(useUnidadesHook, "useFetchUEs")
                .mockReturnValue({
                    data: [],
                    isLoading: false,
                    isError: false,
                    error: null,
                } as never);

            renderWithQueryProvider(<FiltrosUsuarios />);

            expect(useFetchUEsMock).toHaveBeenCalledWith("", "TODAS");
        });

        it("deve chamar useFetchUEs com dreUuid correto quando DRE está selecionada", async () => {
            const mockDREs = [{ uuid: "dre-123", nome: "DRE Teste" }];

            vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
                data: mockDREs,
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            const useFetchUEsMock = vi
                .spyOn(useUnidadesHook, "useFetchUEs")
                .mockReturnValue({
                    data: [],
                    isLoading: false,
                    isError: false,
                    error: null,
                } as never);

            const user = userEvent.setup();
            renderWithQueryProvider(<FiltrosUsuarios />);

            const dreSelect = getDreSelect();
            await user.click(dreSelect);

            const dreOption = await screen.findByText("DRE Teste");
            await user.click(dreOption);

            await waitFor(() => {
                expect(useFetchUEsMock).toHaveBeenCalledWith(
                    "dre-123",
                    "TODAS"
                );
            });
        });

        it("não deve chamar onFilterChange se não for fornecido", async () => {
            const mockDREs = [{ uuid: "dre-1", nome: "DRE Centro" }];

            vi.spyOn(useUnidadesHook, "useFetchDREs").mockReturnValue({
                data: mockDREs,
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            vi.spyOn(useUnidadesHook, "useFetchUEs").mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
            } as never);

            const user = userEvent.setup();

            // Renderiza sem onFilterChange
            renderWithQueryProvider(<FiltrosUsuarios />);

            const dreSelect = getDreSelect();
            await user.click(dreSelect);

            const dreOption = await screen.findByText("DRE Centro");

            // Não deve lançar erro ao clicar
            expect(async () => {
                await user.click(dreOption);
            }).not.toThrow();
        });
    });
});
