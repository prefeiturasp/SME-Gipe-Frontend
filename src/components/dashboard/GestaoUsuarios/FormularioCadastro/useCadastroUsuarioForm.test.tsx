import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCadastroUsuarioForm } from "./useCadastroUsuarioForm";
import * as useUnidadesModule from "@/hooks/useUnidades";
import * as useCadastroGestaoUsuarioModule from "@/hooks/useCadastroGestaoUsuario";
import * as useAtualizarGestaoUsuarioModule from "@/hooks/useAtualizarGestaoUsuario";
import * as useObterUsuarioGestaoModule from "@/hooks/useObterUsuarioGestao";
import { toast } from "@/components/ui/headless-toast";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/components/ui/headless-toast", () => ({
    toast: vi.fn(),
}));

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: vi.fn(() => ({
        user: null,
    })),
}));

vi.mock("@/hooks/useUserPermissions", () => ({
    useUserPermissions: vi.fn(() => ({
        isPontoFocal: false,
        isGipe: false,
        isAssistenteOuDiretor: false,
        isGipeAdmin: false,
    })),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
    Wrapper.displayName = "QueryClientWrapper";
    return Wrapper;
};

describe("useCadastroUsuarioForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.spyOn(useUnidadesModule, "useFetchDREs").mockReturnValue({
            data: [
                { uuid: "dre-1", codigo_eol: "000001", nome: "DRE Centro" },
                { uuid: "dre-2", codigo_eol: "000002", nome: "DRE Sul" },
            ],
            isLoading: false,
            error: null,
        } as never);

        vi.spyOn(useUnidadesModule, "useFetchUEs").mockReturnValue({
            data: [
                { uuid: "ue-1", codigo_eol: "100001", nome: "EMEF Test 1" },
                { uuid: "ue-2", codigo_eol: "100002", nome: "EMEF Test 2" },
            ],
            isLoading: false,
            error: null,
        } as never);

        vi.spyOn(
            useCadastroGestaoUsuarioModule,
            "useCadastroGestaoUsuario"
        ).mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
        } as never);

        vi.spyOn(
            useAtualizarGestaoUsuarioModule,
            "useAtualizarGestaoUsuario"
        ).mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
        } as never);

        vi.spyOn(
            useObterUsuarioGestaoModule,
            "useObterUsuarioGestao"
        ).mockReturnValue({
            data: undefined,
            isLoading: false,
            error: null,
        } as never);
    });

    it("inicializa com valores padrão corretos", () => {
        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        expect(result.current.form.getValues()).toMatchObject({
            rede: "",
            cargo: "",
            fullName: "",
            rf: "",
            cpf: "",
            email: "",
            dre: "",
            ue: "",
            isAdmin: false,
        });
        expect(result.current.modalOpen).toBe(false);
    });

    it("carrega opções de DRE e UE corretamente", async () => {
        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => {
            expect(result.current.dreOptions).toHaveLength(2);
            expect(result.current.ueOptions).toHaveLength(2);
        });

        expect(result.current.dreOptions[0]).toEqual({
            uuid: "dre-1",
            codigo_eol: "000001",
            nome: "DRE Centro",
        });
    });

    it("calcula cargoOptions corretamente para rede DIRETA (usuário não-GIPE)", async () => {
        const { result, rerender } = renderHook(
            () => useCadastroUsuarioForm(),
            {
                wrapper: createWrapper(),
            }
        );

        act(() => {
            result.current.form.setValue("rede", "DIRETA");
        });
        rerender();

        expect(result.current.cargoOptions).toHaveLength(3);
        const cargoLabels = result.current.cargoOptions.map((opt) => opt.label);
        expect(cargoLabels).not.toContain("GIPE");
        expect(cargoLabels).toContain("Ponto focal");
        expect(cargoLabels).toContain("Assistente de direção");
        expect(cargoLabels).toContain("Diretor(a)");
    });

    it("calcula cargoOptions corretamente para rede DIRETA (usuário GIPE)", async () => {
        const useUserPermissions = await import("@/hooks/useUserPermissions");
        const mockUseUserPermissions = vi.mocked(
            useUserPermissions.useUserPermissions
        );

        mockUseUserPermissions.mockReturnValue({
            isPontoFocal: false,
            isGipe: true,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });

        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.form.setValue("rede", "DIRETA");
        });

        await waitFor(() => {
            expect(result.current.cargoOptions).toHaveLength(4);
        });

        const cargoLabels = result.current.cargoOptions.map((opt) => opt.label);
        expect(cargoLabels).toContain("GIPE");
        expect(cargoLabels).toContain("Ponto focal");
        expect(cargoLabels).toContain("Assistente de direção");
        expect(cargoLabels).toContain("Diretor(a)");

        mockUseUserPermissions.mockReturnValue({
            isPontoFocal: false,
            isGipe: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });
    });

    it("calcula cargoOptions corretamente para rede INDIRETA", async () => {
        const { result, rerender } = renderHook(
            () => useCadastroUsuarioForm(),
            {
                wrapper: createWrapper(),
            }
        );

        act(() => {
            result.current.form.setValue("rede", "INDIRETA");
        });
        rerender();

        expect(result.current.cargoOptions).toHaveLength(2);
        const cargoLabels = result.current.cargoOptions.map((opt) => opt.label);
        expect(cargoLabels).toContain("Assistente de direção");
        expect(cargoLabels).toContain("Diretor(a)");
    });

    it("limpa campos ao trocar de rede", async () => {
        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.form.setValue("rede", "DIRETA");
            result.current.form.setValue("cargo", "diretor");
            result.current.form.setValue("fullName", "João Silva");
        });

        act(() => {
            result.current.handleRedeChange("INDIRETA");
        });

        await waitFor(() => {
            expect(result.current.form.getValues("cargo")).toBe("");
            expect(result.current.form.getValues("fullName")).toBe("");
        });
    });

    it("limpa campos ao trocar de cargo de diretor para ponto_focal", async () => {
        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.form.setValue("rede", "DIRETA");
            result.current.form.setValue("cargo", "diretor");
            result.current.form.setValue("dre", "dre-1");
            result.current.form.setValue("ue", "ue-1");
        });

        act(() => {
            result.current.handleCargoChange("ponto_focal");
        });

        await waitFor(() => {
            expect(result.current.form.getValues("ue")).toBe("");
        });
    });

    it("limpa campo UE ao trocar cargo para gipe", async () => {
        const useUserPermissions = await import("@/hooks/useUserPermissions");
        const mockUseUserPermissions = vi.mocked(
            useUserPermissions.useUserPermissions
        );

        mockUseUserPermissions.mockReturnValue({
            isPontoFocal: false,
            isGipe: true,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });

        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.form.setValue("rede", "DIRETA");
            result.current.form.setValue("cargo", "diretor");
            result.current.form.setValue("dre", "dre-1");
            result.current.form.setValue("ue", "ue-1");
        });

        act(() => {
            result.current.handleCargoChange("gipe");
        });

        await waitFor(() => {
            expect(result.current.form.getValues("ue")).toBe("");
        });

        mockUseUserPermissions.mockReturnValue({
            isPontoFocal: false,
            isGipe: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });
    });

    it("pré-seleciona DRE quando usuário é ponto focal", async () => {
        const useUserPermissions = await import("@/hooks/useUserPermissions");
        const useUserStore = await import("@/stores/useUserStore");

        const mockUseUserPermissions = vi.mocked(
            useUserPermissions.useUserPermissions
        );
        const mockUseUserStore = vi.mocked(useUserStore.useUserStore);

        const mockUser = {
            username: "ponto.focal",
            name: "Ponto Focal",
            email: "ponto.focal@sme.prefeitura.sp.gov.br",
            cpf: "12345678900",
            rede: "DIRETA",
            is_core_sso: true,
            is_validado: true,
            is_app_admin: false,
            perfil_acesso: {
                codigo: 3,
                nome: "Ponto Focal",
            },
            unidades: [
                {
                    ue: {
                        ue_uuid: null,
                        codigo_eol: null,
                        nome: null,
                        sigla: null,
                    },
                    dre: {
                        dre_uuid: "dre-123",
                        codigo_eol: "108800",
                        nome: "DRE Butantã",
                        sigla: "BT",
                    },
                },
            ],
        };

        mockUseUserPermissions.mockReturnValue({
            isPontoFocal: true,
            isGipe: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });

        mockUseUserStore.mockImplementation((selector: unknown) => {
            if (typeof selector === "function") {
                return selector({ user: mockUser });
            }
            return { user: mockUser };
        });

        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.form.setValue("rede", "DIRETA");
            result.current.form.setValue("cargo", "diretor");
        });

        await waitFor(() => {
            const dreValue = result.current.form.getValues("dre");
            expect(dreValue).toBe("dre-123");
        });

        expect(result.current.isDreDisabled).toBe(true);

        mockUseUserPermissions.mockReturnValue({
            isPontoFocal: false,
            isGipe: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });
        mockUseUserStore.mockReturnValue({ user: null });
    });

    it("não pré-seleciona DRE quando usuário ponto focal não tem unidade", async () => {
        const useUserPermissions = await import("@/hooks/useUserPermissions");
        const useUserStore = await import("@/stores/useUserStore");

        const mockUseUserPermissions = vi.mocked(
            useUserPermissions.useUserPermissions
        );
        const mockUseUserStore = vi.mocked(useUserStore.useUserStore);

        const mockUser = {
            username: "ponto.focal",
            name: "Ponto Focal",
            email: "ponto.focal@sme.prefeitura.sp.gov.br",
            cpf: "12345678900",
            rede: "DIRETA",
            is_core_sso: true,
            is_validado: true,
            is_app_admin: false,
            perfil_acesso: {
                codigo: 3,
                nome: "Ponto Focal",
            },
            unidades: [],
        };

        mockUseUserPermissions.mockReturnValue({
            isPontoFocal: true,
            isGipe: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });

        mockUseUserStore.mockImplementation((selector: unknown) => {
            if (typeof selector === "function") {
                return selector({ user: mockUser });
            }
            return { user: mockUser };
        });

        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.form.setValue("rede", "DIRETA");
            result.current.form.setValue("cargo", "diretor");
        });

        await waitFor(() => {
            expect(result.current.form.getValues("dre")).toBe("");
        });

        mockUseUserPermissions.mockReturnValue({
            isPontoFocal: false,
            isGipe: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });
        mockUseUserStore.mockReturnValue({ user: null });
    });

    it("não pré-seleciona DRE quando usuário ponto focal tem unidade sem dre_uuid", async () => {
        const useUserPermissions = await import("@/hooks/useUserPermissions");
        const useUserStore = await import("@/stores/useUserStore");

        const mockUseUserPermissions = vi.mocked(
            useUserPermissions.useUserPermissions
        );
        const mockUseUserStore = vi.mocked(useUserStore.useUserStore);

        const mockUser = {
            username: "ponto.focal",
            name: "Ponto Focal",
            email: "ponto.focal@sme.prefeitura.sp.gov.br",
            cpf: "12345678900",
            rede: "DIRETA",
            is_core_sso: true,
            is_validado: true,
            is_app_admin: false,
            perfil_acesso: {
                codigo: 3,
                nome: "Ponto Focal",
            },
            unidades: [
                {
                    ue: {
                        ue_uuid: null,
                        codigo_eol: null,
                        nome: null,
                        sigla: null,
                    },
                    dre: {
                        dre_uuid: null,
                        codigo_eol: "108800",
                        nome: "DRE Butantã",
                        sigla: "BT",
                    },
                },
            ],
        };

        mockUseUserPermissions.mockReturnValue({
            isPontoFocal: true,
            isGipe: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });

        mockUseUserStore.mockImplementation((selector: unknown) => {
            if (typeof selector === "function") {
                return selector({ user: mockUser });
            }
            return { user: mockUser };
        });

        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.form.setValue("rede", "DIRETA");
            result.current.form.setValue("cargo", "diretor");
        });

        await waitFor(() => {
            expect(result.current.form.getValues("dre")).toBe("");
        });

        mockUseUserPermissions.mockReturnValue({
            isPontoFocal: false,
            isGipe: false,
            isAssistenteOuDiretor: false,
            isGipeAdmin: false,
        });
        mockUseUserStore.mockReturnValue({ user: null });
    });

    it("handleSubmitClick abre o modal", async () => {
        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        const mockEvent = {
            preventDefault: vi.fn(),
        } as unknown as React.MouseEvent<HTMLButtonElement>;

        act(() => {
            result.current.handleSubmitClick(mockEvent);
        });

        await waitFor(() => {
            expect(result.current.modalOpen).toBe(true);
        });
    });

    it("handleConfirmCadastro chama mutation com sucesso e redireciona", async () => {
        const mockMutate = vi.fn((payload, options) => {
            options?.onSuccess({ success: true });
        });

        vi.spyOn(
            useCadastroGestaoUsuarioModule,
            "useCadastroGestaoUsuario"
        ).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        } as never);

        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.form.setValue("rede", "DIRETA");
            result.current.form.setValue("cargo", "diretor");
            result.current.form.setValue("fullName", "João Silva");
            result.current.form.setValue("rf", "123456");
            result.current.form.setValue("email", "joao@exemplo.com");
            result.current.form.setValue("dre", "dre-1");
            result.current.form.setValue("ue", "ue-1");
            result.current.setModalOpen(true);
        });

        act(() => {
            result.current.handleConfirmCadastro();
        });

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
            expect(toast).toHaveBeenCalledWith({
                title: "Tudo certo por aqui!",
                description: "A pessoa usuária foi cadastrada com sucesso!",
                variant: "success",
            });
            expect(result.current.modalOpen).toBe(false);
            expect(mockPush).toHaveBeenCalledWith(
                "/dashboard/gestao-usuarios?tab=ativos"
            );
        });
    });

    it("handleConfirmCadastro exibe toast de erro quando API retorna erro", async () => {
        const mockMutate = vi.fn((payload, options) => {
            options?.onSuccess({
                success: false,
                error: "Email já cadastrado",
            });
        });

        vi.spyOn(
            useCadastroGestaoUsuarioModule,
            "useCadastroGestaoUsuario"
        ).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        } as never);

        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.form.setValue("rede", "DIRETA");
            result.current.form.setValue("cargo", "gipe");
            result.current.form.setValue("fullName", "Maria Santos");
            result.current.form.setValue("email", "maria@exemplo.com");
        });

        act(() => {
            result.current.handleConfirmCadastro();
        });

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith({
                title: "Não conseguimos concluir a ação!",
                description: "Email já cadastrado",
                variant: "error",
            });
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    it("handleConfirmCadastro exibe toast de erro quando mutation falha", async () => {
        const mockMutate = vi.fn((payload, options) => {
            options?.onError(new Error("Network error"));
        });

        vi.spyOn(
            useCadastroGestaoUsuarioModule,
            "useCadastroGestaoUsuario"
        ).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        } as never);

        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.form.setValue("rede", "INDIRETA");
            result.current.form.setValue("cargo", "diretor");
            result.current.form.setValue("fullName", "Pedro Costa");
            result.current.form.setValue("cpf", "12345678901");
            result.current.form.setValue("email", "pedro@exemplo.com");
            result.current.form.setValue("dre", "dre-2");
            result.current.form.setValue("ue", "ue-2");
        });

        act(() => {
            result.current.handleConfirmCadastro();
        });

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith({
                title: "Erro no servidor",
                description: "Tente novamente mais tarde.",
                variant: "error",
            });
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    it("handleConfirmCadastro constrói payload corretamente para GIPE", async () => {
        const mockMutate = vi.fn((payload, options) => {
            options?.onSuccess({ success: true });
        });

        vi.spyOn(
            useCadastroGestaoUsuarioModule,
            "useCadastroGestaoUsuario"
        ).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        } as never);

        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.form.setValue("rede", "DIRETA");
        });

        await waitFor(() => {
            expect(result.current.form.getValues("cargo")).toBe("");
        });

        act(() => {
            result.current.form.setValue("cargo", "gipe");
        });

        await waitFor(() => {
            expect(result.current.cargoOptions).toHaveLength(3);
        });

        act(() => {
            result.current.form.setValue("fullName", "Ana GIPE");
            result.current.form.setValue("email", "ana.gipe@exemplo.com");
        });

        await waitFor(() => {
            expect(result.current.form.getValues("fullName")).toBe("Ana GIPE");
        });

        act(() => {
            result.current.handleConfirmCadastro();
        });

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
        });

        const callArgs = mockMutate.mock.calls[0][0];
        expect(callArgs).toMatchObject({
            name: "Ana GIPE",
            email: "ana.gipe@exemplo.com",
            rede: "DIRETA",
            is_app_admin: false,
        });
    });

    it("handleConfirmCadastro exibe mensagem padrão quando API retorna erro sem descrição", async () => {
        const mockMutate = vi.fn((payload, options) => {
            options?.onSuccess({
                success: false,
            });
        });

        vi.spyOn(
            useCadastroGestaoUsuarioModule,
            "useCadastroGestaoUsuario"
        ).mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        } as never);

        const { result } = renderHook(() => useCadastroUsuarioForm(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.form.setValue("rede", "DIRETA");
        });

        await waitFor(() => {
            expect(result.current.form.getValues("cargo")).toBe("");
        });

        act(() => {
            result.current.form.setValue("cargo", "ponto_focal");
        });

        act(() => {
            result.current.form.setValue("fullName", "Carlos Teste");
            result.current.form.setValue("rf", "789012");
            result.current.form.setValue("email", "carlos@exemplo.com");
            result.current.form.setValue("dre", "dre-1");
        });

        await waitFor(() => {
            expect(result.current.form.getValues("fullName")).toBe(
                "Carlos Teste"
            );
        });

        act(() => {
            result.current.handleConfirmCadastro();
        });

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith({
                title: "Não conseguimos concluir a ação!",
                description: "Erro ao cadastrar usuário.",
                variant: "error",
            });
            expect(mockPush).not.toHaveBeenCalled();
        });
    });

    describe("Modo Edit", () => {
        it("deve inicializar no modo edit corretamente", () => {
            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            expect(result.current.mode).toBe("edit");
        });

        it("deve carregar dados do usuário e preencher o formulário", async () => {
            const mockUsuarioData = {
                username: "joao.silva",
                name: "João Silva",
                email: "joao@exemplo.com",
                cpf: "12345678900",
                cargo: 3360,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: "000001",
                codigo_eol_unidade: "100001",
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                const values = result.current.form.getValues();
                expect(values.fullName).toBe("João Silva");
                expect(values.email).toBe("joao@exemplo.com");
                expect(values.cpf).toBe("12345678900");
                expect(values.rede).toBe("DIRETA");
                expect(values.cargo).toBe("diretor");
                expect(values.rf).toBe("joao.silva");
                expect(values.dre).toBe("dre-1");
            });
        });

        it("deve carregar UE após carregar DRE", async () => {
            const mockUsuarioData = {
                username: "maria.santos",
                name: "Maria Santos",
                email: "maria@exemplo.com",
                cpf: "98765432100",
                cargo: 3360,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: "000001",
                codigo_eol_unidade: "100001",
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-456",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("dre")).toBe("dre-1");
            });

            await waitFor(() => {
                expect(result.current.form.getValues("ue")).toBe("ue-1");
            });
        });

        it("handleSubmitClick no modo edit não abre modal e chama diretamente handleConfirmCadastro", async () => {
            const mockMutate = vi.fn();

            vi.spyOn(
                useAtualizarGestaoUsuarioModule,
                "useAtualizarGestaoUsuario"
            ).mockReturnValue({
                mutate: mockMutate,
                isPending: false,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.MouseEvent<HTMLButtonElement>;

            act(() => {
                result.current.form.setValue("rede", "DIRETA");
                result.current.form.setValue("cargo", "diretor");
                result.current.form.setValue("fullName", "João Silva");
                result.current.form.setValue("email", "joao@exemplo.com");
            });

            act(() => {
                result.current.handleSubmitClick(mockEvent);
            });

            await waitFor(() => {
                expect(result.current.modalOpen).toBe(false);
                expect(mockMutate).toHaveBeenCalled();
            });
        });

        it("handleConfirmCadastro chama atualizarUsuario com sucesso", async () => {
            const mockMutate = vi.fn((payload, options) => {
                options?.onSuccess({ success: true });
            });

            vi.spyOn(
                useAtualizarGestaoUsuarioModule,
                "useAtualizarGestaoUsuario"
            ).mockReturnValue({
                mutate: mockMutate,
                isPending: false,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            act(() => {
                result.current.form.setValue("rede", "DIRETA");
                result.current.form.setValue("cargo", "diretor");
                result.current.form.setValue("fullName", "João Silva");
                result.current.form.setValue("rf", "123456");
                result.current.form.setValue("email", "joao@exemplo.com");
                result.current.form.setValue("dre", "dre-1");
                result.current.form.setValue("ue", "ue-1");
            });

            act(() => {
                result.current.handleConfirmCadastro();
            });

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalled();
                expect(toast).toHaveBeenCalledWith({
                    title: "Tudo certo por aqui!",
                    description: "Usuário atualizado com sucesso!",
                    variant: "success",
                });
                expect(mockPush).toHaveBeenCalledWith(
                    "/dashboard/gestao-usuarios?tab=ativos"
                );
            });
        });

        it("handleConfirmCadastro exibe erro quando atualizarUsuario falha", async () => {
            const mockMutate = vi.fn((payload, options) => {
                options?.onSuccess({
                    success: false,
                    error: "Email já está em uso",
                });
            });

            vi.spyOn(
                useAtualizarGestaoUsuarioModule,
                "useAtualizarGestaoUsuario"
            ).mockReturnValue({
                mutate: mockMutate,
                isPending: false,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            act(() => {
                result.current.form.setValue("rede", "DIRETA");
                result.current.form.setValue("cargo", "diretor");
                result.current.form.setValue("fullName", "João Silva");
                result.current.form.setValue("email", "joao@exemplo.com");
            });

            act(() => {
                result.current.handleConfirmCadastro();
            });

            await waitFor(() => {
                expect(toast).toHaveBeenCalledWith({
                    title: "Não conseguimos concluir a ação!",
                    description: "Email já está em uso",
                    variant: "error",
                });
                expect(mockPush).not.toHaveBeenCalled();
            });
        });

        it("handleConfirmCadastro exibe mensagem de erro padrão quando API retorna erro sem descrição", async () => {
            const mockMutate = vi.fn((payload, options) => {
                options?.onSuccess({
                    success: false,
                });
            });

            vi.spyOn(
                useAtualizarGestaoUsuarioModule,
                "useAtualizarGestaoUsuario"
            ).mockReturnValue({
                mutate: mockMutate,
                isPending: false,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            act(() => {
                result.current.form.setValue("rede", "DIRETA");
                result.current.form.setValue("cargo", "gipe");
                result.current.form.setValue("fullName", "Ana GIPE");
                result.current.form.setValue("email", "ana@exemplo.com");
            });

            act(() => {
                result.current.handleConfirmCadastro();
            });

            await waitFor(() => {
                expect(toast).toHaveBeenCalledWith({
                    title: "Não conseguimos concluir a ação!",
                    description: "Erro ao atualizar usuário.",
                    variant: "error",
                });
            });
        });

        it("handleConfirmCadastro exibe erro quando mutation falha completamente", async () => {
            const mockMutate = vi.fn((payload, options) => {
                options?.onError(new Error("Network error"));
            });

            vi.spyOn(
                useAtualizarGestaoUsuarioModule,
                "useAtualizarGestaoUsuario"
            ).mockReturnValue({
                mutate: mockMutate,
                isPending: false,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            act(() => {
                result.current.form.setValue("rede", "DIRETA");
                result.current.form.setValue("cargo", "diretor");
                result.current.form.setValue("fullName", "Pedro Lima");
                result.current.form.setValue("email", "pedro@exemplo.com");
            });

            act(() => {
                result.current.handleConfirmCadastro();
            });

            await waitFor(() => {
                expect(toast).toHaveBeenCalledWith({
                    title: "Erro no servidor",
                    description: "Tente novamente mais tarde.",
                    variant: "error",
                });
            });
        });

        it("não limpa campos ao trocar de rede durante carregamento inicial", async () => {
            const mockUsuarioData = {
                username: "joao.silva",
                name: "João Silva",
                email: "joao@exemplo.com",
                cpf: "12345678900",
                cargo: 3360,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: "000001",
                codigo_eol_unidade: "100001",
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("fullName")).toBe(
                    "João Silva"
                );
            });

            act(() => {
                result.current.handleRedeChange("INDIRETA");
            });

            expect(result.current.form.getValues("fullName")).toBe(
                "João Silva"
            );
            expect(result.current.form.getValues("rede")).toBe("DIRETA");
        });

        it("limpa campos ao trocar de rede após carregamento completo no modo edit", async () => {
            const mockUsuarioData = {
                username: "joao.silva",
                name: "João Silva",
                email: "joao@exemplo.com",
                cpf: "12345678900",
                cargo: 3360,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: "000001",
                codigo_eol_unidade: "100001",
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("fullName")).toBe(
                    "João Silva"
                );
            });

            await waitFor(
                () => {
                    expect(result.current.form.getValues("ue")).toBe("ue-1");
                },
                { timeout: 1000 }
            );

            await new Promise((resolve) => setTimeout(resolve, 300));

            act(() => {
                result.current.handleRedeChange("INDIRETA");
            });

            await waitFor(() => {
                expect(result.current.form.getValues("rede")).toBe("INDIRETA");
                expect(result.current.form.getValues("cargo")).toBe("");
                expect(result.current.form.getValues("dre")).toBe("");
                expect(result.current.form.getValues("ue")).toBe("");
            });
        });

        it("hasChanges retorna isDirty do formulário", async () => {
            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            expect(result.current.hasChanges).toBe(false);

            act(() => {
                result.current.form.setValue("email", "novo@exemplo.com", {
                    shouldDirty: true,
                });
            });

            await waitFor(() => {
                expect(result.current.hasChanges).toBe(true);
            });
        });

        it("isPending retorna isPendingUpdate no modo edit", () => {
            vi.spyOn(
                useAtualizarGestaoUsuarioModule,
                "useAtualizarGestaoUsuario"
            ).mockReturnValue({
                mutate: vi.fn(),
                isPending: true,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            expect(result.current.isPending).toBe(true);
        });

        it("mapeia cargo 2 (DRE) corretamente", async () => {
            const mockUsuarioData = {
                username: "ponto.focal",
                name: "Ponto Focal Test",
                email: "ponto@exemplo.com",
                cpf: "11111111111",
                cargo: 1,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: "000001",
                codigo_eol_unidade: null,
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-789",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("cargo")).toBe(
                    "ponto_focal"
                );
            });
        });

        it("mapeia cargo 4 (GIPE) corretamente", async () => {
            const mockUsuarioData = {
                username: "gipe.user",
                name: "GIPE Test",
                email: "gipe@exemplo.com",
                cpf: "22222222222",
                cargo: 0,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: null,
                codigo_eol_unidade: null,
                is_app_admin: true,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-999",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("cargo")).toBe("gipe");
                expect(result.current.form.getValues("isAdmin")).toBe(true);
            });
        });

        it("não altera DRE ao chamar handleDreChange com mesmo valor", async () => {
            const mockUsuarioData = {
                username: "joao.silva",
                name: "João Silva",
                email: "joao@exemplo.com",
                cpf: "12345678900",
                cargo: 3360,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: "000001",
                codigo_eol_unidade: "100001",
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("dre")).toBe("dre-1");
            });

            await waitFor(
                () => {
                    expect(result.current.form.getValues("ue")).toBe("ue-1");
                },
                { timeout: 1000 }
            );

            await new Promise((resolve) => setTimeout(resolve, 300));

            act(() => {
                result.current.handleDreChange("dre-1");
            });

            expect(result.current.form.getValues("dre")).toBe("dre-1");
            expect(result.current.form.getValues("ue")).toBe("ue-1");
        });

        it("não altera DRE durante carregamento inicial no modo edit", async () => {
            const mockUsuarioData = {
                username: "joao.silva",
                name: "João Silva",
                email: "joao@exemplo.com",
                cpf: "12345678900",
                cargo: 3360,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: "000001",
                codigo_eol_unidade: "100001",
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("dre")).toBe("dre-1");
            });

            act(() => {
                result.current.handleDreChange("dre-2");
            });

            expect(result.current.form.getValues("dre")).toBe("dre-1");
        });

        it("não altera cargo durante carregamento inicial no modo edit", async () => {
            const mockUsuarioData = {
                username: "joao.silva",
                name: "João Silva",
                email: "joao@exemplo.com",
                cpf: "12345678900",
                cargo: 3360,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: "000001",
                codigo_eol_unidade: "100001",
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("cargo")).toBe("diretor");
            });

            act(() => {
                result.current.handleCargoChange("ponto_focal");
            });

            expect(result.current.form.getValues("cargo")).toBe("diretor");
        });

        it("altera DRE após carregamento completo no modo edit", async () => {
            const mockUsuarioData = {
                username: "joao.silva",
                name: "João Silva",
                email: "joao@exemplo.com",
                cpf: "12345678900",
                cargo: 3360,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: "000001",
                codigo_eol_unidade: "100001",
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("dre")).toBe("dre-1");
            });

            await waitFor(
                () => {
                    expect(result.current.form.getValues("ue")).toBe("ue-1");
                },
                { timeout: 1000 }
            );

            await new Promise((resolve) => setTimeout(resolve, 300));

            act(() => {
                result.current.handleDreChange("dre-2");
            });

            await waitFor(() => {
                expect(result.current.form.getValues("dre")).toBe("dre-2");
                expect(result.current.form.getValues("ue")).toBe("");
            });
        });

        it("altera cargo após carregamento completo no modo edit", async () => {
            const mockUsuarioData = {
                username: "joao.silva",
                name: "João Silva",
                email: "joao@exemplo.com",
                cpf: "12345678900",
                cargo: 3360,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: "000001",
                codigo_eol_unidade: "100001",
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("cargo")).toBe("diretor");
            });

            await waitFor(
                () => {
                    expect(result.current.form.getValues("ue")).toBe("ue-1");
                },
                { timeout: 1000 }
            );

            await new Promise((resolve) => setTimeout(resolve, 300));

            act(() => {
                result.current.handleCargoChange("ponto_focal");
            });

            await waitFor(() => {
                expect(result.current.form.getValues("cargo")).toBe(
                    "ponto_focal"
                );
                expect(result.current.form.getValues("ue")).toBe("");
            });
        });

        it("carrega usuário INDIRETA e deixa rf vazio", async () => {
            const mockUsuarioData = {
                username: "12345678900",
                name: "Maria Costa",
                email: "maria@exemplo.com",
                cpf: "12345678900",
                cargo: 3360,
                rede: "INDIRETA" as const,
                codigo_eol_dre_da_unidade: null,
                codigo_eol_unidade: "100001",
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-999",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("fullName")).toBe(
                    "Maria Costa"
                );
                expect(result.current.form.getValues("rede")).toBe("INDIRETA");
                expect(result.current.form.getValues("rf")).toBe("");
            });
        });

        it("carrega usuário sem DRE correspondente", async () => {
            const mockUsuarioData = {
                username: "joao.silva",
                name: "João Silva",
                email: "joao@exemplo.com",
                cpf: "12345678900",
                cargo: 3360,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: "999999",
                codigo_eol_unidade: null,
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-888",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("fullName")).toBe(
                    "João Silva"
                );
                expect(result.current.form.getValues("dre")).toBe("");
            });
        });

        it("não chama handleRedeChange quando valor é o mesmo no modo create", async () => {
            const { result } = renderHook(() => useCadastroUsuarioForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.form.setValue("rede", "DIRETA");
                result.current.form.setValue("cargo", "diretor");
                result.current.form.setValue("fullName", "João Silva");
            });

            await waitFor(() => {
                expect(result.current.form.getValues("rede")).toBe("DIRETA");
            });

            act(() => {
                result.current.handleRedeChange("DIRETA");
            });

            expect(result.current.form.getValues("rede")).toBe("DIRETA");
            expect(result.current.form.getValues("fullName")).toBe(
                "João Silva"
            );
        });

        it("não chama handleCargoChange quando valor é o mesmo no modo create", async () => {
            const { result } = renderHook(() => useCadastroUsuarioForm(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.form.setValue("rede", "DIRETA");
                result.current.form.setValue("cargo", "diretor");
                result.current.form.setValue("dre", "dre-1");
                result.current.form.setValue("ue", "ue-1");
            });

            await waitFor(() => {
                expect(result.current.form.getValues("cargo")).toBe("diretor");
            });

            act(() => {
                result.current.handleCargoChange("diretor");
            });

            expect(result.current.form.getValues("cargo")).toBe("diretor");
            expect(result.current.form.getValues("ue")).toBe("ue-1");
        });

        it("pré-seleciona DRE para ponto focal no modo edit após carregamento", async () => {
            const useUserPermissions = await import(
                "@/hooks/useUserPermissions"
            );
            const useUserStore = await import("@/stores/useUserStore");

            const mockUseUserPermissions = vi.mocked(
                useUserPermissions.useUserPermissions
            );
            const mockUseUserStore = vi.mocked(useUserStore.useUserStore);

            const mockUser = {
                username: "ponto.focal",
                name: "Ponto Focal",
                email: "ponto.focal@sme.prefeitura.sp.gov.br",
                cpf: "12345678900",
                rede: "DIRETA",
                is_core_sso: true,
                is_validado: true,
                is_app_admin: false,
                perfil_acesso: {
                    codigo: 1,
                    nome: "Ponto Focal",
                },
                unidades: [
                    {
                        ue: {
                            ue_uuid: null,
                            codigo_eol: null,
                            nome: null,
                            sigla: null,
                        },
                        dre: {
                            dre_uuid: "dre-123",
                            codigo_eol: "108800",
                            nome: "DRE Butantã",
                            sigla: "BT",
                        },
                    },
                ],
            };

            mockUseUserPermissions.mockReturnValue({
                isPontoFocal: true,
                isGipe: false,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            });

            mockUseUserStore.mockImplementation((selector: unknown) => {
                if (typeof selector === "function") {
                    return selector({ user: mockUser });
                }
                return { user: mockUser };
            });

            const mockUsuarioData = {
                username: "joao.silva",
                name: "João Silva",
                email: "joao@exemplo.com",
                cpf: "12345678900",
                cargo: 3360,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: null,
                codigo_eol_unidade: null,
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("fullName")).toBe(
                    "João Silva"
                );
            });

            await new Promise((resolve) => setTimeout(resolve, 300));

            await waitFor(() => {
                expect(result.current.form.getValues("dre")).toBe("dre-123");
            });

            mockUseUserPermissions.mockReturnValue({
                isPontoFocal: false,
                isGipe: false,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            });
            mockUseUserStore.mockReturnValue({ user: null });
        });

        it("pré-seleciona DRE vazio quando ponto focal tem dre_uuid null", async () => {
            const useUserPermissions = await import(
                "@/hooks/useUserPermissions"
            );
            const useUserStore = await import("@/stores/useUserStore");

            const mockUseUserPermissions = vi.mocked(
                useUserPermissions.useUserPermissions
            );
            const mockUseUserStore = vi.mocked(useUserStore.useUserStore);

            const mockUser = {
                username: "ponto.focal",
                name: "Ponto Focal",
                email: "ponto.focal@sme.prefeitura.sp.gov.br",
                cpf: "12345678900",
                rede: "DIRETA",
                is_core_sso: true,
                is_validado: true,
                is_app_admin: false,
                perfil_acesso: {
                    codigo: 1,
                    nome: "Ponto Focal",
                },
                unidades: [
                    {
                        ue: {
                            ue_uuid: null,
                            codigo_eol: null,
                            nome: null,
                            sigla: null,
                        },
                        dre: {
                            dre_uuid: null,
                            codigo_eol: "108800",
                            nome: "DRE Butantã",
                            sigla: "BT",
                        },
                    },
                ],
            };

            mockUseUserPermissions.mockReturnValue({
                isPontoFocal: true,
                isGipe: false,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            });

            mockUseUserStore.mockImplementation((selector: unknown) => {
                if (typeof selector === "function") {
                    return selector({ user: mockUser });
                }
                return { user: mockUser };
            });

            const mockUsuarioData = {
                username: "joao.silva",
                name: "João Silva",
                email: "joao@exemplo.com",
                cpf: "12345678900",
                cargo: 3360,
                rede: "DIRETA" as const,
                codigo_eol_dre_da_unidade: null,
                codigo_eol_unidade: null,
                is_app_admin: false,
            };

            vi.spyOn(
                useObterUsuarioGestaoModule,
                "useObterUsuarioGestao"
            ).mockReturnValue({
                data: mockUsuarioData,
                isLoading: false,
                error: null,
            } as never);

            const { result } = renderHook(
                () =>
                    useCadastroUsuarioForm({
                        mode: "edit",
                        usuarioUuid: "usuario-123",
                    }),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.form.getValues("fullName")).toBe(
                    "João Silva"
                );
            });

            await new Promise((resolve) => setTimeout(resolve, 300));

            expect(result.current.form.getValues("dre")).toBe("");

            mockUseUserPermissions.mockReturnValue({
                isPontoFocal: false,
                isGipe: false,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            });
            mockUseUserStore.mockReturnValue({ user: null });
        });
    });
});
