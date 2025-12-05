import { describe, it, expect } from "vitest";
import formSchema from "./schema";

describe("Schema de cadastro de pessoa usuária", () => {
    it("valida formulário completo corretamente", () => {
        const validData = {
            dre: "dre-uuid-123",
            ue: "ue-uuid-456",
            fullName: "João da Silva",
            cpf: "12345678900",
            email: "joao.silva@sme.prefeitura.sp.gov.br",
            perfil: "3360",
        };

        const result = formSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it("rejeita DRE vazia", () => {
        const invalidData = {
            dre: "",
            ue: "ue-uuid-456",
            fullName: "João da Silva",
            cpf: "12345678900",
            email: "joao.silva@sme.prefeitura.sp.gov.br",
            perfil: "3360",
        };

        const result = formSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("DRE é obrigatória");
        }
    });

    it("rejeita UE vazia", () => {
        const invalidData = {
            dre: "dre-uuid-123",
            ue: "",
            fullName: "João da Silva",
            cpf: "12345678900",
            email: "joao.silva@sme.prefeitura.sp.gov.br",
            perfil: "3360",
        };

        const result = formSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("UE é obrigatória");
        }
    });

    it("rejeita nome com números", () => {
        const invalidData = {
            dre: "dre-uuid-123",
            ue: "ue-uuid-456",
            fullName: "João123 da Silva",
            cpf: "12345678900",
            email: "joao.silva@sme.prefeitura.sp.gov.br",
            perfil: "3360",
        };

        const result = formSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Não use números no nome"
            );
        }
    });

    it("rejeita nome sem sobrenome", () => {
        const invalidData = {
            dre: "dre-uuid-123",
            ue: "ue-uuid-456",
            fullName: "João",
            cpf: "12345678900",
            email: "joao.silva@sme.prefeitura.sp.gov.br",
            perfil: "3360",
        };

        const result = formSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Informe nome e sobrenome"
            );
        }
    });

    it("rejeita CPF inválido", () => {
        const invalidData = {
            dre: "dre-uuid-123",
            ue: "ue-uuid-456",
            fullName: "João da Silva",
            cpf: "11111111111",
            email: "joao.silva@sme.prefeitura.sp.gov.br",
            perfil: "3360",
        };

        const result = formSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("CPF inválido");
        }
    });

    it("rejeita e-mail sem formato institucional", () => {
        const invalidData = {
            dre: "dre-uuid-123",
            ue: "ue-uuid-456",
            fullName: "João da Silva",
            cpf: "12345678900",
            email: "joao.silva@gmail.com",
            perfil: "3360",
        };

        const result = formSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Use apenas e-mails institucionais (@sme.prefeitura.sp.gov.br)"
            );
        }
    });

    it("rejeita perfil vazio", () => {
        const invalidData = {
            dre: "dre-uuid-123",
            ue: "ue-uuid-456",
            fullName: "João da Silva",
            cpf: "12345678900",
            email: "joao.silva@sme.prefeitura.sp.gov.br",
            perfil: "",
        };

        const result = formSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe(
                "Perfil de acesso é obrigatório"
            );
        }
    });

    it("normaliza espaços extras no nome", () => {
        const dataWithExtraSpaces = {
            dre: "dre-uuid-123",
            ue: "ue-uuid-456",
            fullName: "  João   da   Silva  ",
            cpf: "12345678900",
            email: "joao.silva@sme.prefeitura.sp.gov.br",
            perfil: "3360",
        };

        const result = formSchema.safeParse(dataWithExtraSpaces);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.fullName).toBe("João da Silva");
        }
    });
});
