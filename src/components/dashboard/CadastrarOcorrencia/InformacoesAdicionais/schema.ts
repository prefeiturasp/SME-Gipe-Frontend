import { z } from "zod";

export const formSchema = z.object({
    nomeAgressor: z.string().min(1, "Nome da pessoa agressora é obrigatório"),
    idadeAgressor: z
        .string()
        .min(1, "Idade é obrigatória")
        .max(3, "Idade deve ter no máximo 3 dígitos")
        .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
            message: "Idade deve ser um número válido",
        }),
    cep: z
        .string()
        .min(1, "CEP é obrigatório")
        .regex(/^\d{5}-\d{3}$/, "CEP deve estar no formato 00000-000"),
    logradouro: z.string().min(1, "Logradouro é obrigatório"),
    numero: z.string().min(1, "Número é obrigatório"),
    complemento: z.string().optional(),
    estado: z.string().min(1, "Estado é obrigatório"),
    cidade: z.string().min(1, "Cidade é obrigatória"),
    bairro: z.string().min(1, "Bairro é obrigatório"),
    motivoOcorrencia: z
        .array(z.string())
        .min(1, "Selecione pelo menos um motivo"),
    genero: z.string().min(1, "Gênero é obrigatório"),
    grupoEtnicoRacial: z.string().min(1, "Grupo étnico-racial é obrigatório"),
    etapaEscolar: z.string().min(1, "Etapa escolar é obrigatória"),
    frequenciaEscolar: z.string().min(1, "Frequência escolar é obrigatória"),
    interacaoAmbienteEscolar: z
        .string()
        .min(1, "Descrição da interação é obrigatória")
        .min(10, "Descrição deve ter no mínimo 10 caracteres"),
    redesProtecao: z
        .string()
        .min(1, "Informação sobre redes de proteção é obrigatória")
        .min(10, "Descrição deve ter no mínimo 10 caracteres"),
    notificadoConselhoTutelar: z.enum(["Sim", "Não"], {
        required_error: "Selecione uma opção",
    }),
    acompanhadoNAAPA: z.enum(["Sim", "Não"], {
        required_error: "Selecione uma opção",
    }),
});

export type InformacoesAdicionaisData = z.infer<typeof formSchema>;
