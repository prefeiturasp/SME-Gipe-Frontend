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
import { useAtualizarOcorrenciaDre } from "@/hooks/useAtualizarOcorrenciaDre";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Anexos from "../../CadastrarOcorrencia/Anexos";
import ModalFinalizarEtapa from "../../CadastrarOcorrencia/Anexos/ModalFinalizar/ModalFinalizar";
import { DRE_QUESTION_COUNT } from "../../CadastrarOcorrencia/questionNumberingUtils";
import QuadroBranco from "../../QuadroBranco/QuadroBranco";
import { formSchema, FormularioDreData } from "./schema";

export type DetalhamentoDreProps = {
    readonly onPrevious?: () => void;
    readonly onNext?: () => void;
    readonly startingQuestionNumber?: number;
};

export function DetalhamentoDre({
    onPrevious,
    onNext,
    startingQuestionNumber,
}: DetalhamentoDreProps) {
    const qn = (offset: number) =>
        startingQuestionNumber == null
            ? ""
            : `${startingQuestionNumber + offset}. `;
    const [openModalFinalizarEtapa, setOpenModalFinalizarEtapa] =
        useState(false);
    const [isFinalizando, setIsFinalizando] = useState(false);
    const { isPontoFocal } = useUserPermissions();
    const { formData, setFormData, ocorrenciaUuid } = useOcorrenciaFormStore();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate: atualizarOcorrenciaDre } = useAtualizarOcorrenciaDre();

    const form = useForm<FormularioDreData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            quaisOrgaosAcionadosDre: formData.quaisOrgaosAcionadosDre ?? [],
            numeroProcedimentoSEI: formData.numeroProcedimentoSEI ?? undefined,
            numeroProcedimentoSEITexto:
                formData.numeroProcedimentoSEITexto ?? "",
        },
    });

    const { isValid } = form.formState;

    const handleSubmit = async (data: FormularioDreData) => {
        atualizarOcorrenciaDre(
            {
                uuid: ocorrenciaUuid!,
                body: {
                    unidade_codigo_eol: formData.unidadeEducacional!,
                    dre_codigo_eol: formData.dre!,
                    quais_orgaos_acionados_dre: data.quaisOrgaosAcionadosDre,
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
                            title: "Erro ao atualizar ocorrência DRE",
                            description: response.error,
                            variant: "error",
                        });
                        return;
                    }

                    const isPontoFocalEmEtapaFinal =
                        isPontoFocal && formData.status === "enviado_para_dre";

                    if (isPontoFocalEmEtapaFinal) {
                        setOpenModalFinalizarEtapa(true);
                        setFormData(data);
                        return;
                    }

                    if (isPontoFocal) {
                        queryClient.invalidateQueries({
                            queryKey: ["ocorrencia", ocorrenciaUuid],
                        });
                        router.push("/dashboard");
                        return;
                    }

                    onNext?.();
                },
                onError: () => {
                    toast({
                        title: "Erro ao atualizar ocorrência DRE",
                        description:
                            "Não foi possível atualizar os dados. Tente novamente.",
                        variant: "error",
                    });
                },
            },
        );

        setFormData(data);
    };

    const finalizarTexts = isPontoFocal ? "Finalizar" : "Próximo";

    const numeroProcedimentoSEI = form.watch("numeroProcedimentoSEI");

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <QuadroBranco>
                        <h2 className="text-[20px] font-bold text-[#42474a] mb-2">
                            Continuação da ocorrência
                        </h2>
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="quaisOrgaosAcionadosDre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {qn(0)}Quais órgãos foram acionados
                                            pela DRE?*
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col space-y-2 pt-2">
                                                {(
                                                    [
                                                        {
                                                            value: "comunicacao_supervisao_tecnica_saude",
                                                            label: "Comunicação com Supervisão Técnica de Saúde",
                                                        },
                                                        {
                                                            value: "comunicacao_assistencia_social",
                                                            label: "Comunicação com Assistência Social",
                                                        },
                                                        {
                                                            value: "comunicacao_gcm_ronda_escolar",
                                                            label: "Comunicação com GCM/Ronda Escolar",
                                                        },
                                                        {
                                                            value: "comunicacao_gipe",
                                                            label: "Comunicação com GIPE",
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
                                                                const updated =
                                                                    new Set(
                                                                        field.value,
                                                                    );
                                                                if (checked)
                                                                    updated.add(
                                                                        option.value,
                                                                    );
                                                                else
                                                                    updated.delete(
                                                                        option.value,
                                                                    );
                                                                field.onChange(
                                                                    Array.from(
                                                                        updated,
                                                                    ),
                                                                );
                                                            }}
                                                        />
                                                        <span className="text-sm text-[#42474a]">
                                                            {option.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <RadioSimNao
                                control={form.control}
                                name="numeroProcedimentoSEI"
                                label={`${qn(1)}Há um número do processo SEI?*`}
                            />

                            {numeroProcedimentoSEI === "Sim" && (
                                <NumeroProcedimentoSEI
                                    control={form.control}
                                    name="numeroProcedimentoSEITexto"
                                />
                            )}
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
                            : startingQuestionNumber + DRE_QUESTION_COUNT
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
                        {isPontoFocal && formData.status === "enviado_para_dre"
                            ? "Finalizar e enviar"
                            : finalizarTexts}
                    </Button>
                </div>
            </QuadroBranco>

            <ModalFinalizarEtapa
                open={openModalFinalizarEtapa}
                onOpenChange={setOpenModalFinalizarEtapa}
                onLoadingChange={setIsFinalizando}
                etapa="dre"
            />
        </>
    );
}
