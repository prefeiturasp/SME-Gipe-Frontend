import { z } from "zod";
import { isValidCPF } from "@/lib/utils";

const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
const fullName = z
    .string()
    .transform(normalize)
    .refine((v) => !/\d/.test(v), { message: "Não use números no nome" })
    .refine((v) => v.split(" ").filter(Boolean).length >= 2, {
        message: "Informe nome e sobrenome",
    });

const formSchema = z
    .object({
        rede: z.string().min(1, "Rede é obrigatória"),
        cargo: z.string().min(1, "Cargo é obrigatório"),
        fullName: fullName,
        rfOuCpf: z.string().min(1, "RF ou CPF é obrigatório"),
        email: z
            .string()
            .min(1, "E-mail é obrigatório")
            .email("E-mail inválido")
            .refine(
                (val) =>
                    /^([a-zA-Z0-9_.+-]+)@sme\.prefeitura\.sp\.gov\.br$/.test(
                        val
                    ),
                {
                    message:
                        "Use apenas e-mails institucionais (@sme.prefeitura.sp.gov.br)",
                }
            ),
        dre: z.string(),
        ue: z.string(),
        isAdmin: z.boolean().default(false),
    })
    .superRefine((data, ctx) => {
        const cleanValue = data.rfOuCpf.replace(/\D/g, "");

        // Validação de RF ou CPF baseada na rede
        if (data.rede === "INDIRETA") {
            // Para rede indireta, deve ser CPF (11 dígitos)
            if (cleanValue.length !== 11) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Para rede indireta, informe um CPF válido",
                    path: ["rfOuCpf"],
                });
            } else if (!isValidCPF(cleanValue)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "CPF inválido",
                    path: ["rfOuCpf"],
                });
            }
        } else if (data.rede === "DIRETA") {
            // Para rede direta, deve ser RF (7 dígitos)
            if (cleanValue.length !== 7) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Para rede direta, informe um RF válido (7 dígitos)",
                    path: ["rfOuCpf"],
                });
            }
        }

        // Validação de DRE - obrigatória exceto para cargo GIPE
        if (data.cargo !== "gipe" && !data.dre) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Diretoria Regional é obrigatória",
                path: ["dre"],
            });
        }

        // Validação de UE - obrigatória exceto para cargos ponto_focal e GIPE
        if (data.cargo !== "ponto_focal" && data.cargo !== "gipe" && !data.ue) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Unidade Educacional é obrigatória",
                path: ["ue"],
            });
        }
    });

export type FormDataCadastroUsuario = z.infer<typeof formSchema>;

export default formSchema;
