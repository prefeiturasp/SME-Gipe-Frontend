import { z } from "zod";

export const formSchema = z.object({
    envolveArmaOuAtaque: z.string({
        required_error: "Campo obrigatório",
    }),
    ameacaRealizada: z.string({
        required_error: "Campo obrigatório",
    }),
    envolvidos: z.array(z.string()).min(1, "Selecione ao menos um envolvido."),
    descricaoEnvolvidos: z.string().optional(),
    motivoOcorrencia: z
        .array(z.string())
        .min(1, { message: "Selecione pelo menos uma motivação" }),
    descricaoMotivoOcorrencia: z.string().optional(),
    tiposOcorrencia: z
        .array(z.string())
        .min(1, "Selecione pelo menos um tipo de ocorrência."),
    descricaoTipoOcorrencia: z.string().optional(),
    etapaEscolar: z.string({
        required_error: "Campo obrigatório",
    }),
    informacoesInteracoesVirtuais: z.string({
        required_error: "Campo obrigatório",
    }),
    encaminhamentos: z.string().min(1, { message: "Campo obrigatório" }),
});

export type FormularioGipeData = z.infer<typeof formSchema>;
