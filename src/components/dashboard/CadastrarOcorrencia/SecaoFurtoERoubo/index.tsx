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
import { useAtualizarSecaoFurtoRoubo } from "@/hooks/useAtualizarSecaoFurtoRoubo";
import { useSecaoFormBase, type SecaoBaseRef } from "@/hooks/useSecaoFormBase";
import { useSyncTiposOcorrencia } from "@/hooks/useSyncTiposOcorrencia";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";
import {
    filterValidTiposOcorrencia,
    hasFormDataChanged,
} from "@/lib/formUtils";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { formSchema, SecaoFurtoERouboData } from "./schema";

export type SecaoFurtoERouboProps = {
    onPrevious?: () => void;
    onNext?: () => void;
    showButtons?: boolean;
    onFormChange?: (data: Partial<SecaoFurtoERouboData>) => void;
    disabled?: boolean;
    startingQuestionNumber?: number;
};

export type SecaoFurtoERouboRef = SecaoBaseRef<SecaoFurtoERouboData>;

const SecaoFurtoERoubo = forwardRef<SecaoFurtoERouboRef, SecaoFurtoERouboProps>(
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
        const {
            formData,
            savedFormData,
            setFormData,
            setSavedFormData,
            ocorrenciaUuid,
        } = useOcorrenciaFormStore();
        const { data: tiposOcorrencia, isLoading: isLoadingTipos } =
            useTiposOcorrencia("PATRIMONIAL");
        const { mutate: atualizarSecaoFurtoRoubo } =
            useAtualizarSecaoFurtoRoubo();

        const tiposOcorrenciaOptions =
            tiposOcorrencia?.map((tipo) => ({
                value: tipo.uuid,
                label: tipo.nome,
            })) || [];

        const form = useForm<SecaoFurtoERouboData>({
            resolver: zodResolver(formSchema),
            mode: "onChange",
            defaultValues: {
                tiposOcorrencia: formData.tiposOcorrencia || [],
                descricao: formData.descricao ?? "",
                smartSampa: formData.smartSampa ?? undefined,
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
        const handleSubmit = async (data: SecaoFurtoERouboData) => {
            const currentValues = form.getValues();

            if (ocorrenciaUuid) {
                if (
                    !hasFormDataChanged(currentValues, savedFormData, [
                        "tiposOcorrencia",
                    ])
                ) {
                    onNext?.();
                    return;
                }

                const smartSampaSituacao: "sim" | "nao" =
                    data.smartSampa === "Sim" ? "sim" : "nao";

                const tiposValidos = filterValidTiposOcorrencia(
                    data.tiposOcorrencia,
                    tiposOcorrencia,
                );

                atualizarSecaoFurtoRoubo(
                    {
                        uuid: ocorrenciaUuid,
                        body: {
                            tipos_ocorrencia: tiposValidos,
                            descricao_ocorrencia: data.descricao,
                            smart_sampa_situacao: smartSampaSituacao,
                        },
                    },
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
            } else {
                setFormData(data);
                onNext?.();
            }
        };

        useSecaoFormBase({
            form,
            onFormChange,
            handleSubmit,
            ref,
        });

        const labelSmartSampa =
            startingQuestionNumber == null
                ? "Unidade Educacional é contemplada pelo Smart Sampa?*"
                : `${startingQuestionNumber + 2}. Unidade Educacional é contemplada pelo Smart Sampa?*`;

        return (
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex flex-col gap-6 mt-4"
                >
                    <fieldset className="contents">
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
                                    : startingQuestionNumber + 1
                            }
                        />

                        <RadioSimNao
                            control={form.control}
                            name="smartSampa"
                            label={labelSmartSampa}
                            disabled={disabled}
                        />

                        <BotoesNavegacaoSecao
                            showButtons={showButtons}
                            isValid={isValid}
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

SecaoFurtoERoubo.displayName = "SecaoFurtoERoubo";

export default SecaoFurtoERoubo;
