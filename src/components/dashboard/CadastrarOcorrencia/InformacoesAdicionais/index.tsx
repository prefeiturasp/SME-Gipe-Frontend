"use client";
import { NumeroProcedimentoSEI } from "@/components/dashboard/shared/NumeroProcedimentoSEI";
import { RadioSimNao } from "@/components/dashboard/shared/RadioSimNao";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/headless-toast";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAtualizarInfoAgressor } from "@/hooks/useAtualizarInfoAgressor";
import { useCategoriasDisponiveis } from "@/hooks/useCategoriasDisponiveis";
import { useSecaoFormBase, type SecaoBaseRef } from "@/hooks/useSecaoFormBase";
import { hasFormDataChanged } from "@/lib/formUtils";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FIELDS_PER_PERSON } from "../questionNumberingUtils";
import Envolvidos from "./Envolvidos";
import { formSchema, InformacoesAdicionaisData } from "./schema";

export type InformacoesAdicionaisProps = {
    onPrevious?: () => void;
    onNext?: () => void;
    showButtons?: boolean;
    disabled?: boolean;
    startingQuestionNumber?: number;
    onPersonCountChange?: (count: number) => void;
};

export type InformacoesAdicionaisRef = SecaoBaseRef<InformacoesAdicionaisData>;

const InformacoesAdicionais = forwardRef<
    InformacoesAdicionaisRef,
    InformacoesAdicionaisProps
>(
    (
        {
            onPrevious,
            onNext,
            showButtons = true,
            disabled = false,
            startingQuestionNumber,
            onPersonCountChange,
        },
        ref,
    ) => {
        const {
            formData,
            savedFormData,
            setFormData,
            setSavedFormData,
            ocorrenciaUuid,
        } = useOcorrenciaFormStore();
        const {
            data: categoriasDisponiveis,
            isLoading: isLoadingCategoriasDisponiveis,
        } = useCategoriasDisponiveis();
        const { mutate: atualizarInfoAgressor } = useAtualizarInfoAgressor();

        const motivoOcorrenciaOptions =
            categoriasDisponiveis?.motivo_ocorrencia || [];

        const form = useForm<InformacoesAdicionaisData>({
            resolver: zodResolver(formSchema),
            mode: "onChange",
            defaultValues: {
                pessoasAgressoras: formData.pessoasAgressoras?.length
                    ? formData.pessoasAgressoras
                    : [
                          {
                              nome: "",
                              idadeEmMeses: false,
                              idade: "",
                              genero: "",
                              grupoEtnicoRacial: "",
                              etapaEscolar: "",
                              frequenciaEscolar: "",
                              interacaoAmbienteEscolar: "",
                              nacionalidade: "",
                              pessoaComDeficiencia: "",
                          },
                      ],
                motivoOcorrencia: formData.motivoOcorrencia ?? [],
                notificadoConselhoTutelar:
                    formData.notificadoConselhoTutelar ?? undefined,
                acompanhadoNAAPA: formData.acompanhadoNAAPA ?? [],
                numeroProcedimentoSEI:
                    formData.numeroProcedimentoSEI ?? undefined,
                numeroProcedimentoSEITexto:
                    formData.numeroProcedimentoSEITexto ?? "",
            },
        });

        const { isValid } = form.formState;
        const numeroProcedimentoSEI = form.watch("numeroProcedimentoSEI");
        const pessoasCount = form.watch("pessoasAgressoras").length;

        useEffect(() => {
            onPersonCountChange?.(pessoasCount);
        }, [pessoasCount, onPersonCountChange]);

        const fixedQStart =
            startingQuestionNumber == null
                ? undefined
                : startingQuestionNumber + pessoasCount * FIELDS_PER_PERSON;
        const qf = (offset: number) =>
            fixedQStart == null ? "" : `${fixedQStart + offset}. `;

        // Função de submit isolada para ser chamada programaticamente
        const handleSubmit = async (data: InformacoesAdicionaisData) => {
            const currentValues = form.getValues();

            if (ocorrenciaUuid) {
                if (
                    !hasFormDataChanged(currentValues, savedFormData, [
                        "pessoasAgressoras",
                        "motivoOcorrencia",
                        "notificadoConselhoTutelar",
                        "acompanhadoNAAPA",
                    ])
                ) {
                    setFormData(data);
                    onNext?.();
                    return;
                }

                atualizarInfoAgressor(
                    {
                        uuid: ocorrenciaUuid,
                        body: {
                            unidade_codigo_eol:
                                formData.unidadeEducacional ?? "",
                            dre_codigo_eol: formData.dre ?? "",
                            pessoas_agressoras: data.pessoasAgressoras.map(
                                (pessoa) => ({
                                    nome: pessoa.nome,
                                    idade: Number.parseInt(pessoa.idade),
                                    idade_em_meses:
                                        pessoa.idadeEmMeses ?? false,
                                    genero: pessoa.genero,
                                    grupo_etnico_racial:
                                        pessoa.grupoEtnicoRacial,
                                    etapa_escolar: pessoa.etapaEscolar,
                                    frequencia_escolar:
                                        pessoa.frequenciaEscolar,
                                    interacao_ambiente_escolar:
                                        pessoa.interacaoAmbienteEscolar,
                                    nacionalidade: pessoa.nacionalidade,
                                    pessoa_com_deficiencia:
                                        pessoa.pessoaComDeficiencia === "Sim",
                                }),
                            ),
                            motivacao_ocorrencia: data.motivoOcorrencia,
                            notificado_conselho_tutelar:
                                data.notificadoConselhoTutelar === "Sim",
                            ocorrencia_acompanhada_pelo: data.acompanhadoNAAPA,
                            nr_processo_sei:
                                data.numeroProcedimentoSEI === "Sim"
                                    ? data.numeroProcedimentoSEITexto
                                    : "",
                        },
                    },
                    {
                        onSuccess: (response) => {
                            if (!response.success) {
                                toast({
                                    title: "Erro ao atualizar informações adicionais",
                                    description: response.error,
                                    variant: "error",
                                });
                                return;
                            }

                            setFormData(data);
                            setSavedFormData(data);
                            onNext?.();
                        },
                        onError: () => {
                            toast({
                                title: "Erro ao atualizar informações adicionais",
                                description:
                                    "Não foi possível atualizar os dados. Tente novamente.",
                                variant: "error",
                            });
                        },
                    },
                );
            } else {
                setFormData(data);
                onNext?.();
            }
        };

        useSecaoFormBase({ form, handleSubmit, ref });

        return (
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex flex-col gap-4 mt-4"
                >
                    <fieldset className="contents">
                        <Envolvidos
                            control={form.control}
                            disabled={disabled}
                            categoriasDisponiveis={categoriasDisponiveis}
                            startingQuestionNumber={startingQuestionNumber}
                        />

                        <FormField
                            control={form.control}
                            name="motivoOcorrencia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        {qf(0)}O que motivou a ocorrência?*
                                    </FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            disabled={
                                                disabled ||
                                                isLoadingCategoriasDisponiveis
                                            }
                                            options={motivoOcorrenciaOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Selecione"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <RadioSimNao
                            control={form.control}
                            name="notificadoConselhoTutelar"
                            label={`${qf(1)}A ocorrência foi notificada ao CT (Conselho Tutelar)?*`}
                            disabled={disabled}
                        />

                        <FormField
                            control={form.control}
                            name="acompanhadoNAAPA"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        {qf(2)}A ocorrência está sendo
                                        acompanhada por:
                                    </FormLabel>
                                    <div className="pt-2 flex flex-col space-y-2">
                                        {(
                                            [
                                                {
                                                    value: "naapa",
                                                    label: "NAAPA",
                                                },
                                                {
                                                    value: "comissao_mediacao_conflitos",
                                                    label: "Comissão de Mediação de Conflitos",
                                                },
                                                {
                                                    value: "supervisao_escolar",
                                                    label: "Supervisão Escolar",
                                                },
                                                {
                                                    value: "cefai",
                                                    label: "CEFAI",
                                                },
                                                {
                                                    value: "vara_da_infancia",
                                                    label: "Vara da infância",
                                                },
                                            ] as const
                                        ).map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex items-center space-x-2 w-fit cursor-pointer"
                                            >
                                                <Checkbox
                                                    checked={field.value?.includes(
                                                        option.value,
                                                    )}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        const updated = new Set(
                                                            field.value,
                                                        );
                                                        if (checked) {
                                                            updated.add(
                                                                option.value,
                                                            );
                                                        } else {
                                                            updated.delete(
                                                                option.value,
                                                            );
                                                        }
                                                        field.onChange(
                                                            Array.from(updated),
                                                        );
                                                    }}
                                                    disabled={disabled}
                                                />
                                                <span
                                                    className={
                                                        disabled
                                                            ? "text-sm text-[#B0B0B0]"
                                                            : "text-sm text-[#42474a]"
                                                    }
                                                >
                                                    {option.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <RadioSimNao
                            control={form.control}
                            name="numeroProcedimentoSEI"
                            label={`${qf(3)}Foi aberto um processo SEI?`}
                            disabled={disabled}
                        />

                        {numeroProcedimentoSEI === "Sim" && (
                            <NumeroProcedimentoSEI
                                control={form.control}
                                name="numeroProcedimentoSEITexto"
                                disabled={disabled}
                            />
                        )}

                        {showButtons && (
                            <div className="flex justify-end gap-2">
                                <Button
                                    size="sm"
                                    variant="customOutline"
                                    type="button"
                                    onClick={() => {
                                        setFormData(form.getValues());
                                        onPrevious?.();
                                    }}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    size="sm"
                                    type="submit"
                                    variant="submit"
                                    disabled={!isValid}
                                >
                                    Próximo
                                </Button>
                            </div>
                        )}
                    </fieldset>
                </form>
            </Form>
        );
    },
);

InformacoesAdicionais.displayName = "InformacoesAdicionais";

export default InformacoesAdicionais;
