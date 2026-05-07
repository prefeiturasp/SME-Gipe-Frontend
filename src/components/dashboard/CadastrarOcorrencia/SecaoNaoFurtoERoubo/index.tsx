"use client";

import { BotoesNavegacaoSecao } from "@/components/dashboard/CadastrarOcorrencia/BotoesNavegacaoSecao";
import { CampoDescricaoOcorrencia } from "@/components/dashboard/CadastrarOcorrencia/CampoDescricaoOcorrencia";
import { AlertTiposOcorrencia } from "@/components/dashboard/CadastrarOcorrencia/ModalTiposOcorrencia";
import { RadioSimNao } from "@/components/dashboard/shared/RadioSimNao";
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
import { useAtualizarSecaoNaoFurtoRoubo } from "@/hooks/useAtualizarSecaoNaoFurtoRoubo";
import { useEnvolvidos } from "@/hooks/useEnvolvidos";
import { useSecaoFormBase, type SecaoBaseRef } from "@/hooks/useSecaoFormBase";
import { useSyncTiposOcorrencia } from "@/hooks/useSyncTiposOcorrencia";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";
import { filterValidTiposOcorrencia } from "@/lib/formUtils";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { formSchema, SecaoNaoFurtoERouboData } from "./schema";

export type SecaoNaoFurtoERouboProps = {
    onPrevious?: () => void;
    onNext?: () => void;
    showButtons?: boolean;
    onFormChange?: (data: Partial<SecaoNaoFurtoERouboData>) => void;
    disabled?: boolean;
    startingQuestionNumber?: number;
};

export type SecaoNaoFurtoERouboRef = SecaoBaseRef<SecaoNaoFurtoERouboData>;

const SecaoNaoFurtoERoubo = forwardRef<
    SecaoNaoFurtoERouboRef,
    SecaoNaoFurtoERouboProps
>(
    (
        {
            onPrevious,
            onNext,
            showButtons = true,
            onFormChange,
            disabled = false,
            startingQuestionNumber,
        },
        ref,
    ) => {
        const { formData, setFormData, setSavedFormData, ocorrenciaUuid } =
            useOcorrenciaFormStore();
        const { data: tiposOcorrencia, isLoading: isLoadingTipos } =
            useTiposOcorrencia("GERAL");
        const { data: envolvidos, isLoading: isLoadingEnvolvidos } =
            useEnvolvidos();

        const { mutate: atualizarSecao, isPending } =
            useAtualizarSecaoNaoFurtoRoubo();

        const tiposOcorrenciaOptions =
            tiposOcorrencia?.map((tipo) => ({
                value: tipo.uuid,
                label: tipo.nome,
            })) || [];

        const envolvidosOptions =
            envolvidos?.map((envolvido) => ({
                value: envolvido.uuid,
                label: envolvido.perfil_dos_envolvidos,
            })) || [];

        const form = useForm<SecaoNaoFurtoERouboData>({
            resolver: zodResolver(formSchema),
            mode: "onChange",
            defaultValues: {
                tiposOcorrencia: formData.tiposOcorrencia ?? [],
                envolvidos: formData.envolvidos ?? [],
                descricao: formData.descricao ?? "",
                possuiInfoAgressorVitima:
                    formData.possuiInfoAgressorVitima ?? undefined,
            },
        });

        const { isValid } = form.formState;

        const getCurrentTipos = useCallback(
            () => form.getValues("tiposOcorrencia"),
            [form],
        );
        const setFilteredTipos = useCallback(
            (filtered: string[]) =>
                form.setValue("tiposOcorrencia", filtered, {
                    shouldValidate: true,
                }),
            [form],
        );

        useSyncTiposOcorrencia(
            tiposOcorrencia,
            isLoadingTipos,
            getCurrentTipos,
            setFilteredTipos,
        );

        // Função de submit isolada para ser chamada programaticamente
        const handleSubmit = async (data: SecaoNaoFurtoERouboData) => {
            if (!ocorrenciaUuid) {
                toast({
                    title: "Erro",
                    description: "UUID da ocorrência não encontrado.",
                    variant: "error",
                });
                return;
            }

            const temInfo: "sim" | "nao" =
                data.possuiInfoAgressorVitima === "Sim" ? "sim" : "nao";

            const tiposValidos = filterValidTiposOcorrencia(
                data.tiposOcorrencia,
                tiposOcorrencia,
            );

            const body = {
                tipos_ocorrencia: tiposValidos,
                descricao_ocorrencia: data.descricao,
                envolvido: data.envolvidos,
                tem_info_agressor_ou_vitima: temInfo,
            };

            atualizarSecao(
                { uuid: ocorrenciaUuid, body },
                {
                    onSuccess: (response) => {
                        if (!response.success) {
                            toast({
                                title: "Erro ao atualizar seção Furto e Roubo",
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
                            title: "Erro ao atualizar seção Furto e Roubo",
                            description:
                                "Não foi possível atualizar os dados. Tente novamente.",
                            variant: "error",
                        });
                    },
                },
            );
        };

        useSecaoFormBase({
            form,
            onFormChange,
            handleSubmit,
            ref,
        });

        const labelPossuiInfo =
            startingQuestionNumber == null
                ? "Existem informações sobre as pessoas envolvidas?*"
                : `${startingQuestionNumber + 3}. Existem informações sobre as pessoas envolvidas?*`;

        return (
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex flex-col gap-6 mt-4"
                >
                    <fieldset className="contents">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="tiposOcorrencia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel disabled={disabled}>
                                            {startingQuestionNumber == null
                                                ? ""
                                                : `${startingQuestionNumber}. `}
                                            Qual o tipo de ocorrência?*
                                        </FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={tiposOcorrenciaOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Selecione os tipos de ocorrência"
                                                disabled={
                                                    isLoadingTipos || disabled
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="envolvidos"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel disabled={disabled}>
                                            {startingQuestionNumber == null
                                                ? ""
                                                : `${startingQuestionNumber + 1}. `}
                                            Quem são os envolvidos?*
                                        </FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={envolvidosOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Selecione os envolvidos"
                                                disabled={
                                                    isLoadingEnvolvidos ||
                                                    disabled
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <AlertTiposOcorrencia
                            tiposOcorrencia={tiposOcorrencia ?? []}
                        />

                        <CampoDescricaoOcorrencia
                            control={form.control}
                            name="descricao"
                            disabled={disabled}
                            questionNumber={
                                startingQuestionNumber == null
                                    ? undefined
                                    : startingQuestionNumber + 2
                            }
                        />

                        <RadioSimNao
                            control={form.control}
                            name="possuiInfoAgressorVitima"
                            label={labelPossuiInfo}
                            disabled={disabled}
                        />

                        <BotoesNavegacaoSecao
                            showButtons={showButtons}
                            isValid={isValid}
                            isPending={isPending}
                            onClickAnterior={() => {
                                setFormData(form.getValues());
                                onPrevious?.();
                            }}
                        />
                    </fieldset>
                </form>
            </Form>
        );
    },
);

SecaoNaoFurtoERoubo.displayName = "SecaoNaoFurtoERoubo";

export default SecaoNaoFurtoERoubo;
