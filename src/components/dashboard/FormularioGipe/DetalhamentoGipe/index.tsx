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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAtualizarOcorrenciaGipe } from "@/hooks/useAtualizarOcorrenciaGipe";
import { useCategoriasDisponiveisGipe } from "@/hooks/useCategoriasDisponiveisGipe";
import { useEnvolvidos } from "@/hooks/useEnvolvidos";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";
import { filterValidTiposOcorrencia } from "@/lib/formUtils";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Anexos from "../../CadastrarOcorrencia/Anexos";
import ModalFinalizarEtapa from "../../CadastrarOcorrencia/Anexos/ModalFinalizar/ModalFinalizar";
import QuadroBranco from "../../QuadroBranco/QuadroBranco";
import { RadioForm } from "./RadioForm";
import { formSchema, FormularioGipeData } from "./schema";
import { TextareaForm } from "./TextareaForm";

export type DetalhamentoGipeProps = {
    readonly onPrevious?: () => void;
};

export function DetalhamentoGipe({ onPrevious }: DetalhamentoGipeProps) {
    const [openModalFinalizarEtapa, setOpenModalFinalizarEtapa] =
        useState(false);
    const [isFinalizando, setIsFinalizando] = useState(false);
    const { formData, setFormData, ocorrenciaUuid } = useOcorrenciaFormStore();
    const queryClient = useQueryClient();
    const router = useRouter();

    const { mutate: atualizarOcorrenciaGipe } = useAtualizarOcorrenciaGipe();

    const { data: envolvidos, isLoading: isLoadingEnvolvidos } =
        useEnvolvidos();
    const { data: categoriasGipe, isLoading: isLoadingCategoriasGipe } =
        useCategoriasDisponiveisGipe();
    const tipoFormulario =
        formData.tipoOcorrencia === "Sim" ? "PATRIMONIAL" : "GERAL";
    const { data: tiposOcorrencia, isLoading: isLoadingTipos } =
        useTiposOcorrencia(tipoFormulario);

    const envolvidosOptions =
        envolvidos?.map((envolvido) => ({
            value: envolvido.uuid,
            label: envolvido.perfil_dos_envolvidos,
        })) || [];

    const envolveArmaOuAtaqueOptions =
        categoriasGipe?.envolve_arma_ou_ataque || [];
    const ameacaRealizadaOptions =
        categoriasGipe?.ameaca_foi_realizada_de_qual_maneira || [];
    const motivacaoOptions = categoriasGipe?.motivo_ocorrencia || [];
    const etapaEscolarOptions = categoriasGipe?.etapa_escolar || [];

    const tiposOcorrenciaOptions =
        tiposOcorrencia?.map((tipo) => ({
            value: tipo.uuid,
            label: tipo.nome,
        })) || [];

    const form = useForm<FormularioGipeData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            envolveArmaOuAtaque: formData.envolveArmaOuAtaque ?? undefined,
            ameacaRealizada: formData.ameacaRealizada ?? undefined,
            envolvidos: formData.envolvidos ?? [],
            descricaoEnvolvidos: formData.descricaoEnvolvidos ?? "",
            motivoOcorrencia: formData.motivoOcorrencia ?? [],
            descricaoMotivoOcorrencia: formData.descricaoMotivoOcorrencia ?? "",
            tiposOcorrencia: formData.tiposOcorrencia ?? [],
            descricaoTipoOcorrencia: formData.descricaoTipoOcorrencia ?? "",
            etapaEscolar: formData.etapaEscolar ?? "",
            informacoesInteracoesVirtuais:
                formData.informacoesInteracoesVirtuais ?? "",
            encaminhamentos: formData.encaminhamentos ?? "",
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

    const envolvidosSelecionados = form.watch("envolvidos");
    const showDescricaoEnvolvidos = shouldShowDescricao(
        envolvidosSelecionados,
        envolvidosOptions,
    );

    const motivoSelecionados = form.watch("motivoOcorrencia");
    const showDescricaoMotivo = shouldShowDescricao(
        motivoSelecionados,
        motivacaoOptions,
    );

    const tiposSelecionados = form.watch("tiposOcorrencia");
    const showDescricaoTipo = shouldShowDescricao(
        tiposSelecionados,
        tiposOcorrenciaOptions,
    );

    useEffect(() => {
        if (!isLoadingEnvolvidos && !showDescricaoEnvolvidos) {
            form.setValue("descricaoEnvolvidos", "", {
                shouldValidate: true,
            });
        }
    }, [isLoadingEnvolvidos, showDescricaoEnvolvidos, form]);

    useEffect(() => {
        if (!isLoadingCategoriasGipe && !showDescricaoMotivo) {
            form.setValue("descricaoMotivoOcorrencia", "", {
                shouldValidate: true,
            });
        }
    }, [isLoadingCategoriasGipe, showDescricaoMotivo, form]);

    useEffect(() => {
        if (!isLoadingTipos && !showDescricaoTipo) {
            form.setValue("descricaoTipoOcorrencia", "", {
                shouldValidate: true,
            });
        }
    }, [isLoadingTipos, showDescricaoTipo, form]);

    const { isValid } = form.formState;

    const prevTipoFormularioRef = useRef(tipoFormulario);
    useEffect(() => {
        if (prevTipoFormularioRef.current !== tipoFormulario) {
            form.setValue("tiposOcorrencia", []);
            setFormData({ tiposOcorrencia: [] });
            prevTipoFormularioRef.current = tipoFormulario;
        }
    }, [tipoFormulario, form, setFormData]);

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

    const handleSubmit = async (data: FormularioGipeData) => {
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

        if (
            shouldShowDescricao(data.motivoOcorrencia, motivacaoOptions) &&
            (!data.descricaoMotivoOcorrencia ||
                data.descricaoMotivoOcorrencia.trim().length === 0)
        ) {
            form.setError("descricaoMotivoOcorrencia", {
                message: "Descreva o que motivou a ocorrência.",
            });
            return;
        }

        if (
            shouldShowDescricao(data.tiposOcorrencia, tiposOcorrenciaOptions) &&
            (!data.descricaoTipoOcorrencia ||
                data.descricaoTipoOcorrencia.trim().length === 0)
        ) {
            form.setError("descricaoTipoOcorrencia", {
                message: "Descreva qual o tipo de ocorrência.",
            });
            return;
        }

        const tiposValidos = filterValidTiposOcorrencia(
            data.tiposOcorrencia,
            tiposOcorrencia,
        );

        atualizarOcorrenciaGipe(
            {
                uuid: ocorrenciaUuid!,
                body: {
                    unidade_codigo_eol: formData.unidadeEducacional!,
                    dre_codigo_eol: formData.dre!,
                    envolve_arma_ataque: data.envolveArmaOuAtaque,
                    ameaca_realizada_qual_maneira: data.ameacaRealizada,
                    envolvido: data.envolvidos,
                    envolvido_outros: data.descricaoEnvolvidos || undefined,
                    motivacao_ocorrencia: data.motivoOcorrencia,
                    motivacao_ocorrencia_outros:
                        data.descricaoMotivoOcorrencia || undefined,
                    tipos_ocorrencia: tiposValidos,
                    tipos_ocorrencia_outros:
                        data.descricaoTipoOcorrencia || undefined,
                    etapa_escolar: data.etapaEscolar,
                    info_sobre_interacoes_virtuais_pessoa_agressora:
                        data.informacoesInteracoesVirtuais,
                    encaminhamentos_gipe: data.encaminhamentos,
                },
            },
            {
                onSuccess: (response) => {
                    if (!response.success) {
                        toast({
                            title: "Erro ao atualizar ocorrência GIPE",
                            description: response.error,
                            variant: "error",
                        });
                        return;
                    }
                    const finalizada = formData.status === "finalizada";

                    if (finalizada) {
                        queryClient.invalidateQueries({
                            queryKey: ["ocorrencia", ocorrenciaUuid],
                        });
                        router.push("/dashboard");
                        return;
                    }

                    setOpenModalFinalizarEtapa(true);
                    setFormData(data);
                },
                onError: () => {
                    toast({
                        title: "Erro ao atualizar ocorrência GIPE",
                        description:
                            "Não foi possível atualizar os dados. Tente novamente.",
                        variant: "error",
                    });
                },
            },
        );

        setFormData(data);
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <QuadroBranco>
                        <h2 className="text-[20px] font-bold text-[#42474a] mb-2">
                            Continuação da ocorrência
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <RadioForm
                                control={form.control}
                                name="envolveArmaOuAtaque"
                                label="Envolve arma ou ataque?*"
                                options={envolveArmaOuAtaqueOptions}
                            />

                            <RadioForm
                                control={form.control}
                                name="ameacaRealizada"
                                label="Ameaça foi realizada de qual maneira?*"
                                options={ameacaRealizadaOptions}
                            />
                        </div>
                    </QuadroBranco>

                    <QuadroBranco>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                placeholder="Selecione"
                                                disabled={isLoadingEnvolvidos}
                                                shouldShowTextField={
                                                    shouldShowDescricao
                                                }
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

                            <FormField
                                control={form.control}
                                name="motivoOcorrencia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <MultiSelectWithOther
                                                label="O que motivou a ocorrência?*"
                                                options={motivacaoOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Selecione"
                                                disabled={
                                                    isLoadingCategoriasGipe
                                                }
                                                shouldShowTextField={
                                                    shouldShowDescricao
                                                }
                                                hint="Se necessário, selecione mais de uma opção"
                                                textFieldLabel="Descreva o que motivou a ocorrência*"
                                                textFieldPlaceholder="Descreva aqui..."
                                                textFieldValue={form.watch(
                                                    "descricaoMotivoOcorrencia",
                                                )}
                                                onTextFieldChange={(val) =>
                                                    form.setValue(
                                                        "descricaoMotivoOcorrencia",
                                                        val,
                                                        {
                                                            shouldValidate: true,
                                                        },
                                                    )
                                                }
                                                textFieldError={
                                                    form.formState.errors
                                                        .descricaoMotivoOcorrencia
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
                                name="tiposOcorrencia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <MultiSelectWithOther
                                                label="Qual o tipo da ocorrência?*"
                                                options={tiposOcorrenciaOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Selecione os tipos de ocorrência"
                                                disabled={isLoadingTipos}
                                                shouldShowTextField={
                                                    shouldShowDescricao
                                                }
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
                                name="etapaEscolar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Qual o ciclo de aprendizagem?*
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {etapaEscolarOptions.map(
                                                    (ciclo) => (
                                                        <SelectItem
                                                            key={ciclo.value}
                                                            value={ciclo.value}
                                                        >
                                                            {ciclo.label}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </QuadroBranco>

                    <QuadroBranco>
                        <div className="flex flex-col gap-6">
                            <TextareaForm
                                control={form.control}
                                name="informacoesInteracoesVirtuais"
                                label="Há informações sobre as interações virtuais?"
                            />

                            <FormField
                                control={form.control}
                                name="encaminhamentos"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Encaminhamentos*</FormLabel>
                                        <p className="text-sm text-[#42474a] mb-2">
                                            São informações após a análise feita
                                            pelo GIPE.
                                        </p>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descreva aqui..."
                                                className="min-h-[80px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </QuadroBranco>
                </form>
            </Form>

            <QuadroBranco>
                <Anexos showButtons={false} />

                <div className="flex justify-end gap-2">
                    <Button
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
                        onClick={() => handleSubmit(form.getValues())}
                        type="submit"
                        variant="submit"
                        disabled={!isValid || isFinalizando}
                    >
                        {isFinalizando && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                        {formData.status === "enviado_para_gipe"
                            ? "Finalizar e enviar"
                            : "Finalizar"}
                    </Button>
                </div>
            </QuadroBranco>

            <ModalFinalizarEtapa
                open={openModalFinalizarEtapa}
                onOpenChange={setOpenModalFinalizarEtapa}
                onLoadingChange={setIsFinalizando}
                etapa="gipe"
            />
        </>
    );
}
