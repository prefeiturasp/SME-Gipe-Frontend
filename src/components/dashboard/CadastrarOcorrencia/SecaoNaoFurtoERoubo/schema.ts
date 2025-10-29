import * as z from "zod";

export const formSchema = z.object({
    tiposOcorrencia: z
        .array(z.string())
        .min(1, "Selecione pelo menos um tipo de ocorrência."),
    envolvidos: z
        .array(z.string())
        .min(1, "Selecione pelo menos um envolvido."),
    descricao: z
        .string()
        .min(1, "A descrição é obrigatória.")
        .refine((val) => val.trim().length > 0, {
            message: "A descrição não pode conter apenas espaços em branco.",
        })
        .refine((val) => val.trim().length >= 10, {
            message: "A descrição deve ter pelo menos 10 caracteres.",
        }),
    possuiInfoAgressorVitima: z.enum(["Sim", "Não"], {
        required_error: "Selecione uma opção.",
    }),
});

export type SecaoNaoFurtoERouboData = z.infer<typeof formSchema>;
