import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { cookies } from "next/headers";
import apiAnexos from "@/lib/axios-anexos";
import { baixarAnexo } from "./baixar-anexo";
import { AxiosError } from "axios";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/lib/axios-anexos");

const cookiesMock = cookies as Mock;

describe("baixarAnexo action", () => {
    const mockUuid = "file-123-uuid";
    const mockBlob = new Blob(["conteudo"]);

    beforeEach(() => {
        vi.clearAllMocks();
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue({ value: "token-123" }),
        });
    });

    it("deve baixar o arquivo com sucesso", async () => {
        vi.spyOn(apiAnexos, "get").mockResolvedValue({ data: mockBlob });

        const result = await baixarAnexo(mockUuid);

        expect(result).toBeInstanceOf(Blob);
        expect(apiAnexos.get).toHaveBeenCalledWith(
            `/anexos/${mockUuid}/download/`,
            {
                responseType: "blob",
                headers: { Authorization: "Bearer token-123" },
            }
        );
    });

    it("deve retornar erro quando não houver token", async () => {
        cookiesMock.mockReturnValue({
            get: vi.fn().mockReturnValue(undefined),
        });

        await expect(baixarAnexo(mockUuid)).rejects.toThrow(
            "Usuário não autenticado. Token não encontrado."
        );
        expect(apiAnexos.get).not.toHaveBeenCalled();
    });

    it("deve retornar erro com mensagem do AxiosError", async () => {
        const err = new AxiosError("Falha no servidor");
        vi.spyOn(apiAnexos, "get").mockRejectedValue(err);

        await expect(baixarAnexo(mockUuid)).rejects.toThrow("Falha no servidor");
    });

    it("deve retornar erro genérico se não houver message", async () => {
        const err = new AxiosError();
        err.message = "";
        vi.spyOn(apiAnexos, "get").mockRejectedValue(err);

        await expect(baixarAnexo(mockUuid)).rejects.toThrow(
            "Erro ao baixar arquivo"
        );
    });
});
