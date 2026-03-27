"use client";

import type { MultiSelectOption } from "@/components/MultiSelectWithOther";
import { MultiSelectWithOther } from "@/components/MultiSelectWithOther";
import { CampoDescricaoOcorrencia } from "@/components/dashboard/CadastrarOcorrencia/CampoDescricaoOcorrencia";
import { AlertTiposOcorrencia } from "@/components/dashboard/CadastrarOcorrencia/ModalTiposOcorrencia";
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
import { useAtualizarSecaoNaoFurtoRoubo } from "@/hooks/useAtualizarSecaoNaoFurtoRoubo";
import { useEnvolvidos } from "@/hooks/useEnvolvidos";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";
import { filterValidTiposOcorrencia } from "@/lib/formUtils";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { formSchema, SecaoNaoFurtoERouboData } from "./schema";

export type SecaoNaoFurtoERouboProps = {
    onPrevious?: () => void;
    onNext?: () => void;
    showButtons?: boolean;
    onFormChange?: (data: Partial<SecaoNaoFurtoERouboData>) => void;
    disabled?: boolean;
};

export type SecaoNaoFurtoERouboRef = {
    getFormData: () => SecaoNaoFurtoERouboData;
    submitForm: () => Promise<boolean>;
    getFormInstance: () => UseFormReturn<SecaoNaoFurtoERouboData>;
    validateOutros: () => boolean;
};

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
                descricaoTipoOcorrencia: formData.descricaoTipoOcorrencia ?? "",
                envolvidos: formData.envolvidos ?? [],
                descricaoEnvolvidos: formData.descricaoEnvolvidos ?? "",
                descricao: formData.descricao ?? "",
                possuiInfoAgressorVitima:
                    formData.possuiInfoAgressorVitima ?? undefined,
            },
        });

        const shouldShowDescricao = useCallback(
            (selectedValues: string[], options: MultiSelectOption[]) =>
                options.some(
                    (opt) =>
                        selectedValues.includes(opt.value) &&
                        ["outra", "outros"].includes(opt.label.toLowerCase()),
                ),
            [],
        );

        const tiposOcorrenciaSelecionados = form.watch("tiposOcorrencia");
        const showDescricaoTipo = shouldShowDescricao(
            tiposOcorrenciaSelecionados,
            tiposOcorrenciaOptions,
        );

        const envolvidosSelecionados = form.watch("envolvidos");
        const showDescricaoEnvolvidos = shouldShowDescricao(
            envolvidosSelecionados,
            envolvidosOptions,
        );

        useEffect(() => {
            if (!isLoadingTipos && !showDescricaoTipo) {
                form.setValue("descricaoTipoOcorrencia", "", {
                    shouldValidate: true,
                });
            }
        }, [isLoadingTipos, showDescricaoTipo, form]);

        useEffect(() => {
            if (!isLoadingEnvolvidos && !showDescricaoEnvolvidos) {
                form.setValue("descricaoEnvolvidos", "", {
                    shouldValidate: true,
                });
            }
        }, [isLoadingEnvolvidos, showDescricaoEnvolvidos, form]);

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
            validateOutros: () => {
                const data = form.getValues();
                if (
                    shouldShowDescricao(
                        data.tiposOcorrencia,
                        tiposOcorrenciaOptions,
                    ) &&
                    (!data.descricaoTipoOcorrencia ||
                        data.descricaoTipoOcorrencia.trim().length === 0)
                ) {
                    form.setError("descricaoTipoOcorrencia", {
                        message: "Descreva qual o tipo de ocorrência.",
                    });
                    return false;
                }
                if (
                    shouldShowDescricao(data.envolvidos, envolvidosOptions) &&
                    (!data.descricaoEnvolvidos ||
                        data.descricaoEnvolvidos.trim().length === 0)
                ) {
                    form.setError("descricaoEnvolvidos", {
                        message: "Descreva quem são os envolvidos.",
                    });
                    return false;
                }
                return true;
            },
        }));

        // Função de submit isolada para ser chamada programaticamente
        const handleSubmit = async (data: SecaoNaoFurtoERouboData) => {
            if (
                shouldShowDescricao(
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

            if (
                shouldShowDescricao(data.envolvidos, envolvidosOptions) &&
                (!data.descricaoEnvolvidos ||
                    data.descricaoEnvolvidos.trim().length === 0)
            ) {
                form.setError("descricaoEnvolvidos", {
                    message: "Descreva quem são os envolvidos.",
                });
                return;
            }

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
                tipos_ocorrencia_outros: data.descricaoTipoOcorrencia,
                descricao_ocorrencia: data.descricao,
                envolvido: data.envolvidos,
                envolvido_outros: data.descricaoEnvolvidos,
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
                                                    shouldShowDescricao
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
                                name="envolvidos"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <MultiSelectWithOther
                                                label="Quem são os envolvidos?*"
                                                options={envolvidosOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Selecione os envolvidos"
                                                disabled={
                                                    isLoadingEnvolvidos ||
                                                    disabled
                                                }
                                                shouldShowTextField={
                                                    shouldShowDescricao
                                                }
                                                hint="Se necessário, selecione mais de uma opção"
                                                textFieldLabel="Descreva quem são os envolvidos*"
                                                textFieldPlaceholder="Descreva aqui..."
                                                textFieldValue={form.watch(
                                                    "descricaoEnvolvidos",
                                                )}
                                                onTextFieldChange={(val) =>
                                                    form.setValue(
                                                        "descricaoEnvolvidos",
                                                        val,
                                                        {
                                                            shouldValidate: true,
                                                        },
                                                    )
                                                }
                                                textFieldError={
                                                    form.formState.errors
                                                        .descricaoEnvolvidos
                                                        ?.message
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
                        />

                        <FormField
                            control={form.control}
                            name="possuiInfoAgressorVitima"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        Existem informações sobre o agressor
                                        e/ou vítima?*
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
                                    disabled={!isValid || isPending}
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

SecaoNaoFurtoERoubo.displayName = "SecaoNaoFurtoERoubo";

export default SecaoNaoFurtoERoubo;
