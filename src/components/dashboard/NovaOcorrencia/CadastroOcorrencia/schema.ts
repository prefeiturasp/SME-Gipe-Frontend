import * as z from "zod";

export const formSchema = z.object({
    dataOcorrencia: z.string().min(1, "A data da ocorrência é obrigatória."),
    dre: z.string(),
    unidadeEducacional: z.string().min(1, "Selecione uma unidade."),
    tipoOcorrencia: z.enum(["Sim", "Não"], {
        required_error: "Selecione uma opção.",
    }),
});

export type CadastroOcorrenciaData = z.infer<typeof formSchema>;
