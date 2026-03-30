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
import { Textarea } from "@/components/ui/textarea";
import { useAtualizarInfoAgressor } from "@/hooks/useAtualizarInfoAgressor";
import { useCategoriasDisponiveis } from "@/hooks/useCategoriasDisponiveis";
import { hasFormDataChanged } from "@/lib/formUtils";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import Envolvidos from "./Envolvidos";
import { formSchema, InformacoesAdicionaisData } from "./schema";

export type InformacoesAdicionaisProps = {
    onPrevious?: () => void;
    onNext?: () => void;
    showButtons?: boolean;
    disabled?: boolean;
};

export type InformacoesAdicionaisRef = {
    getFormData: () => InformacoesAdicionaisData;
    submitForm: () => Promise<boolean>;
    getFormInstance: () => UseFormReturn<InformacoesAdicionaisData>;
};

const InformacoesAdicionais = forwardRef<
    InformacoesAdicionaisRef,
    InformacoesAdicionaisProps
>(({ onPrevious, onNext, showButtons = true, disabled = false }, ref) => {
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
                          idade: "",
                          genero: "",
                          grupoEtnicoRacial: "",
                          etapaEscolar: "",
                          frequenciaEscolar: "",
                          interacaoAmbienteEscolar: "",
                      },
                  ],
            motivoOcorrencia: formData.motivoOcorrencia ?? [],
            redesProtecao: formData.redesProtecao ?? "",
            notificadoConselhoTutelar:
                formData.notificadoConselhoTutelar ?? undefined,
            acompanhadoNAAPA: formData.acompanhadoNAAPA ?? undefined,
        },
    });

    const { isValid } = form.formState;

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
    const handleSubmit = async (data: InformacoesAdicionaisData) => {
        const currentValues = form.getValues();

        if (ocorrenciaUuid) {
            if (
                !hasFormDataChanged(currentValues, savedFormData, [
                    "pessoasAgressoras",
                    "motivoOcorrencia",
                    "redesProtecao",
                    "notificadoConselhoTutelar",
                    "acompanhadoNAAPA",
                ])
            ) {
                onNext?.();
                return;
            }

            atualizarInfoAgressor(
                {
                    uuid: ocorrenciaUuid,
                    body: {
                        unidade_codigo_eol: formData.unidadeEducacional || "",
                        dre_codigo_eol: formData.dre || "",
                        pessoas_agressoras: data.pessoasAgressoras.map(
                            (pessoa) => ({
                                nome: pessoa.nome,
                                idade: Number.parseInt(pessoa.idade),
                                genero: pessoa.genero,
                                grupo_etnico_racial: pessoa.grupoEtnicoRacial,
                                etapa_escolar: pessoa.etapaEscolar,
                                frequencia_escolar: pessoa.frequenciaEscolar,
                                interacao_ambiente_escolar:
                                    pessoa.interacaoAmbienteEscolar,
                            }),
                        ),
                        motivacao_ocorrencia: data.motivoOcorrencia,
                        redes_protecao_acompanhamento: data.redesProtecao,
                        notificado_conselho_tutelar:
                            data.notificadoConselhoTutelar === "Sim",
                        acompanhado_naapa: data.acompanhadoNAAPA === "Sim",
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
                    />

                    <FormField
                        control={form.control}
                        name="motivoOcorrencia"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel disabled={disabled}>
                                    O que motivou a ocorrência?*
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

                    <FormField
                        control={form.control}
                        name="redesProtecao"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel disabled={disabled}>
                                    Quais órgãos da rede de proteção já
                                    acompanham o estudante?*
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={disabled}
                                        placeholder="Digite aqui..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="notificadoConselhoTutelar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel disabled={disabled}>
                                    A ocorrência foi notificada ao Conselho
                                    Tutelar?*
                                </FormLabel>
                                <FormControl>
                                    <div className="pt-2">
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                            disabled={disabled}
                                            className="flex flex-col space-y-2"
                                        >
                                            <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                                <RadioGroupItem value="Sim" />
                                                <span
                                                    className={
                                                        disabled
                                                            ? "text-sm text-[#B0B0B0]"
                                                            : "text-sm text-[#42474a]"
                                                    }
                                                >
                                                    Sim
                                                </span>
                                            </label>
                                            <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                                <RadioGroupItem value="Não" />
                                                <span
                                                    className={
                                                        disabled
                                                            ? "text-sm text-[#B0B0B0]"
                                                            : "text-sm text-[#42474a]"
                                                    }
                                                >
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

                    <FormField
                        control={form.control}
                        name="acompanhadoNAAPA"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel disabled={disabled}>
                                    A ocorrência é acompanhada pelo NAAPA?*
                                </FormLabel>
                                <FormControl>
                                    <div className="pt-2">
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                            disabled={disabled}
                                            className="flex flex-col space-y-2"
                                        >
                                            <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                                <RadioGroupItem value="Sim" />
                                                <span
                                                    className={
                                                        disabled
                                                            ? "text-sm text-[#B0B0B0]"
                                                            : "text-sm text-[#42474a]"
                                                    }
                                                >
                                                    Sim
                                                </span>
                                            </label>
                                            <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                                <RadioGroupItem value="Não" />
                                                <span
                                                    className={
                                                        disabled
                                                            ? "text-sm text-[#B0B0B0]"
                                                            : "text-sm text-[#42474a]"
                                                    }
                                                >
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
});

InformacoesAdicionais.displayName = "InformacoesAdicionais";

export default InformacoesAdicionais;
