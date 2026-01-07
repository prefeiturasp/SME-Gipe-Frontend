import { z } from "zod";

export const formSchema = z.object({
    envolveArmaOuAtaque: z.string({
        required_error: "Campo obrigatório",
    }),
    ameacaRealizada: z.string({
        required_error: "Campo obrigatório",
    }),
    envolvidos: z.string().min(1, "Selecione os envolvidos."),
    motivoOcorrencia: z
        .array(z.string())
        .min(1, { message: "Selecione pelo menos uma motivação" }),
    tiposOcorrencia: z.string({
        required_error: "Campo obrigatório",
    }),
    cicloAprendizagem: z.string({
        required_error: "Campo obrigatório",
    }),
    informacoesInteracoesVirtuais: z.string({
        required_error: "Campo obrigatório",
    }),
    encaminhamentos: z.string().min(1, { message: "Campo obrigatório" }),
});

export type FormularioGipeData = z.infer<typeof formSchema>;
