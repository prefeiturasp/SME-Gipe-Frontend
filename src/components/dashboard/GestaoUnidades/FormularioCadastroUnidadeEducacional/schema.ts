import { z } from "zod";

export const formSchema = z
    .object({
        tipo: z.string().min(1, { message: "Campo obrigatório" }),
        nomeUnidadeEducacional: z
            .string()
            .min(3, { message: "Campo obrigatório" }),
        rede: z.string().min(1, { message: "Campo obrigatório" }),
        codigoEol: z.string().min(1, { message: "Campo obrigatório" }),
        diretoriaRegional: z.string().optional(),
        siglaDre: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.tipo !== "DRE") {
                return !!data.diretoriaRegional;
            }
            return true;
        },
        {
            message: "Campo obrigatório",
            path: ["diretoriaRegional"],
        }
    );

export type FormData = z.infer<typeof formSchema>;
