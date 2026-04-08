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
import { InputMask } from "@/components/ui/input";
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
import QuadroBranco from "../../QuadroBranco/QuadroBranco";
import { RadioForm } from "./RadioForm";
import { formSchema, FormularioDreData } from "./schema";

export type DetalhamentoDreProps = {
    readonly onPrevious?: () => void;
    readonly onNext?: () => void;
};

export function DetalhamentoDre({ onPrevious, onNext }: DetalhamentoDreProps) {
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
            acionamentoSegurancaPublica:
                formData.acionamentoSegurancaPublica ?? undefined,
            interlocucaoSupervisaoEscolar:
                formData.interlocucaoSupervisaoEscolar ?? undefined,
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
                    acionamento_seguranca_publica:
                        data.acionamentoSegurancaPublica === "Sim",
                    interlocucao_supervisao_escolar:
                        data.interlocucaoSupervisaoEscolar === "Sim",
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
                            <RadioForm
                                control={form.control}
                                name="acionamentoSegurancaPublica"
                                label="A ronda escolar foi acionada?*"
                            />

                            <RadioForm
                                control={form.control}
                                name="interlocucaoSupervisaoEscolar"
                                label="A supervisão escolar foi comunicada?*"
                            />

                            <RadioForm
                                control={form.control}
                                name="numeroProcedimentoSEI"
                                label="Há um número do processo SEI?*"
                            />

                            {numeroProcedimentoSEI === "Sim" && (
                                <FormField
                                    control={form.control}
                                    name="numeroProcedimentoSEITexto"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Número do processo SEI*
                                            </FormLabel>
                                            <FormControl>
                                                <InputMask
                                                    maskProps={{
                                                        mask: "9999.9999/9999999-9",
                                                    }}
                                                    placeholder="Exemplo: 1234.5678/9012345-6"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
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
