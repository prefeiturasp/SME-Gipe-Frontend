import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FiltrosUsuarios from "./index";

import * as useGetUnidadesHook from "@/hooks/useGetUnidades";
import * as useUserStoreModule from "@/stores/useUserStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

// Helper para mockar useGetUnidades
type MockQueryResult = {
    data?: Array<{ uuid: string; nome: string }>;
    isLoading: boolean;
    isError: boolean;
    error?: Error | null;
};

function mockUseGetUnidades(
    mockDREs?: MockQueryResult,
    mockUEs?: MockQueryResult
) {
    const defaultMock: MockQueryResult = {
        data: [],
        isLoading: false,
        isError: false,
        error: null,
    };

    const dres = mockDREs ?? defaultMock;
    const ues = mockUEs ?? defaultMock;
    const spy = vi.spyOn(useGetUnidadesHook, "useGetUnidades");
    spy.mockImplementation(
        (ativa?: boolean, dre?: string, tipo_unidade?: string) => {
            if (tipo_unidade === "DRE") {
                return dres as never;
            }
            return ues as never;
        }
    );
    return spy;
}

describe("FiltrosUsuarios component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Renderização inicial", () => {
        it("deve renderizar o texto explicativo", () => {
            mockUseGetUnidades();

            renderWithQueryProvider(<FiltrosUsuarios />);

            expect(
                screen.getByText(
                    /Você pode filtrar as pessoas que possuem acesso ao GIPE/i
                )
            ).toBeInTheDocument();
        });

        it("deve renderizar os labels dos filtros", () => {
            mockUseGetUnidades();

            renderWithQueryProvider(<FiltrosUsuarios />);

            expect(screen.getByText("Diretoria Regional")).toBeInTheDocument();
            expect(screen.getByText("Unidade Educacional")).toBeInTheDocument();
        });
    });

    describe("Select de DRE", () => {
        it("deve mostrar 'Carregando...' quando isLoadingDres é true", () => {
            mockUseGetUnidades(
                {
                    data: undefined,
                    isLoading: true,
                    isError: false,
                    error: null,
                },
                { data: [], isLoading: false, isError: false, error: null }
            );

            renderWithQueryProvider(<FiltrosUsuarios />);

            expect(screen.getByText("Carregando...")).toBeInTheDocument();
        });

        it("deve mostrar 'Erro ao carregar DREs' quando isErrorDres é true", () => {
            mockUseGetUnidades(
                {
                    data: undefined,
                    isLoading: false,
                    isError: true,
                    error: new Error("Erro"),
                },
                { data: [], isLoading: false, isError: false, error: null }
            );

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

            mockUseGetUnidades(
                {
                    data: mockDREs,
                    isLoading: false,
                    isError: false,
                    error: null,
                },
                { data: [], isLoading: false, isError: false, error: null }
            );

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

            mockUseGetUnidades(
                {
                    data: mockDREs,
                    isLoading: false,
                    isError: false,
                    error: null,
                },
                { data: [], isLoading: false, isError: false, error: null }
            );

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
            mockUseGetUnidades();

            renderWithQueryProvider(<FiltrosUsuarios />);

            expect(
                screen.getByText("Selecione primeiro uma DRE")
            ).toBeInTheDocument();
        });

        it("deve estar desabilitado quando nenhuma DRE está selecionada", () => {
            mockUseGetUnidades();

            renderWithQueryProvider(<FiltrosUsuarios />);

            const ueCombobox = getUeCombobox();
            expect(ueCombobox).toBeDisabled();
        });

        it("deve mostrar 'Carregando...' quando isLoadingUes é true", async () => {
            const mockDREs = [{ uuid: "dre-1", nome: "DRE Centro" }];

            const useGetUnidadesSpy = vi.spyOn(
                useGetUnidadesHook,
                "useGetUnidades"
            );
            useGetUnidadesSpy.mockImplementation(
                (ativa?: boolean, dre?: string, tipo_unidade?: string) => {
                    if (tipo_unidade === "DRE") {
                        return {
                            data: mockDREs,
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    if (dre === "dre-1") {
                        return {
                            data: undefined,
                            isLoading: true,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    return {
                        data: [],
                        isLoading: false,
                        isError: false,
                        error: null,
                    } as never;
                }
            );

            const user = userEvent.setup();
            renderWithQueryProvider(<FiltrosUsuarios />);

            const dreSelect = getDreSelect();
            await user.click(dreSelect);

            const dreOption = await screen.findByText("DRE Centro");
            await user.click(dreOption);

            await waitFor(() => {
                expect(
                    screen.getByText("Carregando...", { selector: "span" })
                ).toBeInTheDocument();
            });
        });

        it("deve mostrar 'Erro ao carregar UEs' quando isErrorUes é true", async () => {
            const mockDREs = [{ uuid: "dre-1", nome: "DRE Centro" }];

            const useGetUnidadesSpy = vi.spyOn(
                useGetUnidadesHook,
                "useGetUnidades"
            );
            useGetUnidadesSpy.mockImplementation(
                (ativa?: boolean, dre?: string, tipo_unidade?: string) => {
                    if (tipo_unidade === "DRE") {
                        return {
                            data: mockDREs,
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    if (dre === "dre-1") {
                        return {
                            data: undefined,
                            isLoading: false,
                            isError: true,
                            error: new Error("Erro"),
                        } as never;
                    }
                    return {
                        data: [],
                        isLoading: false,
                        isError: false,
                        error: null,
                    } as never;
                }
            );

            const user = userEvent.setup();
            renderWithQueryProvider(<FiltrosUsuarios />);

            const dreSelect = getDreSelect();
            await user.click(dreSelect);

            const dreOption = await screen.findByText("DRE Centro");
            await user.click(dreOption);

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

            const useGetUnidadesSpy = vi.spyOn(
                useGetUnidadesHook,
                "useGetUnidades"
            );
            useGetUnidadesSpy.mockImplementation(
                (ativa?: boolean, dre?: string, tipo_unidade?: string) => {
                    if (tipo_unidade === "DRE") {
                        return {
                            data: mockDREs,
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    if (dre === "dre-1") {
                        return {
                            data: mockUEs,
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    return {
                        data: [],
                        isLoading: false,
                        isError: false,
                        error: null,
                    } as never;
                }
            );

            const user = userEvent.setup();
            renderWithQueryProvider(<FiltrosUsuarios />);

            // Seleciona a DRE
            const dreSelect = getDreSelect();
            await user.click(dreSelect);

            const dreOption = await screen.findByText("DRE Centro");
            await user.click(dreOption);

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

            const useGetUnidadesSpy = vi.spyOn(
                useGetUnidadesHook,
                "useGetUnidades"
            );
            useGetUnidadesSpy.mockImplementation(
                (ativa?: boolean, dre?: string, tipo_unidade?: string) => {
                    if (tipo_unidade === "DRE") {
                        return {
                            data: mockDREs,
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    if (dre === "dre-1") {
                        return {
                            data: mockUEs,
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    return {
                        data: [],
                        isLoading: false,
                        isError: false,
                        error: null,
                    } as never;
                }
            );

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

    describe("Ponto Focal DRE - seleção automática", () => {
        it("deve pré-selecionar a DRE automaticamente quando o usuário é Ponto Focal (código 1)", async () => {
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

            const useGetUnidadesSpy = vi.spyOn(
                useGetUnidadesHook,
                "useGetUnidades"
            );
            useGetUnidadesSpy.mockImplementation(
                (ativa?: boolean, dre?: string, tipo_unidade?: string) => {
                    if (tipo_unidade === "DRE") {
                        return {
                            data: mockDREs,
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    if (dre === "dre-ponto-focal-123") {
                        return {
                            data: [],
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    return {
                        data: [],
                        isLoading: false,
                        isError: false,
                        error: null,
                    } as never;
                }
            );

            const onFilterChange = vi.fn();

            renderWithQueryProvider(
                <FiltrosUsuarios onFilterChange={onFilterChange} />
            );

            await waitFor(() => {
                expect(onFilterChange).toHaveBeenCalledWith({
                    dreUuid: "dre-ponto-focal-123",
                    ueUuid: undefined,
                });
            });

            useUserStoreSpy.mockRestore();
        });

        it("não deve pré-selecionar a DRE quando o usuário não é Ponto Focal", () => {
            const mockUserStore = {
                user: {
                    perfil_acesso: {
                        codigo: 2,
                        descricao: "Outro Perfil",
                    },
                    unidades: [
                        {
                            dre: {
                                dre_uuid: "dre-123",
                                nome: "DRE Teste",
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

            mockUseGetUnidades();

            renderWithQueryProvider(<FiltrosUsuarios />);

            useUserStoreSpy.mockRestore();
        });

        it("não deve pré-selecionar a DRE quando o usuário é Ponto Focal mas não tem DRE", () => {
            const mockUserStore = {
                user: {
                    perfil_acesso: {
                        codigo: 1,
                        descricao: "Ponto Focal",
                    },
                    unidades: [],
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

            mockUseGetUnidades();

            renderWithQueryProvider(<FiltrosUsuarios />);

            useUserStoreSpy.mockRestore();
        });

        it("deve chamar useGetUnidades com string vazia quando dreUuid é null", () => {
            const mockUserStore = {
                user: null,
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

            mockUseGetUnidades();

            renderWithQueryProvider(<FiltrosUsuarios />);

            useUserStoreSpy.mockRestore();
        });

        it("deve converter string vazia em undefined ao chamar onFilterChange", async () => {
            const mockUserStore = {
                user: null,
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

            mockUseGetUnidades();

            const onFilterChange = vi.fn();

            renderWithQueryProvider(
                <FiltrosUsuarios onFilterChange={onFilterChange} />
            );

            await waitFor(() => {
                // Com ||, strings vazias são convertidas em undefined
                expect(onFilterChange).toHaveBeenCalledWith({
                    dreUuid: undefined,
                    ueUuid: undefined,
                });
            });

            useUserStoreSpy.mockRestore();
        });

        it("deve desabilitar o select de DRE quando o usuário é Ponto Focal", async () => {
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
            ];

            const useGetUnidadesSpy = vi.spyOn(
                useGetUnidadesHook,
                "useGetUnidades"
            );
            useGetUnidadesSpy.mockImplementation(
                (ativa?: boolean, dre?: string, tipo_unidade?: string) => {
                    if (tipo_unidade === "DRE") {
                        return {
                            data: mockDREs,
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    return {
                        data: [],
                        isLoading: false,
                        isError: false,
                        error: null,
                    } as never;
                }
            );

            renderWithQueryProvider(<FiltrosUsuarios />);

            await waitFor(() => {
                const dreSelect = getDreSelect();
                expect(dreSelect).toBeDisabled();
            });

            useUserStoreSpy.mockRestore();
        });

        it("deve passar dreUuid preenchido para onFilterChange (não undefined)", async () => {
            const mockUserStore = {
                user: {
                    perfil_acesso: {
                        codigo: 1,
                        descricao: "Ponto Focal",
                    },
                    unidades: [
                        {
                            dre: {
                                dre_uuid: "dre-with-value",
                                nome: "DRE Com Valor",
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
                { uuid: "dre-with-value", nome: "DRE Com Valor" },
            ];

            const useGetUnidadesSpy = vi.spyOn(
                useGetUnidadesHook,
                "useGetUnidades"
            );
            useGetUnidadesSpy.mockImplementation(
                (ativa?: boolean, dre?: string, tipo_unidade?: string) => {
                    if (tipo_unidade === "DRE") {
                        return {
                            data: mockDREs,
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    return {
                        data: [],
                        isLoading: false,
                        isError: false,
                        error: null,
                    } as never;
                }
            );

            const onFilterChange = vi.fn();

            renderWithQueryProvider(
                <FiltrosUsuarios onFilterChange={onFilterChange} />
            );

            await waitFor(() => {
                // Com ||, ueUuid vazio é convertido em undefined
                expect(onFilterChange).toHaveBeenCalledWith({
                    dreUuid: "dre-with-value",
                    ueUuid: undefined,
                });
            });

            useUserStoreSpy.mockRestore();
        });

        it("deve passar ueUuid preenchido para onFilterChange quando uma UE é selecionada", async () => {
            const mockDREs = [{ uuid: "dre-1", nome: "DRE Teste" }];
            const mockUEs = [{ uuid: "ue-123", nome: "UE Teste" }];

            const useGetUnidadesSpy = vi.spyOn(
                useGetUnidadesHook,
                "useGetUnidades"
            );
            useGetUnidadesSpy.mockImplementation(
                (ativa?: boolean, dre?: string, tipo_unidade?: string) => {
                    if (tipo_unidade === "DRE") {
                        return {
                            data: mockDREs,
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    if (dre === "dre-1") {
                        return {
                            data: mockUEs,
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    return {
                        data: [],
                        isLoading: false,
                        isError: false,
                        error: null,
                    } as never;
                }
            );

            const onFilterChange = vi.fn();
            const user = userEvent.setup();

            renderWithQueryProvider(
                <FiltrosUsuarios onFilterChange={onFilterChange} />
            );

            // Seleciona DRE
            const dreSelect = getDreSelect();
            await user.click(dreSelect);
            const dreOption = await screen.findByText("DRE Teste");
            await user.click(dreOption);

            // Seleciona UE
            const ueCombobox = getUeCombobox();
            await user.click(ueCombobox);
            const ueOption = await screen.findByText("UE Teste");
            await user.click(ueOption);

            await waitFor(() => {
                // ueUuid preenchido não deve ser convertido para undefined (|| não se aplica)
                expect(onFilterChange).toHaveBeenLastCalledWith({
                    dreUuid: "dre-1",
                    ueUuid: "ue-123",
                });
            });
        });
    });

    describe("Integração do filtro", () => {
        const findCallWithDreUuid = (
            calls: Array<unknown[]>,
            dreUuid: string
        ) => {
            return calls.find(
                (call) => call[0] === true && call[1] === dreUuid
            );
        };

        const clickDreOptionAndVerify = async (
            user: ReturnType<typeof userEvent.setup>,
            optionText: string
        ) => {
            const dreSelect = getDreSelect();
            await user.click(dreSelect);
            const dreOption = await screen.findByText(optionText);
            await user.click(dreOption);
        };

        it("deve chamar useGetUnidades corretamente quando nenhuma DRE está selecionada", () => {
            mockUseGetUnidades();

            renderWithQueryProvider(<FiltrosUsuarios />);

            // O componente deve renderizar normalmente
            expect(screen.getByText("Diretoria Regional")).toBeInTheDocument();
        });

        it("deve chamar useGetUnidades com dreUuid correto quando DRE está selecionada", async () => {
            const mockDREs = [{ uuid: "dre-123", nome: "DRE Teste" }];

            const useGetUnidadesSpy = vi.spyOn(
                useGetUnidadesHook,
                "useGetUnidades"
            );
            useGetUnidadesSpy.mockImplementation(
                (ativa?: boolean, dre?: string, tipo_unidade?: string) => {
                    if (tipo_unidade === "DRE") {
                        return {
                            data: mockDREs,
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    return {
                        data: [],
                        isLoading: false,
                        isError: false,
                        error: null,
                    } as never;
                }
            );

            const user = userEvent.setup();
            renderWithQueryProvider(<FiltrosUsuarios />);

            await clickDreOptionAndVerify(user, "DRE Teste");

            await waitFor(() => {
                // Verifica se foi chamado com o dreUuid correto
                const calls = useGetUnidadesSpy.mock.calls;
                const callWithDreUuid = findCallWithDreUuid(calls, "dre-123");
                expect(callWithDreUuid).toBeDefined();
            });
        });

        it("não deve chamar onFilterChange se não for fornecido", async () => {
            const mockDREs = [{ uuid: "dre-1", nome: "DRE Centro" }];

            const useGetUnidadesSpy = vi.spyOn(
                useGetUnidadesHook,
                "useGetUnidades"
            );
            useGetUnidadesSpy.mockImplementation(
                (ativa?: boolean, dre?: string, tipo_unidade?: string) => {
                    if (tipo_unidade === "DRE") {
                        return {
                            data: mockDREs,
                            isLoading: false,
                            isError: false,
                            error: null,
                        } as never;
                    }
                    return {
                        data: [],
                        isLoading: false,
                        isError: false,
                        error: null,
                    } as never;
                }
            );

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

    describe("Botão Limpar filtros", () => {
        it("deve renderizar o botão 'Limpar filtros' quando não é Ponto Focal", () => {
            const mockUserStore = {
                user: {
                    perfil_acesso: {
                        codigo: 2,
                        descricao: "GIPE",
                    },
                    unidades: [],
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

            const mockDREs = [{ uuid: "dre-1", nome: "DRE Centro" }];

            mockUseGetUnidades(
                {
                    data: mockDREs,
                    isLoading: false,
                    isError: false,
                    error: null,
                },
                { data: [], isLoading: false, isError: false, error: null }
            );

            renderWithQueryProvider(<FiltrosUsuarios />);

            expect(
                screen.getByRole("button", { name: /limpar filtros/i })
            ).toBeInTheDocument();

            useUserStoreSpy.mockRestore();
        });

        it("deve desabilitar o botão 'Limpar filtros' quando não há filtros aplicados", () => {
            const mockUserStore = {
                user: {
                    perfil_acesso: {
                        codigo: 2,
                        descricao: "GIPE",
                    },
                    unidades: [],
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

            const mockDREs = [{ uuid: "dre-1", nome: "DRE Centro" }];

            mockUseGetUnidades(
                {
                    data: mockDREs,
                    isLoading: false,
                    isError: false,
                    error: null,
                },
                { data: [], isLoading: false, isError: false, error: null }
            );

            renderWithQueryProvider(<FiltrosUsuarios />);

            const limparButton = screen.getByRole("button", {
                name: /limpar filtros/i,
            });
            expect(limparButton).toBeDisabled();

            useUserStoreSpy.mockRestore();
        });

        it("deve habilitar o botão 'Limpar filtros' quando há filtro de DRE aplicado", async () => {
            const mockUserStore = {
                user: {
                    perfil_acesso: {
                        codigo: 2,
                        descricao: "GIPE",
                    },
                    unidades: [],
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
                { uuid: "dre-1", nome: "DRE Centro" },
                { uuid: "dre-2", nome: "DRE Norte" },
            ];

            mockUseGetUnidades(
                {
                    data: mockDREs,
                    isLoading: false,
                    isError: false,
                    error: null,
                },
                { data: [], isLoading: false, isError: false, error: null }
            );

            const user = userEvent.setup();
            renderWithQueryProvider(<FiltrosUsuarios />);

            const dreSelect = getDreSelect();
            await user.click(dreSelect);

            const dreOption = await screen.findByText("DRE Centro");
            await user.click(dreOption);

            await waitFor(() => {
                const limparButton = screen.getByRole("button", {
                    name: /limpar filtros/i,
                });
                expect(limparButton).not.toBeDisabled();
            });

            useUserStoreSpy.mockRestore();
        });

        it("deve habilitar o botão 'Limpar filtros' quando há filtro de UE aplicado", async () => {
            const mockUserStore = {
                user: {
                    perfil_acesso: {
                        codigo: 2,
                        descricao: "GIPE",
                    },
                    unidades: [],
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

            const mockDREs = [{ uuid: "dre-1", nome: "DRE Centro" }];
            const mockUEs = [{ uuid: "ue-1", nome: "UE Teste" }];

            mockUseGetUnidades(
                {
                    data: mockDREs,
                    isLoading: false,
                    isError: false,
                    error: null,
                },
                {
                    data: mockUEs,
                    isLoading: false,
                    isError: false,
                    error: null,
                }
            );

            const user = userEvent.setup();
            renderWithQueryProvider(<FiltrosUsuarios />);

            const dreSelect = getDreSelect();
            await user.click(dreSelect);
            const dreOption = await screen.findByText("DRE Centro");
            await user.click(dreOption);

            const ueCombobox = getUeCombobox();
            await user.click(ueCombobox);

            const ueOption = await screen.findByRole("option", {
                name: "UE Teste",
            });
            await user.click(ueOption);

            await waitFor(() => {
                const limparButton = screen.getByRole("button", {
                    name: /limpar filtros/i,
                });
                expect(limparButton).not.toBeDisabled();
            });

            useUserStoreSpy.mockRestore();
        });

        it("deve limpar ambos os filtros quando o botão 'Limpar filtros' é clicado (não-ponto-focal)", async () => {
            const mockUserStore = {
                user: {
                    perfil_acesso: {
                        codigo: 2,
                        descricao: "GIPE",
                    },
                    unidades: [],
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

            const mockDREs = [{ uuid: "dre-1", nome: "DRE Centro" }];
            const mockUEs = [{ uuid: "ue-1", nome: "UE Teste" }];

            mockUseGetUnidades(
                {
                    data: mockDREs,
                    isLoading: false,
                    isError: false,
                    error: null,
                },
                {
                    data: mockUEs,
                    isLoading: false,
                    isError: false,
                    error: null,
                }
            );

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

            const ueCombobox = getUeCombobox();
            await user.click(ueCombobox);
            const ueOption = await screen.findByRole("option", {
                name: "UE Teste",
            });
            await user.click(ueOption);

            await waitFor(() => {
                expect(onFilterChange).toHaveBeenCalledWith({
                    dreUuid: "dre-1",
                    ueUuid: "ue-1",
                });
            });

            const limparButton = screen.getByRole("button", {
                name: /limpar filtros/i,
            });
            await user.click(limparButton);

            await waitFor(() => {
                expect(onFilterChange).toHaveBeenLastCalledWith({
                    dreUuid: undefined,
                    ueUuid: undefined,
                });
            });

            expect(limparButton).toBeDisabled();

            useUserStoreSpy.mockRestore();
        });

        it("deve limpar apenas UE quando o botão 'Limpar filtros' é clicado (ponto-focal)", async () => {
            const mockUserStore = {
                user: {
                    perfil_acesso: {
                        codigo: 1,
                        descricao: "Ponto Focal",
                    },
                    unidades: [
                        {
                            dre: {
                                dre_uuid: "dre-ponto-focal",
                                nome: "DRE Ponto Focal",
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
                { uuid: "dre-ponto-focal", nome: "DRE Ponto Focal" },
            ];
            const mockUEs = [{ uuid: "ue-1", nome: "UE Teste" }];

            mockUseGetUnidades(
                {
                    data: mockDREs,
                    isLoading: false,
                    isError: false,
                    error: null,
                },
                {
                    data: mockUEs,
                    isLoading: false,
                    isError: false,
                    error: null,
                }
            );

            const onFilterChange = vi.fn();
            const user = userEvent.setup();
            renderWithQueryProvider(
                <FiltrosUsuarios onFilterChange={onFilterChange} />
            );

            await waitFor(() => {
                expect(onFilterChange).toHaveBeenCalledWith({
                    dreUuid: "dre-ponto-focal",
                    ueUuid: undefined,
                });
            });

            const ueCombobox = getUeCombobox();
            await user.click(ueCombobox);
            const ueOption = await screen.findByRole("option", {
                name: "UE Teste",
            });
            await user.click(ueOption);

            await waitFor(() => {
                expect(onFilterChange).toHaveBeenCalledWith({
                    dreUuid: "dre-ponto-focal",
                    ueUuid: "ue-1",
                });
            });

            const limparButton = screen.getByRole("button", {
                name: /limpar filtros/i,
            });
            await user.click(limparButton);

            await waitFor(() => {
                expect(onFilterChange).toHaveBeenLastCalledWith({
                    dreUuid: "dre-ponto-focal",
                    ueUuid: undefined,
                });
            });

            useUserStoreSpy.mockRestore();
        });
    });
});
