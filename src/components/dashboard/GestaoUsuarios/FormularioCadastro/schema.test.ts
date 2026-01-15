import { describe, expect, it } from "vitest";
import formSchema from "./schema";

describe("Schema de cadastro de perfil de usuário", () => {
    describe("Validações básicas de campos obrigatórios", () => {
        it("valida formulário completo para rede direta com RF e CPF", () => {
            const validData = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it("valida formulário completo para rede indireta com CPF", () => {
            const validData = {
                rede: "INDIRETA",
                cargo: "diretor",
                fullName: "Maria Santos",
                rf: "",
                cpf: "12345678909",
                email: "maria.santos@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it("rejeita rede vazia", () => {
            const invalidData = {
                rede: "",
                cargo: "diretor",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some((i) => i.path[0] === "rede")
                ).toBe(true);
            }
        });

        it("rejeita cargo vazio", () => {
            const invalidData = {
                rede: "DIRETA",
                cargo: "",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some((i) => i.path[0] === "cargo")
                ).toBe(true);
            }
        });
    });

    describe("Validações de nome", () => {
        it("rejeita nome com números", () => {
            const invalidData = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "João123 da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
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
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "João",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    "Informe nome e sobrenome"
                );
            }
        });

        it("normaliza espaços extras no nome", () => {
            const dataWithExtraSpaces = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "  João   da   Silva  ",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(dataWithExtraSpaces);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.fullName).toBe("João da Silva");
            }
        });
    });

    describe("Validações de RF e CPF", () => {
        it("aceita RF válido (7 dígitos) para rede direta", () => {
            const validData = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it("rejeita RF com menos de 7 dígitos para rede direta", () => {
            const invalidData = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "João da Silva",
                rf: "123456",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some(
                        (i) =>
                            i.path[0] === "rf" &&
                            i.message.includes("RF deve ter 7 dígitos")
                    )
                ).toBe(true);
            }
        });

        it("aceita CPF válido (11 dígitos) para rede indireta", () => {
            const validData = {
                rede: "INDIRETA",
                cargo: "diretor",
                fullName: "Maria Santos",
                rf: "",
                cpf: "12345678909",
                email: "maria.santos@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it("rejeita CPF inválido", () => {
            const invalidData = {
                rede: "INDIRETA",
                cargo: "diretor",
                fullName: "Maria Santos",
                rf: "",
                cpf: "11111111111",
                email: "maria.santos@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("CPF inválido");
            }
        });

        it("rejeita CPF com menos de 11 dígitos", () => {
            const invalidData = {
                rede: "INDIRETA",
                cargo: "diretor",
                fullName: "Maria Santos",
                rf: "",
                cpf: "1234567890",
                email: "maria.santos@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some(
                        (i) =>
                            i.path[0] === "cpf" &&
                            i.message.includes("CPF deve ter 11 dígitos")
                    )
                ).toBe(true);
            }
        });

        it("RF é obrigatório para rede direta", () => {
            const invalidData = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "João da Silva",
                rf: "",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some(
                        (i) =>
                            i.path[0] === "rf" &&
                            i.message === "RF é obrigatório"
                    )
                ).toBe(true);
            }
        });

        it("CPF é obrigatório para todas as redes", () => {
            const invalidData = {
                rede: "INDIRETA",
                cargo: "diretor",
                fullName: "Maria Santos",
                rf: "",
                cpf: "",
                email: "maria.santos@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some(
                        (i) =>
                            i.path[0] === "cpf" &&
                            i.message === "CPF é obrigatório"
                    )
                ).toBe(true);
            }
        });
    });

    describe("Validações de e-mail", () => {
        it("aceita e-mail institucional válido", () => {
            const validData = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it("rejeita e-mail sem formato institucional", () => {
            const invalidData = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@gmail.com",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    "Use apenas e-mails institucionais (@sme.prefeitura.sp.gov.br)"
                );
            }
        });

        it("rejeita e-mail vazio", () => {
            const invalidData = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some((i) => i.path[0] === "email")
                ).toBe(true);
            }
        });
    });

    describe("Validações condicionais de DRE e UE", () => {
        it("DRE é obrigatória para cargo diretor", () => {
            const invalidData = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some(
                        (i) =>
                            i.path[0] === "dre" &&
                            i.message === "Diretoria Regional é obrigatória"
                    )
                ).toBe(true);
            }
        });

        it("DRE não é obrigatória para cargo GIPE", () => {
            const validData = {
                rede: "DIRETA",
                cargo: "gipe",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "",
                ue: "",
                isAdmin: false,
            };

            const result = formSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it("UE é obrigatória para cargo diretor", () => {
            const invalidData = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "",
                isAdmin: false,
            };

            const result = formSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some(
                        (i) =>
                            i.path[0] === "ue" &&
                            i.message === "Unidade Educacional é obrigatória"
                    )
                ).toBe(true);
            }
        });

        it("UE não é obrigatória para cargo ponto focal", () => {
            const validData = {
                rede: "DIRETA",
                cargo: "ponto_focal",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "",
                isAdmin: false,
            };

            const result = formSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it("UE não é obrigatória para cargo GIPE", () => {
            const validData = {
                rede: "DIRETA",
                cargo: "gipe",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "",
                ue: "",
                isAdmin: false,
            };

            const result = formSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
    });

    describe("Validações de isAdmin", () => {
        it("aceita isAdmin como true", () => {
            const validData = {
                rede: "DIRETA",
                cargo: "ponto_focal",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "",
                isAdmin: true,
            };

            const result = formSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it("aceita isAdmin como false", () => {
            const validData = {
                rede: "DIRETA",
                cargo: "diretor",
                fullName: "João da Silva",
                rf: "1234567",
                cpf: "12345678909",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                dre: "dre-uuid-123",
                ue: "ue-uuid-456",
                isAdmin: false,
            };

            const result = formSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
    });
});
