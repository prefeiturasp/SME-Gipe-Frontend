import { describe, it, expect, beforeEach, vi, afterAll, type Mock } from "vitest";
import axios, { AxiosError, type AxiosResponse } from "axios";
import { getEnderecoPorCepAction, type EnderecoAPI } from "@/actions/get-endereco-via-cep";

vi.mock("axios");

const axiosGetMock = axios.get as Mock;

describe("getEnderecoPorCepAction", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("retorna erro quando o CEP é inválido", async () => {
        const result = await getEnderecoPorCepAction("123");
        expect(result).toEqual({ success: false, error: "CEP inválido" });
    });

    it("retorna erro quando o CEP não é encontrado", async () => {
        axiosGetMock.mockResolvedValueOnce({ data: { erro: true } });

        const result = await getEnderecoPorCepAction("12345678");
        expect(axiosGetMock).toHaveBeenCalledWith("https://viacep.com.br/ws/12345678/json/");
        expect(result).toEqual({ success: false, error: "CEP não encontrado" });
    });

    it("retorna sucesso com dados do endereço quando o CEP é válido", async () => {
        const fakeData = {
            logradouro: "Rua A",
            bairro: "Bairro B",
            localidade: "Cidade C",
            uf: "ST",
        };

        axiosGetMock.mockResolvedValueOnce({ data: fakeData });

        const result = await getEnderecoPorCepAction("12345678");

        expect(result).toEqual({
            success: true,
            data: {
                logradouro: "Rua A",
                bairro: "Bairro B",
                cidade: "Cidade C",
                estado: "ST",
            },
        });
    });

    it("retorna erro genérico quando ocorre uma falha na requisição", async () => {
        const axiosError = new AxiosError("Erro desconhecido");
        axiosGetMock.mockRejectedValueOnce(axiosError);

        const result = await getEnderecoPorCepAction("12345678");
        expect(result).toEqual({ success: false, error: "Erro ao buscar o endereço" });
    });

    it("retorna erro específico quando o serviço de CEP está indisponível", async () => {
        const axiosError = new AxiosError("ENOTFOUND");
        axiosError.code = "ENOTFOUND";
        axiosGetMock.mockRejectedValueOnce(axiosError);

        const result = await getEnderecoPorCepAction("12345678");
        expect(result).toEqual({ success: false, error: "Serviço de CEP indisponível" });
    });

    it("substitui campos faltantes por strings vazias", async () => {
        const incompleteData = {
            logradouro: null,
            bairro: undefined,
            localidade: null,
            uf: undefined,
        };

        axiosGetMock.mockResolvedValueOnce({ data: incompleteData });

        const result = await getEnderecoPorCepAction("12345678");

        expect(result).toEqual({
            success: true,
            data: {
                logradouro: "",
                bairro: "",
                cidade: "",
                estado: "",
            },
        });
    });

    it("limpa caracteres não numéricos do CEP antes de validar", async () => {
        const result = await getEnderecoPorCepAction("12.345-678");
        
        axiosGetMock.mockResolvedValueOnce({
            data: {
                logradouro: "Rua Teste",
                bairro: "Bairro Teste",
                localidade: "Cidade Teste",
                uf: "ST",
            },
        });

        const finalResult = await getEnderecoPorCepAction("12.345-678");

        expect(finalResult).toEqual({
            success: true,
            data: {
                logradouro: "Rua Teste",
                bairro: "Bairro Teste",
                cidade: "Cidade Teste",
                estado: "ST",
            },
        });
    });

});