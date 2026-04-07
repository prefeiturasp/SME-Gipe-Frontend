import { z } from "zod";

const pessoaAgressoraSchema = z
    .object({
        nome: z.string().min(1, "Nome da pessoa envolvida é obrigatório"),
        idadeEmMeses: z.boolean().optional().default(false),
        idade: z
            .string()
            .min(1, "Idade é obrigatória")
            .max(3, "Idade deve ter no máximo 3 dígitos"),
        genero: z.string().min(1, "Gênero é obrigatório"),
        grupoEtnicoRacial: z
            .string()
            .min(1, "Grupo étnico-racial é obrigatório"),
        etapaEscolar: z.string().min(1, "Etapa escolar é obrigatória"),
        frequenciaEscolar: z
            .string()
            .min(1, "Frequência escolar é obrigatória"),
        interacaoAmbienteEscolar: z
            .string()
            .min(1, "Descrição da interação é obrigatória")
            .min(10, "Descrição deve ter no mínimo 10 caracteres"),
        nacionalidade: z
            .string()
            .min(1, "Nacionalidade é obrigatória")
            .max(100, "Nacionalidade deve ter no máximo 100 caracteres"),
        pessoaComDeficiencia: z
            .string()
            .min(1, "Informe se a pessoa tem deficiência"),
    })
    .superRefine((data, ctx) => {
        const num = Number(data.idade);
        if (Number.isNaN(num)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Idade deve ser um número válido",
                path: ["idade"],
            });
            return;
        }
        if (data.idadeEmMeses) {
            if (num < 0 || num > 12) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "A idade em meses deve ser entre 0 e 12",
                    path: ["idade"],
                });
            }
        } else if (num <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Idade deve ser um número válido",
                path: ["idade"],
            });
        }
    });

export type PessoaAgressoraForm = z.infer<typeof pessoaAgressoraSchema>;

export const formSchema = z.object({
    pessoasAgressoras: z
        .array(pessoaAgressoraSchema)
        .min(1, "Adicione pelo menos uma pessoa envolvida"),
    motivoOcorrencia: z
        .array(z.string())
        .min(1, "Selecione pelo menos um motivo"),
    notificadoConselhoTutelar: z.enum(["Sim", "Não"], {
        required_error: "Selecione uma opção",
    }),
    acompanhadoNAAPA: z
        .array(
            z.enum([
                "naapa",
                "comissao_mediacao_conflitos",
                "supervisao_escolar",
                "cefai",
            ]),
        )
        .min(1, "Selecione pelo menos uma opção"),
});

export type InformacoesAdicionaisData = z.infer<typeof formSchema>;
