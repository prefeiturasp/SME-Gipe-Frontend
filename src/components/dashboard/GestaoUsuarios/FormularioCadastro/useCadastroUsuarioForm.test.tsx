import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCadastroUsuarioForm } from "./useCadastroUsuarioForm";
import * as useUnidadesModule from "@/hooks/useUnidades";
import * as useCadastroGestaoUsuarioModule from "@/hooks/useCadastroGestaoUsuario";
import { toast } from "@/components/ui/headless-toast";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/components/ui/headless-toast", () => ({
    toast: vi.fn(),
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

    it("calcula cargoOptions corretamente para rede DIRETA", async () => {
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

        expect(result.current.cargoOptions).toHaveLength(4);
        const cargoLabels = result.current.cargoOptions.map((opt) => opt.label);
        expect(cargoLabels).toContain("GIPE");
        expect(cargoLabels).toContain("Ponto focal");
        expect(cargoLabels).toContain("Assistente de direção");
        expect(cargoLabels).toContain("Diretor(a)");
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
            result.current.form.setValue("rede", "INDIRETA");
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
            result.current.form.setValue("cargo", "ponto_focal");
        });

        await waitFor(() => {
            expect(result.current.form.getValues("ue")).toBe("");
        });
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
            expect(mockPush).toHaveBeenCalledWith("/dashboard/gestao-usuarios");
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
                title: "Não conseguimos concluir a ação!",
                description:
                    "Ocorreu um erro e não conseguimos cadastrar a pessoa usuária. Por favor,  tente novamente.",
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
            expect(result.current.cargoOptions).toHaveLength(4);
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
                description:
                    "Ocorreu um erro e não conseguimos cadastrar a pessoa usuária. Por favor,  tente novamente.",
                variant: "error",
            });
            expect(mockPush).not.toHaveBeenCalled();
        });
    });
});
