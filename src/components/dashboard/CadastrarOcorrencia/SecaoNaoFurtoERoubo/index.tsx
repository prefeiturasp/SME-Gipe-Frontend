"use client";

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
import { MultiSelect } from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAtualizarSecaoNaoFurtoRoubo } from "@/hooks/useAtualizarSecaoNaoFurtoRoubo";
import { useEnvolvidos } from "@/hooks/useEnvolvidos";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
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
        ref
    ) => {
        const { formData, setFormData, setSavedFormData, ocorrenciaUuid } =
            useOcorrenciaFormStore();
        const { data: tiposOcorrencia, isLoading: isLoadingTipos } =
            useTiposOcorrencia();
        const { data: envolvidos, isLoading: isLoadingEnvolvidos } =
            useEnvolvidos();

        const { mutate: atualizarSecao, isPending } =
            useAtualizarSecaoNaoFurtoRoubo();

        const tiposOcorrenciaOptions =
            tiposOcorrencia?.map((tipo) => ({
                value: tipo.uuid,
                label: tipo.nome,
            })) || [];

        const form = useForm<SecaoNaoFurtoERouboData>({
            resolver: zodResolver(formSchema),
            mode: "onChange",
            defaultValues: {
                tiposOcorrencia: formData.tiposOcorrencia ?? [],
                envolvidos: formData.envolvidos ?? "",
                descricao: formData.descricao ?? "",
                possuiInfoAgressorVitima:
                    formData.possuiInfoAgressorVitima ?? undefined,
            },
        });

        const { isValid } = form.formState;

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

            const body = {
                tipos_ocorrencia: data.tiposOcorrencia,
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
                }
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
                                        <FormLabel disabled={disabled}>
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
                                            Quem são os envolvidos?*
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={
                                                isLoadingEnvolvidos || disabled
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione os envolvidos" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {envolvidos?.map(
                                                    (envolvido) => (
                                                        <SelectItem
                                                            key={envolvido.uuid}
                                                            value={
                                                                envolvido.uuid
                                                            }
                                                        >
                                                            {
                                                                envolvido.perfil_dos_envolvidos
                                                            }
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
                                        se houver informações sobre agressores
                                        ou vítimas, preencher aqui
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
                                                <label className="flex items-center space-x-2">
                                                    <RadioGroupItem value="Sim" />
                                                    <span className="text-sm text-[#42474a]">
                                                        Sim
                                                    </span>
                                                </label>
                                                <label className="flex items-center space-x-2">
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
    }
);

SecaoNaoFurtoERoubo.displayName = "SecaoNaoFurtoERoubo";

export default SecaoNaoFurtoERoubo;
