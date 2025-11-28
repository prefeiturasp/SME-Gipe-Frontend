import { z } from "zod";

export const formSchema = z.object({
    tipoDocumento: z.string().optional(),
    arquivo: z.instanceof(File).optional(),
});

export type AnexosData = z.infer<typeof formSchema>;
