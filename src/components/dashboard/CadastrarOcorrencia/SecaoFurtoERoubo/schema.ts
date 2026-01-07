import * as z from "zod";

export const formSchema = z.object({
    tiposOcorrencia: z.string({
        required_error: "Campo obrigatório",
    }),
    descricao: z
        .string()
        .min(1, "A descrição é obrigatória.")
        .refine((val) => val.trim().length > 0, {
            message: "A descrição não pode conter apenas espaços em branco.",
        })
        .refine((val) => val.trim().length >= 10, {
            message: "A descrição deve ter pelo menos 10 caracteres.",
        }),
    smartSampa: z.enum(["sim_com_dano", "sim_sem_dano", "nao_faz_parte"], {
        required_error: "Selecione uma opção.",
    }),
});

export type SecaoFurtoERouboData = z.infer<typeof formSchema>;
