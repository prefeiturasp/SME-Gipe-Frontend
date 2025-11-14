import { z } from "zod";

export const formSchema = z.object({
    motivo: z
        .string()
        .min(5, "O motivo deve ter pelo menos 5 caracteres.")
        .max(500, "O motivo pode ter no máximo 500 caracteres."),
});

export type FormDataMotivoCancelamento = z.infer<typeof formSchema>;
