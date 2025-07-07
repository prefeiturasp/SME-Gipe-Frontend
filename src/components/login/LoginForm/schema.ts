import { z } from "zod";

const formSchema = z.object({
    username: z.string().min(1, "RF ou CPF é obrigatório"),
    password: z
        .string()
        .min(1, "Senha é obrigatória")
        .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type FormDataLogin = z.infer<typeof formSchema>;

export default formSchema;
