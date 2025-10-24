import * as z from "zod";

export const formSchema = z.object({
    tiposOcorrencia: z
        .array(z.string())
        .min(1, "Selecione pelo menos um tipo de ocorrência."),
    descricao: z
        .string()
        .min(1, "A descrição é obrigatória.")
        .min(10, "A descrição deve ter pelo menos 10 caracteres."),
    smartSampa: z.enum(["sim_com_dano", "sim_sem_dano", "nao_faz_parte"], {
        required_error: "Selecione uma opção.",
    }),
});

export type SecaoFurtoERouboData = z.infer<typeof formSchema>;
