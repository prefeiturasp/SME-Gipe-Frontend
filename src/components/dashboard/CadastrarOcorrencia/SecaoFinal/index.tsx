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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAtualizarSecaoFinal } from "@/hooks/useAtualizarSecaoFinal";
import { useDeclarantes } from "@/hooks/useDeclarantes";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { formSchema, SecaoFinalData } from "./schema";

const DESASTRES_CLIMATICOS_OPTIONS = new Set([
    "Sim, com a Defesa civil",
    "Sim, com o Bombeiro",
]);

export type SecaoFinalProps = {
    onNext?: () => void;
    onPrevious?: () => void;
    showButtons?: boolean;
    disabled?: boolean;
    isPatrimonial?: boolean;
};

export type SecaoFinalRef = {
    getFormData: () => SecaoFinalData;
    submitForm: () => Promise<boolean>;
    getFormInstance: () => UseFormReturn<SecaoFinalData>;
};

const SecaoFinal = forwardRef<SecaoFinalRef, SecaoFinalProps>(
    (
        {
            onNext,
            onPrevious,
            showButtons = true,
            disabled = false,
            isPatrimonial: isPatrimonialProp,
        },
        ref,
    ) => {
        const {
            formData,
            setFormData,
            ocorrenciaUuid,
            savedFormData,
            setSavedFormData,
        } = useOcorrenciaFormStore();
        const { data: declarantes, isLoading: isLoadingDeclarantes } =
            useDeclarantes();
        const tipoFormulario =
            formData.tipoOcorrencia === "Sim" ? "PATRIMONIAL" : "GERAL";
        const { data: tiposOcorrenciaDisponiveis, isLoading: isLoadingTipos } =
            useTiposOcorrencia(tipoFormulario);
        const { mutate, isPending } = useAtualizarSecaoFinal();

        const isPatrimonial = useMemo(
            () => isPatrimonialProp ?? formData.tipoOcorrencia === "Sim",
            [isPatrimonialProp, formData.tipoOcorrencia],
        );

        const isDesastresClimaticos = useMemo(() => {
            const selectedUuids = (formData.tiposOcorrencia as string[]) ?? [];

            if (!tiposOcorrenciaDisponiveis || selectedUuids.length === 0)
                return false;
            return tiposOcorrenciaDisponiveis.some(
                (tipo) =>
                    selectedUuids.includes(tipo.uuid) &&
                    tipo.nome === "Desastres climáticos",
            );
        }, [tiposOcorrenciaDisponiveis, formData.tiposOcorrencia]);

        const form = useForm<SecaoFinalData>({
            resolver: zodResolver(formSchema),
            mode: "onChange",
            defaultValues: {
                declarante: formData.declarante ?? "",
                comunicacaoSeguranca: formData.comunicacaoSeguranca ?? "",
                protocoloAcionado: formData.protocoloAcionado ?? "",
            },
        });

        const { isValid } = form.formState;

        useEffect(() => {
            if (isLoadingTipos) return;

            const currentValue = form.getValues("comunicacaoSeguranca");
            if (
                !isDesastresClimaticos &&
                DESASTRES_CLIMATICOS_OPTIONS.has(currentValue)
            ) {
                form.setValue("comunicacaoSeguranca", "", {
                    shouldValidate: true,
                });
            }
        }, [isDesastresClimaticos, isLoadingTipos, form]);

        useEffect(() => {
            const currentValue = form.getValues("protocoloAcionado");
            if (isPatrimonial && currentValue === "Ameaça") {
                form.setValue("protocoloAcionado", "", {
                    shouldValidate: true,
                });
            }
        }, [isPatrimonial, form]);

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

        const mapFormDataToApi = (data: SecaoFinalData) => {
            const comunicacaoMap: Record<string, string> = {
                "Sim, com a GCM": "sim_gcm",
                "Sim, com a PM": "sim_pm",
                "Sim, com a Defesa civil": "sim_dc",
                "Sim, com o Bombeiro": "sim_cbm",
                Não: "nao",
            };

            const protocoloMap: Record<string, string> = {
                Ameaça: "ameaca",
                Alerta: "alerta",
                "Apenas para registro/não se aplica": "registro",
            };

            return {
                unidade_codigo_eol: formData.unidadeEducacional ?? "",
                dre_codigo_eol: formData.dre ?? "",
                declarante: data.declarante,
                comunicacao_seguranca_publica:
                    comunicacaoMap[data.comunicacaoSeguranca],
                protocolo_acionado: protocoloMap[data.protocoloAcionado],
            };
        };

        const hasChanges = () => {
            if (!savedFormData) return true;

            const currentData = form.getValues();
            return (
                currentData.declarante !== savedFormData.declarante ||
                currentData.comunicacaoSeguranca !==
                    savedFormData.comunicacaoSeguranca ||
                currentData.protocoloAcionado !==
                    savedFormData.protocoloAcionado
            );
        };

        // Função de submit isolada para ser chamada programaticamente
        const handleSubmit = async (data: SecaoFinalData) => {
            setFormData(data);

            if (!ocorrenciaUuid || !hasChanges()) {
                onNext?.();
                return;
            }

            const apiData = mapFormDataToApi(data);

            mutate(
                { uuid: ocorrenciaUuid, body: apiData },
                {
                    onSuccess: (response) => {
                        if (response.success) {
                            setSavedFormData(data);
                            onNext?.();
                        } else {
                            toast({
                                title: "Erro ao atualizar seção final",
                                description: response.error,
                                variant: "error",
                            });
                        }
                    },
                    onError: () => {
                        toast({
                            title: "Erro ao atualizar seção final",
                            description:
                                "Ocorreu um erro inesperado. Tente novamente.",
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="declarante"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel disabled={disabled}>
                                            Quem é o declarante?*
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={
                                                isLoadingDeclarantes || disabled
                                            }
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o declarante" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {declarantes?.map(
                                                    (declarante) => (
                                                        <SelectItem
                                                            key={
                                                                declarante.uuid
                                                            }
                                                            value={
                                                                declarante.uuid
                                                            }
                                                        >
                                                            {
                                                                declarante.declarante
                                                            }
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="comunicacaoSeguranca"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel disabled={disabled}>
                                            Houve comunicação com a segurança
                                            pública?*
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={disabled}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione uma opção" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Sim, com a GCM">
                                                    Sim, com a GCM
                                                </SelectItem>
                                                <SelectItem value="Sim, com a PM">
                                                    Sim, com a PM
                                                </SelectItem>
                                                {isDesastresClimaticos && (
                                                    <>
                                                        <SelectItem value="Sim, com a Defesa civil">
                                                            Sim, com a Defesa
                                                            civil
                                                        </SelectItem>
                                                        <SelectItem value="Sim, com o Bombeiro">
                                                            Sim, com o Bombeiro
                                                        </SelectItem>
                                                    </>
                                                )}
                                                <SelectItem value="Não">
                                                    Não
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="protocoloAcionado"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel disabled={disabled}>
                                            Qual protocolo acionado?*
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={disabled}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o protocolo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {!isPatrimonial && (
                                                    <SelectItem value="Ameaça">
                                                        Ameaça
                                                    </SelectItem>
                                                )}
                                                <SelectItem value="Alerta">
                                                    Alerta
                                                </SelectItem>
                                                <SelectItem value="Apenas para registro/não se aplica">
                                                    Apenas para registro/não se
                                                    aplica
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="p-4 bg-[#F5F5F5] border border-[#DADADA] rounded-md mt-2">
                            <p className="text-[14px] font-bold text-[#42474a] m-0">
                                É possível imprimir uma cópia das respostas
                                depois de enviá-las
                            </p>
                        </div>
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
                                    loading={isPending}
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

SecaoFinal.displayName = "SecaoFinal";

export default SecaoFinal;
