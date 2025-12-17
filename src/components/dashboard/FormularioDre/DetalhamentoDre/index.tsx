"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import QuadroBranco from "../../QuadroBranco/QuadroBranco";
import Anexos from "../../CadastrarOcorrencia/Anexos";
import { formSchema, FormularioDreData } from "./schema";
import { RadioForm } from "./RadioForm";
import { TextareaForm } from "./TextareaForm";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useAtualizarOcorrenciaDre } from "@/hooks/useAtualizarOcorrenciaDre";
import { toast } from "@/components/ui/headless-toast";
import { useState } from "react";
import ModalFinalizarEtapa from "../../CadastrarOcorrencia/Anexos/ModalFinalizar/ModalFinalizar";
import { useUserStore } from "@/stores/useUserStore";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useRouter } from "next/navigation";

export type DetalhamentoDreProps = {
    readonly onPrevious?: () => void;
    readonly onNext?: () => void;
};

export function DetalhamentoDre({ onPrevious, onNext }: DetalhamentoDreProps) {
    const [openModalFinalizarEtapa, setOpenModalFinalizarEtapa] =
        useState(false);
    const { isPontoFocal } = useUserPermissions();
    const { formData, setFormData, ocorrenciaUuid } = useOcorrenciaFormStore();
    const user = useUserStore((state) => state.user);
    const router = useRouter();

    const { mutate: atualizarOcorrenciaDre } = useAtualizarOcorrenciaDre();

    const perfilMap: Record<string, "diretor" | "assistente" | "dre" | "gipe"> =
        {
            "DIRETOR DE ESCOLA": "diretor",
            "ASSISTENTE DE DIRETOR DE ESCOLA": "assistente",
            "PONTO FOCAL DRE": "dre",
            GIPE: "gipe",
        };

    const perfilUsuario =
        (user?.perfil_acesso?.nome && perfilMap[user.perfil_acesso.nome]) ||
        "diretor";

    const form = useForm<FormularioDreData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            acionamentoSegurancaPublica:
                formData.acionamentoSegurancaPublica ?? undefined,
            interlocucaoSTS: formData.interlocucaoSTS ?? undefined,
            informacoesComplementaresSTS:
                formData.informacoesComplementaresSTS ?? "",
            interlocucaoCPCA: formData.interlocucaoCPCA ?? undefined,
            informacoesComplementaresCPCA:
                formData.informacoesComplementaresCPCA ?? "",
            interlocucaoSupervisaoEscolar:
                formData.interlocucaoSupervisaoEscolar ?? undefined,
            informacoesComplementaresSupervisaoEscolar:
                formData.informacoesComplementaresSupervisaoEscolar ?? "",
            interlocucaoNAAPA: formData.interlocucaoNAAPA ?? undefined,
            informacoesComplementaresNAAPA:
                formData.informacoesComplementaresNAAPA ?? "",
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
                    interlocucao_sts: data.interlocucaoSTS === "Sim",
                    info_complementar_sts:
                        data.informacoesComplementaresSTS || "",
                    interlocucao_cpca: data.interlocucaoCPCA === "Sim",
                    info_complementar_cpca:
                        data.informacoesComplementaresCPCA || "",
                    interlocucao_supervisao_escolar:
                        data.interlocucaoSupervisaoEscolar === "Sim",
                    info_complementar_supervisao_escolar:
                        data.informacoesComplementaresSupervisaoEscolar || "",
                    interlocucao_naapa: data.interlocucaoNAAPA === "Sim",
                    info_complementar_naapa:
                        data.informacoesComplementaresNAAPA || "",
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
            }
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
                        <div className="flex flex-col gap-6">
                            <RadioForm
                                control={form.control}
                                name="acionamentoSegurancaPublica"
                                label="Houve acionamento da Secretaria de Seguranças Pública ou Forças de Segurança?*"
                            />

                            <RadioForm
                                control={form.control}
                                name="interlocucaoSTS"
                                label="Houve interlocução com a Supervisão Técnica de Saúde (STS)?*"
                            />

                            <TextareaForm
                                control={form.control}
                                name="informacoesComplementaresSTS"
                                label="Existe alguma informação complementar da atuação conjunta entre a DRE e o STS?"
                            />

                            <RadioForm
                                control={form.control}
                                name="interlocucaoCPCA"
                                label="Houve interlocução com a Coordenação de Políticas para Criança e Adolescente (CPCA)?*"
                            />

                            <TextareaForm
                                control={form.control}
                                name="informacoesComplementaresCPCA"
                                label="Existe alguma informação complementar da atuação conjunta entre a DRE e o CPCA?"
                            />
                        </div>
                    </QuadroBranco>

                    <QuadroBranco>
                        <div className="flex flex-col gap-6">
                            <RadioForm
                                control={form.control}
                                name="interlocucaoSupervisaoEscolar"
                                label="Houve interlocução com a Supervisão Escolar?*"
                            />

                            <TextareaForm
                                control={form.control}
                                name="informacoesComplementaresSupervisaoEscolar"
                                label="Existe alguma informação complementar da atuação conjunta entre a DRE e o Supervisão Escolar? Algum planejamento ou estratégias de ação?"
                            />
                        </div>
                    </QuadroBranco>

                    <QuadroBranco>
                        <div className="flex flex-col gap-6">
                            <RadioForm
                                control={form.control}
                                name="interlocucaoNAAPA"
                                label="Houve interlocução com o Núcleo de Apoio e Acompanhamento para a Aprendizagem (NAAPA)?*"
                            />

                            <TextareaForm
                                control={form.control}
                                name="informacoesComplementaresNAAPA"
                                label="Existe alguma informação complementar da atuação conjunta entre a DRE e o NAAPA?"
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
                        disabled={!isValid}
                    >
                        {isPontoFocal && formData.status === "enviado_para_dre"
                            ? "Salvar informações"
                            : "Próximo"}
                    </Button>
                </div>
            </QuadroBranco>

            <ModalFinalizarEtapa
                open={openModalFinalizarEtapa}
                onOpenChange={setOpenModalFinalizarEtapa}
                perfilUsuario={perfilUsuario}
            />
        </>
    );
}
