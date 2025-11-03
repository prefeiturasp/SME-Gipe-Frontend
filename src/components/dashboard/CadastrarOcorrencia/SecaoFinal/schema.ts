import * as z from "zod";

export const formSchema = z.object({
    declarante: z.enum(
        ["Gabinete DRE", "GCM", "GIPE", "NAAPA", "Unidade Educacional"],
        {
            required_error: "Selecione o declarante.",
        }
    ),
    comunicacaoSeguranca: z.enum(["Sim, com a GCM", "Sim, com a PM", "Não"], {
        required_error: "Informe se houve comunicação com a segurança pública.",
    }),
    protocoloAcionado: z.enum(
        ["Ameaça", "Alerta", "Apenas para registro/não se aplica"],
        {
            required_error: "Selecione o protocolo acionado.",
        }
    ),
});

export type SecaoFinalData = z.infer<typeof formSchema>;
