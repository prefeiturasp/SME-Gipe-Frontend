import { z } from "zod";

export const formSchema = z.object({
    envolveArmaOuAtaque: z.string({
        required_error: "Campo obrigatório",
    }),
    ameacaRealizada: z.string({
        required_error: "Campo obrigatório",
    }),
    envolvidosGipe: z
        .array(z.string())
        .min(1, { message: "Selecione pelo menos um envolvido" }),
    motivacaoOcorrenciaGipe: z
        .array(z.string())
        .min(1, { message: "Selecione pelo menos uma motivação" }),
    tipoOcorrenciaGipe: z.string({
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
