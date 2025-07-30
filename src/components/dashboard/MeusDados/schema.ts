import { z } from "zod";

export const formSchema = z.object({
    nome: z
        .string()
        .min(3, "Informe o nome completo")
        .max(80, "Nome muito longo")
        .refine((val) => /^[A-Za-zÀ-ÿ'\- ]+$/.test(val), {
            message: "O nome não pode conter números ou caracteres especiais",
        })
        .refine((val) => val.trim().includes(" "), {
            message: "Informe o nome completo (nome e sobrenome)",
        }),
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    cpf: z.string().min(11, "CPF inválido"),
    dre: z.string().min(1, "Informe a DRE"),
    unidade: z.string().min(1, "Informe a unidade"),
    perfil: z.string().min(1, "Informe o perfil de acesso"),
});

export type FormDataMeusDados = z.infer<typeof formSchema>;
