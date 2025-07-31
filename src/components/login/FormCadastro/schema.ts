import { z } from "zod";
import { isValidCPF } from "@/lib/utils";

const formSchema = z.object({
    dre: z.string().min(1, "DRE é obrigatória"),
    ue: z.string().min(1, "UE é obrigatória"),
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    cpf: z
        .string()
        .min(11, "CPF é obrigatório")
        .max(14, "CPF deve ter 11 dígitos")
        .refine((val) => isValidCPF(val.replace(/\D/g, "")), {
            message: "CPF inválido",
        }),
    email: z.string().email("E-mail inválido"),
});

export type FormDataSignup = z.infer<typeof formSchema>;

export default formSchema;
