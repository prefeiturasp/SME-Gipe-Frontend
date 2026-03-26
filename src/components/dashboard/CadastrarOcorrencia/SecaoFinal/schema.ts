import * as z from "zod";

const baseSchema = z.object({
    declarante: z.string().min(1, "Selecione o declarante."),
    comunicacaoSeguranca: z
        .string()
        .min(1, "Informe se a segurança pública foi comunicada."),
    protocoloAcionado: z.string().optional(),
});

export const interpessoalSchema = baseSchema.extend({
    protocoloAcionado: z.string().min(1, "Selecione o protocolo acionado."),
});

export const patrimonialSchema = baseSchema;

// Mantido para compatibilidade — por padrão usa Interpessoal
export const formSchema = interpessoalSchema;

export type SecaoFinalData = z.infer<typeof baseSchema>;
