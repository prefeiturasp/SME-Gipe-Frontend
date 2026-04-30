"use client";

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
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { useAtualizarOcorrenciaGipe } from "@/hooks/useAtualizarOcorrenciaGipe";
import { useCategoriasDisponiveisGipe } from "@/hooks/useCategoriasDisponiveisGipe";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";
import { filterValidTiposOcorrencia } from "@/lib/formUtils";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Anexos from "../../CadastrarOcorrencia/Anexos";
import ModalFinalizarEtapa from "../../CadastrarOcorrencia/Anexos/ModalFinalizar/ModalFinalizar";
import { GIPE_QUESTION_COUNT } from "../../CadastrarOcorrencia/questionNumberingUtils";
import QuadroBranco from "../../QuadroBranco/QuadroBranco";
import { RadioForm } from "./RadioForm";
import { formSchema, FormularioGipeData } from "./schema";

export type DetalhamentoGipeProps = {
    readonly onPrevious?: () => void;
    readonly startingQuestionNumber?: number;
};

export function DetalhamentoGipe({
    onPrevious,
    startingQuestionNumber,
}: DetalhamentoGipeProps) {
    const qn = (offset: number) =>
        startingQuestionNumber == null
            ? ""
            : `${startingQuestionNumber + offset}. `;
    const [openModalFinalizarEtapa, setOpenModalFinalizarEtapa] =
        useState(false);
    const [isFinalizando, setIsFinalizando] = useState(false);
    const { formData, setFormData, ocorrenciaUuid } = useOcorrenciaFormStore();
    const queryClient = useQueryClient();
    const router = useRouter();

    const { mutate: atualizarOcorrenciaGipe } = useAtualizarOcorrenciaGipe();

    const { data: categoriasGipe } = useCategoriasDisponiveisGipe();
    const tipoFormulario =
        formData.tipoOcorrencia === "Sim" ? "PATRIMONIAL" : "GERAL";
    const { data: tiposOcorrencia, isLoading: isLoadingTipos } =
        useTiposOcorrencia(tipoFormulario);

    const envolveArmaOuAtaqueOptions =
        categoriasGipe?.envolve_arma_ou_ataque || [];
    const ameacaRealizadaOptions =
        categoriasGipe?.ameaca_foi_realizada_de_qual_maneira || [];

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
            tiposOcorrencia: formData.tiposOcorrencia ?? [],
            encaminhamentos: formData.encaminhamentos ?? "",
        },
    });

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
                    tipos_ocorrencia: tiposValidos,
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
                                label={`${qn(0)}Envolve arma ou ataque?*`}
                                options={envolveArmaOuAtaqueOptions}
                            />

                            <RadioForm
                                control={form.control}
                                name="ameacaRealizada"
                                label={`${qn(1)}Ameaça foi realizada de qual maneira?*`}
                                options={ameacaRealizadaOptions}
                            />
                        </div>
                    </QuadroBranco>

                    <QuadroBranco>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="tiposOcorrencia"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 md:col-span-2">
                                        <FormLabel>
                                            {qn(2)}Qual o tipo da ocorrência?*
                                        </FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={tiposOcorrenciaOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Selecione os tipos de ocorrência"
                                                disabled={isLoadingTipos}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="col-span-1 md:col-span-2">
                                <AlertTiposOcorrencia
                                    tiposOcorrencia={tiposOcorrencia ?? []}
                                />
                            </div>
                        </div>
                    </QuadroBranco>

                    <QuadroBranco>
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="encaminhamentos"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {qn(3)}Encaminhamentos*
                                        </FormLabel>
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
                <Anexos
                    showButtons={false}
                    startingQuestionNumber={
                        startingQuestionNumber == null
                            ? undefined
                            : startingQuestionNumber + GIPE_QUESTION_COUNT
                    }
                />

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
