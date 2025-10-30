import { renderHook, act } from "@testing-library/react";
import { useOcorrenciaFormStore } from "./useOcorrenciaFormStore";

describe("useOcorrenciaFormStore", () => {
    beforeEach(() => {
        const { result } = renderHook(() => useOcorrenciaFormStore());
        act(() => {
            result.current.reset();
        });
    });

    it("deve inicializar com o estado padrão", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        expect(result.current.ocorrenciaUuid).toBeNull();
        expect(result.current.formData).toEqual({});
    });

    it("deve atualizar o formData com setFormData", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setFormData({
                dataOcorrencia: "2025-10-02",
                dre: "001",
            });
        });

        expect(result.current.formData).toEqual({
            dataOcorrencia: "2025-10-02",
            dre: "001",
        });
    });

    it("deve fazer merge de dados ao chamar setFormData múltiplas vezes", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setFormData({
                dataOcorrencia: "2025-10-02",
                dre: "001",
            });
        });

        act(() => {
            result.current.setFormData({
                unidadeEducacional: "0001",
                tipoOcorrencia: "Sim",
            });
        });

        expect(result.current.formData).toEqual({
            dataOcorrencia: "2025-10-02",
            dre: "001",
            unidadeEducacional: "0001",
            tipoOcorrencia: "Sim",
        });
    });

    it("deve sobrescrever valores existentes no formData", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setFormData({
                dataOcorrencia: "2025-10-02",
                dre: "001",
            });
        });

        act(() => {
            result.current.setFormData({
                dataOcorrencia: "2025-10-15",
            });
        });

        expect(result.current.formData).toEqual({
            dataOcorrencia: "2025-10-15",
            dre: "001",
        });
    });

    it("deve atualizar o savedFormData com setSavedFormData", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setSavedFormData({
                dataOcorrencia: "2025-10-02",
                dre: "001",
            });
        });

        expect(result.current.savedFormData).toEqual({
            dataOcorrencia: "2025-10-02",
            dre: "001",
        });
    });

    it("deve fazer merge de dados ao chamar setSavedFormData múltiplas vezes", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setSavedFormData({
                dataOcorrencia: "2025-10-02",
                dre: "001",
            });
        });

        act(() => {
            result.current.setSavedFormData({
                unidadeEducacional: "0001",
                tipoOcorrencia: "Sim",
            });
        });

        expect(result.current.savedFormData).toEqual({
            dataOcorrencia: "2025-10-02",
            dre: "001",
            unidadeEducacional: "0001",
            tipoOcorrencia: "Sim",
        });
    });

    it("deve sobrescrever valores existentes no savedFormData", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setSavedFormData({
                dataOcorrencia: "2025-10-02",
                dre: "001",
            });
        });

        act(() => {
            result.current.setSavedFormData({
                dataOcorrencia: "2025-10-20",
            });
        });

        expect(result.current.savedFormData).toEqual({
            dataOcorrencia: "2025-10-20",
            dre: "001",
        });
    });

    it("deve manter formData e savedFormData independentes", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setFormData({
                dataOcorrencia: "2025-10-02",
                dre: "001",
            });
        });

        act(() => {
            result.current.setSavedFormData({
                dataOcorrencia: "2025-10-15",
                dre: "002",
            });
        });

        expect(result.current.formData).toEqual({
            dataOcorrencia: "2025-10-02",
            dre: "001",
        });

        expect(result.current.savedFormData).toEqual({
            dataOcorrencia: "2025-10-15",
            dre: "002",
        });
    });

    it("deve resetar savedFormData ao chamar reset", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setSavedFormData({
                dataOcorrencia: "2025-10-02",
                dre: "001",
            });
        });

        expect(result.current.savedFormData).toEqual({
            dataOcorrencia: "2025-10-02",
            dre: "001",
        });

        act(() => {
            result.current.reset();
        });

        expect(result.current.savedFormData).toEqual({});
    });

    it("deve permitir setSavedFormData com objeto vazio", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setSavedFormData({
                dataOcorrencia: "2025-10-02",
            });
        });

        expect(result.current.savedFormData).toEqual({
            dataOcorrencia: "2025-10-02",
        });

        act(() => {
            result.current.setSavedFormData({});
        });

        expect(result.current.savedFormData).toEqual({
            dataOcorrencia: "2025-10-02",
        });
    });

    it("deve atualizar o ocorrenciaUuid com setOcorrenciaUuid", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setOcorrenciaUuid("123");
        });

        expect(result.current.ocorrenciaUuid).toBe("123");
    });

    it("deve resetar o estado com reset", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setFormData({
                dataOcorrencia: "2025-10-02",
                dre: "001",
                unidadeEducacional: "0001",
            });
            result.current.setOcorrenciaUuid("456");
        });

        expect(result.current.formData).toEqual({
            dataOcorrencia: "2025-10-02",
            dre: "001",
            unidadeEducacional: "0001",
        });
        expect(result.current.ocorrenciaUuid).toBe("456");

        act(() => {
            result.current.reset();
        });

        expect(result.current.formData).toEqual({});
        expect(result.current.ocorrenciaUuid).toBeNull();
    });

    it("deve permitir adicionar dados da SecaoInicial", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setFormData({
                dataOcorrencia: "2025-10-02",
                dre: "001",
                unidadeEducacional: "0001",
                tipoOcorrencia: "Sim",
            });
        });

        expect(result.current.formData).toEqual({
            dataOcorrencia: "2025-10-02",
            dre: "001",
            unidadeEducacional: "0001",
            tipoOcorrencia: "Sim",
        });
    });

    it("deve permitir adicionar dados da SecaoFurtoERoubo", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setFormData({
                tiposOcorrencia: ["Violência física"],
                descricao: "Descrição da ocorrência",
                smartSampa: "nao_faz_parte",
            });
        });

        expect(result.current.formData).toEqual({
            tiposOcorrencia: ["Violência física"],
            descricao: "Descrição da ocorrência",
            smartSampa: "nao_faz_parte",
        });
    });

    it("deve manter o estado entre múltiplas renderizações do hook", () => {
        const { result: result1 } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result1.current.setFormData({
                dataOcorrencia: "2025-10-02",
            });
            result1.current.setOcorrenciaUuid("789");
        });

        const { result: result2 } = renderHook(() => useOcorrenciaFormStore());

        expect(result2.current.formData).toEqual({
            dataOcorrencia: "2025-10-02",
        });
        expect(result2.current.ocorrenciaUuid).toBe("789");
    });

    it("deve permitir setFormData com objeto vazio", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setFormData({
                dataOcorrencia: "2025-10-02",
            });
        });

        expect(result.current.formData).toEqual({
            dataOcorrencia: "2025-10-02",
        });

        act(() => {
            result.current.setFormData({});
        });

        expect(result.current.formData).toEqual({
            dataOcorrencia: "2025-10-02",
        });
    });

    it("deve permitir setOcorrenciaUuid com zero", () => {
        const { result } = renderHook(() => useOcorrenciaFormStore());

        act(() => {
            result.current.setOcorrenciaUuid("0");
        });

        expect(result.current.ocorrenciaUuid).toBe("0");
    });
});
