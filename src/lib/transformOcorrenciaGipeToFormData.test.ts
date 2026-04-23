import { OcorrenciaGipeResponse } from "@/types/ocorrencia-gipe";
import { describe, expect, it } from "vitest";
import { transformOcorrenciaGipeToFormData } from "./transformOcorrenciaGipeToFormData";

describe("transformOcorrenciaGipeToFormData", () => {
    it("deve transformar dados completos da ocorrência GIPE corretamente", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "sim",
            ameaca_realizada_qual_maneira: "presencialmente",
            tipos_ocorrencia: ["tipo-uuid-1"],
            encaminhamentos_gipe: "Encaminhamentos realizados",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result).toEqual({
            envolveArmaOuAtaque: "sim",
            ameacaRealizada: "presencialmente",
            encaminhamentos: "Encaminhamentos realizados",
        });
    });

    it("deve retornar undefined para campos vazios de envolveArmaOuAtaque", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "",
            ameaca_realizada_qual_maneira: "presencialmente",
            tipos_ocorrencia: ["tipo-uuid-1"],
            encaminhamentos_gipe: "Encaminhamentos",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result.envolveArmaOuAtaque).toBeUndefined();
    });

    it("deve retornar undefined para campos vazios de ameacaRealizada", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "sim",
            ameaca_realizada_qual_maneira: "",
            tipos_ocorrencia: ["tipo-uuid-1"],
            encaminhamentos_gipe: "Encaminhamentos",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result.ameacaRealizada).toBeUndefined();
    });

    it("deve retornar string vazia para encaminhamentos vazio", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "sim",
            ameaca_realizada_qual_maneira: "presencialmente",
            tipos_ocorrencia: ["tipo-uuid-1"],
            encaminhamentos_gipe: "",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result.encaminhamentos).toBe("");
    });

    it("deve transformar corretamente com valores mínimos", () => {
        const ocorrenciaGipe: OcorrenciaGipeResponse = {
            id: 1,
            uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            unidade_codigo_eol: "123456",
            dre_codigo_eol: "654321",
            status: "finalizada",
            status_display: "Finalizada",
            status_extra: "",
            envolve_arma_ataque: "",
            ameaca_realizada_qual_maneira: "",
            tipos_ocorrencia: [],
            encaminhamentos_gipe: "",
        };

        const result = transformOcorrenciaGipeToFormData(ocorrenciaGipe);

        expect(result).toEqual({
            envolveArmaOuAtaque: undefined,
            ameacaRealizada: undefined,
            encaminhamentos: "",
        });
    });
});
