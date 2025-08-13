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

const formSchema = z.object({
    dre: z.string().min(1, "DRE é obrigatória"),
    ue: z.string().min(1, "UE é obrigatória"),
    fullName: fullName,
    cpf: z
        .string()
        .min(11, "CPF é obrigatório")
        .max(14, "CPF deve ter 11 dígitos")
        .refine((val) => isValidCPF(val.replace(/\D/g, "")), {
            message: "CPF inválido",
        }),
    email: z.string().email("E-mail inválido"),
    password: z
        .string()
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .max(12, "A senha deve ter no máximo 12 caracteres")
        .refine((v) => /[A-Z]/.test(v), {
            message: "A senha deve conter ao menos uma letra maiúscula",
        })
        .refine((v) => /[a-z]/.test(v), {
            message: "A senha deve conter ao menos uma letra minúscula",
        })
        .refine((v) => /\d/.test(v), {
            message: "A senha deve conter ao menos um número",
        })
        .refine((v) => /[!@#_]/.test(v), {
            message: "A senha deve conter ao menos um carácter especial (!@#_)",
        }),
});

export type FormDataSignup = z.infer<typeof formSchema>;

export default formSchema;
