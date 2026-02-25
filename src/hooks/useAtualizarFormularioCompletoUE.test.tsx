import * as atualizarFormularioCompletoUEAction from "@/actions/atualizar-formulario-completo-ue";
import { FormularioCompletoUEBody } from "@/types/formulario-completo-ue";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAtualizarFormularioCompletoUE } from "./useAtualizarFormularioCompletoUE";

vi.mock("@/actions/atualizar-formulario-completo-ue");

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

describe("useAtualizarFormularioCompletoUE", () => {
    const mockUuid = "test-uuid-123";
    const mockBody: FormularioCompletoUEBody = {
        data_ocorrencia: "2025-11-26T10:00:00.000Z",
        unidade_codigo_eol: "123456",
        dre_codigo_eol: "654321",
        sobre_furto_roubo_invasao_depredacao: false,
        tipos_ocorrencia: ["uuid-tipo-1"],
        descricao_ocorrencia: "Descrição teste",
        smart_sampa_situacao: "nao",
        envolvido: "uuid-envolvido",
        tem_info_agressor_ou_vitima: "sim",
        declarante: "uuid-declarante",
        comunicacao_seguranca_publica: "sim_gcm",
        protocolo_acionado: "ameaca",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve chamar atualizarFormularioCompletoUE com os parâmetros corretos", async () => {
        const mockResponse = {
            success: true as const,
            data: {
                uuid: mockUuid,
                ...mockBody,
            },
        };

        vi.spyOn(
            atualizarFormularioCompletoUEAction,
            "atualizarFormularioCompletoUE",
        ).mockResolvedValue(mockResponse);

        const { result } = renderHook(
            () => useAtualizarFormularioCompletoUE(),
            {
                wrapper: createWrapper(),
            },
        );

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(
            atualizarFormularioCompletoUEAction.atualizarFormularioCompletoUE,
        ).toHaveBeenCalledWith(mockUuid, mockBody);
        expect(
            atualizarFormularioCompletoUEAction.atualizarFormularioCompletoUE,
        ).toHaveBeenCalledTimes(1);
    });

    it("deve retornar sucesso quando a mutation for bem-sucedida", async () => {
        const mockResponse = {
            success: true as const,
            data: {
                uuid: mockUuid,
                ...mockBody,
            },
        };

        vi.spyOn(
            atualizarFormularioCompletoUEAction,
            "atualizarFormularioCompletoUE",
        ).mockResolvedValue(mockResponse);

        const { result } = renderHook(
            () => useAtualizarFormularioCompletoUE(),
            {
                wrapper: createWrapper(),
            },
        );

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockResponse);
    });

    it("deve retornar erro quando a mutation falhar", async () => {
        const mockError = {
            success: false as const,
            error: "Erro ao atualizar formulário",
        };

        vi.spyOn(
            atualizarFormularioCompletoUEAction,
            "atualizarFormularioCompletoUE",
        ).mockResolvedValue(mockError);

        const { result } = renderHook(
            () => useAtualizarFormularioCompletoUE(),
            {
                wrapper: createWrapper(),
            },
        );

        result.current.mutate({ uuid: mockUuid, body: mockBody });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockError);
    });
});
