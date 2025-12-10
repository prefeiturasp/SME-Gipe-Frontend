import { z } from "zod";
import { isValidCPF } from "@/lib/utils";

const normalize = (s: string) => s.replaceAll(/\s+/g, " ").trim();
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
        rf: z.string(),
        cpf: z.string(),
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
        const cleanCpf = data.cpf.replaceAll(/\D/g, "");

        if (!data.cpf) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "CPF é obrigatório",
                path: ["cpf"],
            });
        } else if (cleanCpf.length !== 11) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "CPF deve ter 11 dígitos",
                path: ["cpf"],
            });
        } else if (!isValidCPF(cleanCpf)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "CPF inválido",
                path: ["cpf"],
            });
        }

        if (data.rede === "DIRETA") {
            const cleanRf = data.rf.replaceAll(/\D/g, "");

            if (!data.rf) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "RF é obrigatório",
                    path: ["rf"],
                });
            } else if (cleanRf.length !== 7) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "RF deve ter 7 dígitos",
                    path: ["rf"],
                });
            }
        }

        if (
            data.cargo &&
            data.cargo !== "gipe" &&
            data.cargo !== "admin" &&
            !data.dre
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Diretoria Regional é obrigatória",
                path: ["dre"],
            });
        }

        if (
            data.cargo &&
            data.cargo !== "ponto_focal" &&
            data.cargo !== "gipe" &&
            data.cargo !== "admin" &&
            !data.ue
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Unidade Educacional é obrigatória",
                path: ["ue"],
            });
        }
    });

export type FormDataCadastroUsuario = z.infer<typeof formSchema>;

export default formSchema;
