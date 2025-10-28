import * as z from "zod";

export const formSchema = z.object({
    dataOcorrencia: z
        .string()
        .min(1, "A data da ocorrência é obrigatória.")
        .refine(
            (val) => {
                if (!val) return false;
                const selected = new Date(val);
                if (Number.isNaN(selected.getTime())) return false;
                const now = new Date();
                return selected <= now;
            },
            {
                message: "A data da ocorrência não pode ser no futuro.",
            }
        ),
    dre: z.string(),
    unidadeEducacional: z.string().min(1, "Selecione uma unidade."),
    tipoOcorrencia: z.enum(["Sim", "Não"], {
        required_error: "Selecione uma opção.",
    }),
});

export type SecaoInicialData = z.infer<typeof formSchema>;
