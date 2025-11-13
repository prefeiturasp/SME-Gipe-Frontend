import { z } from "zod";

export const formSchema = z.object({
    tipoDocumento: z.string().min(1, "Selecione o tipo de documento"),
    arquivo: z.instanceof(File).optional(),
});

export type AnexosData = z.infer<typeof formSchema>;
