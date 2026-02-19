import { z } from "zod";

const pessoaAgressoraSchema = z.object({
    nome: z.string().min(1, "Nome da pessoa agressora é obrigatório"),
    idade: z
        .string()
        .min(1, "Idade é obrigatória")
        .max(2, "Idade deve ter no máximo 2 dígitos")
        .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
            message: "Idade deve ser um número válido",
        }),
});

export type PessoaAgressoraForm = z.infer<typeof pessoaAgressoraSchema>;

export const formSchema = z.object({
    pessoasAgressoras: z
        .array(pessoaAgressoraSchema)
        .min(1, "Adicione pelo menos uma pessoa agressora"),
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
