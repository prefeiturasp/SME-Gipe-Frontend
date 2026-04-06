import { z } from "zod";

export const formSchema = z
    .object({
        acionamentoSegurancaPublica: z
            .enum(["Sim", "Não"], {
                required_error: "Campo obrigatório",
            })
            .optional(),
        interlocucaoSupervisaoEscolar: z
            .enum(["Sim", "Não"], {
                required_error: "Campo obrigatório",
            })
            .optional(),
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
