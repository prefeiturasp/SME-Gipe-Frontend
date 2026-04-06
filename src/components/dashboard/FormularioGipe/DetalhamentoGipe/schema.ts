import { z } from "zod";

export const formSchema = z.object({
    envolveArmaOuAtaque: z.string({
        required_error: "Campo obrigatório",
    }),
    ameacaRealizada: z.string({
        required_error: "Campo obrigatório",
    }),
    tiposOcorrencia: z
        .array(z.string())
        .min(1, "Selecione pelo menos um tipo de ocorrência."),
    encaminhamentos: z.string().min(1, { message: "Campo obrigatório" }),
});

export type FormularioGipeData = z.infer<typeof formSchema>;
