import { describe, it, expect } from "vitest";
import { removeMask, maskCPF, buildCadastroPayload } from "./utils";
import type { FormDataCadastroUsuario } from "./schema";

describe("utils - Funções utilitárias", () => {
    describe("removeMask", () => {
        it("remove máscara de CPF", () => {
            expect(removeMask("123.456.789-10")).toBe("12345678910");
        });

        it("remove apenas números de string com letras", () => {
            expect(removeMask("abc123def456")).toBe("123456");
        });

        it("retorna string vazia para input vazio", () => {
            expect(removeMask("")).toBe("");
        });

        it("mantém apenas números", () => {
            expect(removeMask("!@#$%123456")).toBe("123456");
        });
    });

    describe("maskCPF", () => {
        it("aplica máscara correta para CPF completo", () => {
            expect(maskCPF("12345678910")).toBe("123.456.789-10");
        });

        it("aplica máscara parcial para CPF incompleto", () => {
            expect(maskCPF("123456")).toBe("123.456");
        });

        it("não adiciona pontos/traço se não houver dígitos suficientes", () => {
            expect(maskCPF("123")).toBe("123");
        });

        it("remove caracteres não numéricos antes de aplicar máscara", () => {
            expect(maskCPF("123.456.789-10")).toBe("123.456.789-10");
        });
    });

    describe("buildCadastroPayload", () => {
        const dreOptions = [
            { uuid: "dre-uuid-1", codigo_eol: "000001", nome: "DRE Centro" },
            { uuid: "dre-uuid-2", codigo_eol: "000002", nome: "DRE Sul" },
        ];

        const ueOptions = [
            { uuid: "ue-uuid-1", codigo_eol: "100001", nome: "EMEF Test 1" },
            { uuid: "ue-uuid-2", codigo_eol: "100002", nome: "EMEF Test 2" },
        ];

        it("cria payload para cargo Ponto Focal com DRE", () => {
            const formValues: FormDataCadastroUsuario = {
                rede: "DIRETA",
                cargo: "ponto_focal",
                fullName: "João Silva",
                rf: "1234567",
                cpf: "123.456.789-10",
                email: "joao@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-1",
                ue: "",
                isAdmin: false,
            };

            const payload = buildCadastroPayload(
                formValues,
                dreOptions,
                ueOptions
            );

            expect(payload).toEqual({
                username: "1234567",
                name: "João Silva",
                email: "joao@sme.prefeitura.sp.gov.br",
                cpf: "12345678910",
                cargo: 1,
                rede: "DIRETA",
                unidades: ["000001"],
                is_app_admin: false,
            });
        });

        it("cria payload para cargo Diretor com UE", () => {
            const formValues: FormDataCadastroUsuario = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "Maria Santos",
                rf: "7654321",
                cpf: "987.654.321-00",
                email: "maria@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-1",
                ue: "ue-uuid-1",
                isAdmin: false,
            };

            const payload = buildCadastroPayload(
                formValues,
                dreOptions,
                ueOptions
            );

            expect(payload).toEqual({
                username: "7654321",
                name: "Maria Santos",
                email: "maria@sme.prefeitura.sp.gov.br",
                cpf: "98765432100",
                cargo: 3360,
                rede: "DIRETA",
                unidades: ["100001"],
                is_app_admin: false,
            });
        });

        it("cria payload para cargo GIPE sem unidades", () => {
            const formValues: FormDataCadastroUsuario = {
                rede: "DIRETA",
                cargo: "gipe",
                fullName: "Pedro Oliveira",
                rf: "1111111",
                cpf: "111.111.111-11",
                email: "pedro@sme.prefeitura.sp.gov.br",
                dre: "",
                ue: "",
                isAdmin: true,
            };

            const payload = buildCadastroPayload(
                formValues,
                dreOptions,
                ueOptions
            );

            expect(payload).toEqual({
                username: "1111111",
                name: "Pedro Oliveira",
                email: "pedro@sme.prefeitura.sp.gov.br",
                cpf: "11111111111",
                cargo: 0,
                rede: "DIRETA",
                unidades: [],
                is_app_admin: true,
            });
        });

        it("usa CPF como username para rede INDIRETA", () => {
            const formValues: FormDataCadastroUsuario = {
                rede: "INDIRETA",
                cargo: "diretor",
                fullName: "Ana Costa",
                rf: "",
                cpf: "222.222.222-22",
                email: "ana@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-2",
                ue: "ue-uuid-2",
                isAdmin: false,
            };

            const payload = buildCadastroPayload(
                formValues,
                dreOptions,
                ueOptions
            );

            expect(payload.username).toBe("22222222222");
            expect(payload.cpf).toBe("22222222222");
            expect(payload.rede).toBe("INDIRETA");
        });

        it("usa CPF como username quando RF não está preenchido (DIRETA)", () => {
            const formValues: FormDataCadastroUsuario = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "Carlos Souza",
                rf: "",
                cpf: "333.333.333-33",
                email: "carlos@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-1",
                ue: "ue-uuid-1",
                isAdmin: false,
            };

            const payload = buildCadastroPayload(
                formValues,
                dreOptions,
                ueOptions
            );

            expect(payload.username).toBe("33333333333");
        });

        it("não adiciona unidade se DRE não for encontrada nas opções", () => {
            const formValues: FormDataCadastroUsuario = {
                rede: "DIRETA",
                cargo: "ponto_focal",
                fullName: "João Silva",
                rf: "1234567",
                cpf: "123.456.789-10",
                email: "joao@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-inexistente",
                ue: "",
                isAdmin: false,
            };

            const payload = buildCadastroPayload(
                formValues,
                dreOptions,
                ueOptions
            );

            expect(payload.unidades).toEqual([]);
        });

        it("não adiciona unidade se UE não for encontrada nas opções", () => {
            const formValues: FormDataCadastroUsuario = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "Maria Santos",
                rf: "7654321",
                cpf: "987.654.321-00",
                email: "maria@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-1",
                ue: "ue-uuid-inexistente",
                isAdmin: false,
            };

            const payload = buildCadastroPayload(
                formValues,
                dreOptions,
                ueOptions
            );

            expect(payload.unidades).toEqual([]);
        });
    });
});
