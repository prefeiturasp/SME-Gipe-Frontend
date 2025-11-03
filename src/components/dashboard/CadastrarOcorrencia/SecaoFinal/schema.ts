import * as z from "zod";

export const formSchema = z.object({
    declarante: z.string().min(1, "Selecione o declarante."),
    comunicacaoSeguranca: z
        .string()
        .min(1, "Informe se houve comunicação com a segurança pública."),
    protocoloAcionado: z.string().min(1, "Selecione o protocolo acionado."),
});

export type SecaoFinalData = z.infer<typeof formSchema>;
