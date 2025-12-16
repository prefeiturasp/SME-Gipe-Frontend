import { z } from "zod";

export const formSchema = z
    .object({
        tipo: z.string().min(1, { message: "Campo obrigatório" }),
        unidadeEducacional: z.string().optional(),
        rede: z.string().optional(),
        codigoEol: z.string().min(1, { message: "Campo obrigatório" }),
        diretoriaRegional: z.string().min(1, { message: "Campo obrigatório" }),
        siglaDre: z.string().optional(),
    })
    .refine(
        (data) => {
            // Se tipo não for DRE, unidadeEducacional e rede são obrigatórios
            if (data.tipo !== "DRE") {
                return !!data.unidadeEducacional && !!data.rede;
            }
            return true;
        },
        {
            message: "Campo obrigatório",
            path: ["unidadeEducacional"],
        }
    )
    .refine(
        (data) => {
            if (data.tipo !== "DRE") {
                return !!data.rede;
            }
            return true;
        },
        {
            message: "Campo obrigatório",
            path: ["rede"],
        }
    );

export type FormData = z.infer<typeof formSchema>;
