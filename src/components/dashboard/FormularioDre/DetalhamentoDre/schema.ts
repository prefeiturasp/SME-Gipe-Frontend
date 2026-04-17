import { z } from "zod";

export const formSchema = z
    .object({
        quaisOrgaosAcionadosDre: z
            .array(z.string())
            .min(1, "Selecione pelo menos um órgão"),
        numeroProcedimentoSEI: z
            .enum(["Sim", "Não"], {
                required_error: "Campo obrigatório",
            })
            .optional(),
        numeroProcedimentoSEITexto: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.numeroProcedimentoSEI === "Sim") {
                return (
                    data.numeroProcedimentoSEITexto !== undefined &&
                    data.numeroProcedimentoSEITexto.trim() !== ""
                );
            }
            return true;
        },
        {
            message: "Campo obrigatório quando a resposta é 'Sim'",
            path: ["numeroProcedimentoSEITexto"],
        },
    );

export type FormularioDreData = z.infer<typeof formSchema>;
