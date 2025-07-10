import { z } from "zod";
import { isValidCPF } from "@/lib/utils";

const formSchema = z.object({
    username: z
        .string()
        .min(7, "RF ou CPF é obrigatório")
        .max(11, "RF ou CPF deve ter no máximo 11 caracteres")
        .refine((val) => val.length !== 11 || isValidCPF(val), {
            message: "CPF inválido",
        }),
    password: z
        .string()
        .min(1, "Senha é obrigatória")
        .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type FormDataLogin = z.infer<typeof formSchema>;

export default formSchema;
