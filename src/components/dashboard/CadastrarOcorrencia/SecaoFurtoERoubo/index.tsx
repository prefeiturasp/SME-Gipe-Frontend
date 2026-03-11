"use client";

import type { MultiSelectOption } from "@/components/MultiSelectWithOther";
import { MultiSelectWithOther } from "@/components/MultiSelectWithOther";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/headless-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useAtualizarSecaoFurtoRoubo } from "@/hooks/useAtualizarSecaoFurtoRoubo";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";
import {
    filterValidTiposOcorrencia,
    hasFormDataChanged,
} from "@/lib/formUtils";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { formSchema, SecaoFurtoERouboData } from "./schema";

export type SecaoFurtoERouboProps = {
    onPrevious?: () => void;
    onNext?: () => void;
    showButtons?: boolean;
    onFormChange?: (data: Partial<SecaoFurtoERouboData>) => void;
    disabled?: boolean;
};

export type SecaoFurtoERouboRef = {
    getFormData: () => SecaoFurtoERouboData;
    submitForm: () => Promise<boolean>;
    getFormInstance: () => UseFormReturn<SecaoFurtoERouboData>;
};

const SecaoFurtoERoubo = forwardRef<SecaoFurtoERouboRef, SecaoFurtoERouboProps>(
    (
        {
            onPrevious,
            onNext,
            showButtons = true,
            onFormChange,
            disabled = false,
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
                descricaoTipoOcorrencia: formData.descricaoTipoOcorrencia ?? "",
                descricao: formData.descricao ?? "",
                smartSampa: formData.smartSampa ?? undefined,
            },
        });

        const shouldShowDescricaoTipo = useCallback(
            (selectedValues: string[], options: MultiSelectOption[]) =>
                options.some(
                    (opt) =>
                        selectedValues.includes(opt.value) &&
                        ["outra", "outros"].includes(opt.label.toLowerCase()),
                ),
            [],
        );

        const tiposOcorrenciaSelecionados = form.watch("tiposOcorrencia");
        const showDescricaoTipo = shouldShowDescricaoTipo(
            tiposOcorrenciaSelecionados,
            tiposOcorrenciaOptions,
        );

        useEffect(() => {
            if (!showDescricaoTipo) {
                form.setValue("descricaoTipoOcorrencia", "", {
                    shouldValidate: true,
                });
            }
        }, [showDescricaoTipo, form]);

        const { isValid } = form.formState;

        // Sincroniza tiposOcorrencia: remove UUIDs que não pertencem ao tipo atual
        useEffect(() => {
            if (!isLoadingTipos && tiposOcorrencia) {
                const current = form.getValues("tiposOcorrencia");
                const filtered = filterValidTiposOcorrencia(
                    current,
                    tiposOcorrencia,
                );
                if (filtered.length !== current.length) {
                    form.setValue("tiposOcorrencia", filtered, {
                        shouldValidate: true,
                    });
                }
            }
        }, [isLoadingTipos, tiposOcorrencia, form]);

        // Notifica mudanças em tempo real
        const watchedValues = form.watch();
        useEffect(() => {
            onFormChange?.(watchedValues);
        }, [watchedValues, onFormChange]);

        // Expõe métodos para o componente pai via ref
        useImperativeHandle(ref, () => ({
            getFormData: () => form.getValues(),
            submitForm: async () => {
                const isValid = await form.trigger();
                if (!isValid) return false;

                const data = form.getValues();
                await handleSubmit(data);
                return true;
            },
            getFormInstance: () => form,
        }));

        // Função de submit isolada para ser chamada programaticamente
        const handleSubmit = async (data: SecaoFurtoERouboData) => {
            if (
                shouldShowDescricaoTipo(
                    data.tiposOcorrencia,
                    tiposOcorrenciaOptions,
                ) &&
                (!data.descricaoTipoOcorrencia ||
                    data.descricaoTipoOcorrencia.trim().length === 0)
            ) {
                form.setError("descricaoTipoOcorrencia", {
                    message: "Descreva qual o tipo de ocorrência.",
                });
                return;
            }

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
                                    <FormControl>
                                        <MultiSelectWithOther
                                            label="Qual o tipo de ocorrência?*"
                                            options={tiposOcorrenciaOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Selecione os tipos de ocorrência"
                                            disabled={
                                                isLoadingTipos || disabled
                                            }
                                            shouldShowTextField={
                                                shouldShowDescricaoTipo
                                            }
                                            hint="Se necessário, selecione mais de uma opção."
                                            textFieldLabel="Descreva qual o tipo de ocorrência*"
                                            textFieldPlaceholder="Descreva aqui..."
                                            textFieldValue={form.watch(
                                                "descricaoTipoOcorrencia",
                                            )}
                                            onTextFieldChange={(val) =>
                                                form.setValue(
                                                    "descricaoTipoOcorrencia",
                                                    val,
                                                    {
                                                        shouldValidate: true,
                                                    },
                                                )
                                            }
                                            textFieldError={
                                                form.formState.errors
                                                    .descricaoTipoOcorrencia
                                                    ?.message
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="descricao"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        Descreva a ocorrência*
                                    </FormLabel>
                                    <p
                                        className={`text-sm mt-1 mb-2 ${
                                            disabled
                                                ? "text-[#B0B0B0]"
                                                : "text-[#42474a]"
                                        }`}
                                    >
                                        Descreva o que ocorreu, incluindo data,
                                        local, caso existam pessoas envolvidas e
                                        demais informações relevantes para o
                                        registro.
                                    </p>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descreva aqui..."
                                            className="min-h-[80px]"
                                            {...field}
                                            disabled={disabled}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="smartSampa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        Unidade Educacional é contemplada pelo
                                        Smart Sampa?*
                                    </FormLabel>
                                    <FormControl>
                                        <div className="pt-2">
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value ?? ""}
                                                className="flex flex-col space-y-2"
                                                disabled={disabled}
                                            >
                                                <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                                    <RadioGroupItem value="Sim" />
                                                    <span className="text-sm text-[#42474a]">
                                                        Sim
                                                    </span>
                                                </label>
                                                <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                                    <RadioGroupItem value="Não" />
                                                    <span className="text-sm text-[#42474a]">
                                                        Não
                                                    </span>
                                                </label>
                                            </RadioGroup>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

SecaoFurtoERoubo.displayName = "SecaoFurtoERoubo";

export default SecaoFurtoERoubo;
