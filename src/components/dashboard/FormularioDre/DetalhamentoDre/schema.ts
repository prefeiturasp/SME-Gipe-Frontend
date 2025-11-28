import { z } from "zod";

export const formSchema = z
    .object({
        acionamentoSegurancaPublica: z
            .enum(["Sim", "Não"], {
                required_error: "Campo obrigatório",
            })
            .optional(),
        interlocucaoSTS: z
            .enum(["Sim", "Não"], {
                required_error: "Campo obrigatório",
            })
            .optional(),
        informacoesComplementaresSTS: z.string().optional(),
        interlocucaoCPCA: z
            .enum(["Sim", "Não"], {
                required_error: "Campo obrigatório",
            })
            .optional(),
        informacoesComplementaresCPCA: z.string().optional(),
        interlocucaoSupervisaoEscolar: z
            .enum(["Sim", "Não"], {
                required_error: "Campo obrigatório",
            })
            .optional(),
        informacoesComplementaresSupervisaoEscolar: z.string().optional(),
        interlocucaoNAAPA: z
            .enum(["Sim", "Não"], {
                required_error: "Campo obrigatório",
            })
            .optional(),
        informacoesComplementaresNAAPA: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.interlocucaoSTS === "Sim") {
                return (
                    data.informacoesComplementaresSTS !== undefined &&
                    data.informacoesComplementaresSTS.trim() !== ""
                );
            }
            return true;
        },
        {
            message: "Campo obrigatório quando a resposta é 'Sim'",
            path: ["informacoesComplementaresSTS"],
        }
    )
    .refine(
        (data) => {
            if (data.interlocucaoCPCA === "Sim") {
                return (
                    data.informacoesComplementaresCPCA !== undefined &&
                    data.informacoesComplementaresCPCA.trim() !== ""
                );
            }
            return true;
        },
        {
            message: "Campo obrigatório quando a resposta é 'Sim'",
            path: ["informacoesComplementaresCPCA"],
        }
    )
    .refine(
        (data) => {
            if (data.interlocucaoSupervisaoEscolar === "Sim") {
                return (
                    data.informacoesComplementaresSupervisaoEscolar !==
                        undefined &&
                    data.informacoesComplementaresSupervisaoEscolar.trim() !==
                        ""
                );
            }
            return true;
        },
        {
            message: "Campo obrigatório quando a resposta é 'Sim'",
            path: ["informacoesComplementaresSupervisaoEscolar"],
        }
    )
    .refine(
        (data) => {
            if (data.interlocucaoNAAPA === "Sim") {
                return (
                    data.informacoesComplementaresNAAPA !== undefined &&
                    data.informacoesComplementaresNAAPA.trim() !== ""
                );
            }
            return true;
        },
        {
            message: "Campo obrigatório quando a resposta é 'Sim'",
            path: ["informacoesComplementaresNAAPA"],
        }
    );

export type FormularioDreData = z.infer<typeof formSchema>;
