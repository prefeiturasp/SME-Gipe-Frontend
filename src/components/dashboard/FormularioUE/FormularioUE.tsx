"use client";

import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import { Stepper } from "@/components/stepper/Stepper";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import SecaoInicial, {
    SecaoInicialRef,
} from "../CadastrarOcorrencia/SecaoInicial";
import SecaoFurtoERoubo, {
    SecaoFurtoERouboRef,
} from "../CadastrarOcorrencia/SecaoFurtoERoubo";
import SecaoNaoFurtoERoubo, {
    SecaoNaoFurtoERouboRef,
} from "../CadastrarOcorrencia/SecaoNaoFurtoERoubo";
import SecaoFinal, { SecaoFinalRef } from "../CadastrarOcorrencia/SecaoFinal";
import InformacoesAdicionais, {
    InformacoesAdicionaisRef,
} from "../CadastrarOcorrencia/InformacoesAdicionais";
import Anexos from "../CadastrarOcorrencia/Anexos";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import PageHeader from "../PageHeader/PageHeader";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/headless-toast";
import { useAtualizarFormularioCompletoUE } from "@/hooks/useAtualizarFormularioCompletoUE";
import { FormularioCompletoUEBody } from "@/types/formulario-completo-ue";
import { useRouter } from "next/navigation";

export type FormularioUEProps = {
    readonly onNext?: () => void;
};

export function FormularioUE({ onNext }: FormularioUEProps) {
    const { isAssistenteOuDiretor } = useUserPermissions();
    const formData = useOcorrenciaFormStore((state) => state.formData);
    const ocorrenciaUuid = useOcorrenciaFormStore(
        (state) => state.ocorrenciaUuid
    );
    const queryClient = useQueryClient();
    const reset = useOcorrenciaFormStore((state) => state.reset);
    const router = useRouter();

    const { mutate: atualizarFormularioCompletoUE, isPending } =
        useAtualizarFormularioCompletoUE();

    // Refs para acessar os métodos dos formulários
    const secaoInicialRef = useRef<SecaoInicialRef>(null);
    const secaoFurtoERouboRef = useRef<SecaoFurtoERouboRef>(null);
    const secaoNaoFurtoERouboRef = useRef<SecaoNaoFurtoERouboRef>(null);
    const informacoesAdicionaisRef = useRef<InformacoesAdicionaisRef>(null);
    const secaoFinalRef = useRef<SecaoFinalRef>(null);

    // Estados locais que refletem os valores dos formulários em tempo real
    const [currentTipoOcorrencia, setCurrentTipoOcorrencia] = useState<
        string | undefined
    >(formData.tipoOcorrencia);
    const [currentPossuiInfoAgressor, setCurrentPossuiInfoAgressor] = useState<
        string | undefined
    >(formData.possuiInfoAgressorVitima);

    // Valores reativos baseados nos estados locais
    const isFurtoRoubo = currentTipoOcorrencia === "Sim";
    const hasAgressorVitimaInfo = currentPossuiInfoAgressor === "Sim";

    // Callbacks para receber mudanças dos formulários
    const handleSecaoInicialChange = (data: { tipoOcorrencia?: string }) => {
        if (data.tipoOcorrencia !== undefined) {
            setCurrentTipoOcorrencia(data.tipoOcorrencia);
        }
    };

    const handleSecaoNaoFurtoChange = (data: {
        possuiInfoAgressorVitima?: string;
    }) => {
        if (data.possuiInfoAgressorVitima !== undefined) {
            setCurrentPossuiInfoAgressor(data.possuiInfoAgressorVitima);
        }
    };

    // Inicializa com valores do formData
    useEffect(() => {
        setCurrentTipoOcorrencia(formData.tipoOcorrencia);
        setCurrentPossuiInfoAgressor(formData.possuiInfoAgressorVitima);
    }, [formData.tipoOcorrencia, formData.possuiInfoAgressorVitima]);

    const getStep2Label = () => {
        return isFurtoRoubo ? "Formulário patrimonial" : "Formulário geral";
    };

    const getStep3Label = () => {
        return hasAgressorVitimaInfo && !isFurtoRoubo
            ? "Informações adicionais"
            : "Seção final";
    };

    const steps = [
        { label: "Cadastro de ocorrência", description: "" },
        { label: getStep2Label(), description: "" },

        ...(hasAgressorVitimaInfo && !isFurtoRoubo
            ? [
                  { label: getStep3Label(), description: "" },
                  { label: "Seção final", description: "" },
              ]
            : [{ label: getStep3Label(), description: "" }]),

        { label: "Anexos", description: "" },
    ];

    const totalSteps = steps.length + 1;

    const handleClickBack = async () => {
        reset();

        await queryClient.invalidateQueries({
            queryKey: ["ocorrencia", ocorrenciaUuid],
        });
    };

    const handleSaveAll = async () => {
        try {
            // Coleta dados de todos os formulários sem fazer submit individual
            const secaoInicialData = secaoInicialRef.current?.getFormData();

            // Valida a Seção Inicial
            const secaoInicialValid = await secaoInicialRef.current
                ?.getFormInstance()
                .trigger();
            if (!secaoInicialValid) {
                toast({
                    title: "Erro ao validar Seção Inicial",
                    description:
                        "Verifique os campos da Seção Inicial e tente novamente.",
                    variant: "error",
                });
                return;
            }

            // Coleta dados da seção de furto/roubo ou não furto/roubo
            let secaoTipoData;
            let secaoTipoValid;

            if (isFurtoRoubo) {
                secaoTipoData = secaoFurtoERouboRef.current?.getFormData();
                secaoTipoValid = await secaoFurtoERouboRef.current
                    ?.getFormInstance()
                    .trigger();
                if (!secaoTipoValid) {
                    toast({
                        title: "Erro ao validar Formulário Patrimonial",
                        description: "Verifique os campos e tente novamente.",
                        variant: "error",
                    });
                    return;
                }
            } else {
                secaoTipoData = secaoNaoFurtoERouboRef.current?.getFormData();
                secaoTipoValid = await secaoNaoFurtoERouboRef.current
                    ?.getFormInstance()
                    .trigger();
                if (!secaoTipoValid) {
                    toast({
                        title: "Erro ao validar Formulário Geral",
                        description: "Verifique os campos e tente novamente.",
                        variant: "error",
                    });
                    return;
                }
            }

            // Coleta dados das Informações Adicionais (se houver)
            let informacoesAdicionaisData;
            if (hasAgressorVitimaInfo) {
                informacoesAdicionaisData =
                    informacoesAdicionaisRef.current?.getFormData();
                const infoAdicionaisValid =
                    await informacoesAdicionaisRef.current
                        ?.getFormInstance()
                        .trigger();
                if (!infoAdicionaisValid) {
                    toast({
                        title: "Erro ao validar Informações Adicionais",
                        description: "Verifique os campos e tente novamente.",
                        variant: "error",
                    });
                    return;
                }
            }

            // Coleta dados da Seção Final
            const secaoFinalData = secaoFinalRef.current?.getFormData();
            const secaoFinalValid = await secaoFinalRef.current
                ?.getFormInstance()
                .trigger();
            if (!secaoFinalValid) {
                toast({
                    title: "Erro ao validar Seção Final",
                    description: "Verifique os campos e tente novamente.",
                    variant: "error",
                });
                return;
            }

            // Mapeia os dados para o formato esperado pelo backend
            const temInfoAgressorVitima =
                !isFurtoRoubo &&
                (secaoTipoData as { possuiInfoAgressorVitima?: string })
                    ?.possuiInfoAgressorVitima === "Sim";

            // Mapeia valores de comunicação com segurança pública
            const comunicacaoMap: Record<string, string> = {
                "Sim, com a GCM": "sim_gcm",
                "Sim, com a PM": "sim_pm",
                Não: "nao",
            };

            // Mapeia valores de protocolo acionado
            const protocoloMap: Record<string, string> = {
                Ameaça: "ameaca",
                Alerta: "alerta",
                "Apenas para registro/não se aplica": "registro",
            };

            const body: FormularioCompletoUEBody = {
                // Seção Inicial
                data_ocorrencia: `${secaoInicialData?.dataOcorrencia}T${secaoInicialData?.horaOcorrencia}:00.000Z`,
                unidade_codigo_eol: secaoInicialData?.unidadeEducacional || "",
                dre_codigo_eol: secaoInicialData?.dre || "",
                sobre_furto_roubo_invasao_depredacao:
                    secaoInicialData?.tipoOcorrencia === "Sim",

                // Seção Furto/Roubo ou Não Furto/Roubo (campos compartilhados)
                tipos_ocorrencia: secaoTipoData?.tiposOcorrencia || [],
                descricao_ocorrencia: secaoTipoData?.descricao || "",
                smart_sampa_situacao: isFurtoRoubo
                    ? (secaoTipoData as { smartSampa?: string })?.smartSampa ||
                      "nao_faz_parte"
                    : "nao_faz_parte",
                envolvido: isFurtoRoubo
                    ? ""
                    : (secaoTipoData as { envolvidos?: string })?.envolvidos ||
                      "",
                tem_info_agressor_ou_vitima: temInfoAgressorVitima
                    ? "sim"
                    : "nao",

                // Seção Final
                declarante: secaoFinalData?.declarante || "",
                comunicacao_seguranca_publica:
                    comunicacaoMap[
                        secaoFinalData?.comunicacaoSeguranca || ""
                    ] || "nao",
                protocolo_acionado:
                    protocoloMap[secaoFinalData?.protocoloAcionado || ""] ||
                    "registro",

                // Informações Adicionais (opcionais)
                ...(informacoesAdicionaisData && {
                    nome_pessoa_agressora:
                        informacoesAdicionaisData.nomeAgressor,
                    idade_pessoa_agressora: Number(
                        informacoesAdicionaisData.idadeAgressor
                    ),
                    motivacao_ocorrencia:
                        informacoesAdicionaisData.motivoOcorrencia,
                    genero_pessoa_agressora: informacoesAdicionaisData.genero,
                    grupo_etnico_racial:
                        informacoesAdicionaisData.grupoEtnicoRacial,
                    etapa_escolar: informacoesAdicionaisData.etapaEscolar,
                    frequencia_escolar:
                        informacoesAdicionaisData.frequenciaEscolar,
                    interacao_ambiente_escolar:
                        informacoesAdicionaisData.interacaoAmbienteEscolar,
                    redes_protecao_acompanhamento:
                        informacoesAdicionaisData.redesProtecao,
                    notificado_conselho_tutelar:
                        informacoesAdicionaisData.notificadoConselhoTutelar ===
                        "Sim",
                    acompanhado_naapa:
                        informacoesAdicionaisData.acompanhadoNAAPA === "Sim",
                    cep: informacoesAdicionaisData.cep,
                    logradouro: informacoesAdicionaisData.logradouro,
                    numero_residencia: informacoesAdicionaisData.numero,
                    complemento: informacoesAdicionaisData.complemento,
                    bairro: informacoesAdicionaisData.bairro,
                    cidade: informacoesAdicionaisData.cidade,
                    estado: informacoesAdicionaisData.estado,
                }),
            };

            // Valida que ocorrenciaUuid não é null
            if (!ocorrenciaUuid) {
                toast({
                    title: "Erro",
                    description: "UUID da ocorrência não encontrado.",
                    variant: "error",
                });
                return;
            }

            // Envia para o backend
            atualizarFormularioCompletoUE(
                {
                    uuid: ocorrenciaUuid,
                    body,
                },
                {
                    onSuccess: (result) => {
                        if (result.success) {
                            toast({
                                title: "Sucesso",
                                description:
                                    "Formulário atualizado com sucesso!",
                                variant: "success",
                            });

                            // Invalida queries para atualizar dados
                            queryClient
                                .invalidateQueries({
                                    queryKey: ["ocorrencia", ocorrenciaUuid],
                                })
                                .then(() => {
                                    // Chama onNext se fornecido, senão redireciona para dashboard
                                    if (onNext) {
                                        onNext();
                                    } else {
                                        router.push("/dashboard");
                                    }
                                });
                        } else {
                            toast({
                                title: "Erro ao atualizar",
                                description:
                                    result.error ||
                                    "Ocorreu um erro ao atualizar o formulário.",
                                variant: "error",
                            });
                        }
                    },
                    onError: (err) => {
                        console.error("Erro ao atualizar:", err);
                        toast({
                            title: "Erro ao atualizar",
                            description:
                                "Ocorreu um erro ao atualizar o formulário.",
                            variant: "error",
                        });
                    },
                }
            );
        } catch (err) {
            console.error("Erro ao validar:", err);
            toast({
                title: "Erro ao validar",
                description:
                    "Ocorreu um erro ao validar os formulários. Tente novamente.",
                variant: "error",
            });
        }
    };

    return (
        <>
            <PageHeader
                title="Intercorrências Institucionais"
                onClickBack={handleClickBack}
            />
            <QuadroBranco>
                <div className="flex flex-col">
                    <h1 className="text-[#42474a] text-[24px] font-bold m-0">
                        Nova ocorrência
                    </h1>
                    <span className="text-[14px] text-[#42474a] my-4">
                        Preencha as informações abaixo para registrar uma nova
                        ocorrência. Lembre-se de colocar a maior quantidade de
                        detalhes possíveis para nos ajudar a planejar ações de
                        prevenção e solução de problemas de segurança.
                    </span>
                    <p className="text-[14px] text-[#42474a]">
                        *Respostas obrigatórias
                    </p>
                </div>
            </QuadroBranco>
            <QuadroBranco>
                <div className="mt-4">
                    <Stepper steps={steps} currentStep={totalSteps} />
                </div>

                <div className="flex flex-col mt-8">
                    <div>
                        <SecaoInicial
                            ref={secaoInicialRef}
                            showButtons={false}
                            onFormChange={handleSecaoInicialChange}
                        />
                    </div>

                    <div>
                        {isFurtoRoubo ? (
                            <SecaoFurtoERoubo
                                ref={secaoFurtoERouboRef}
                                showButtons={false}
                            />
                        ) : (
                            <SecaoNaoFurtoERoubo
                                ref={secaoNaoFurtoERouboRef}
                                showButtons={false}
                                onFormChange={handleSecaoNaoFurtoChange}
                            />
                        )}
                    </div>

                    {hasAgressorVitimaInfo && !isFurtoRoubo && (
                        <div>
                            <InformacoesAdicionais
                                ref={informacoesAdicionaisRef}
                                showButtons={false}
                            />
                        </div>
                    )}

                    <div>
                        <SecaoFinal ref={secaoFinalRef} showButtons={false} />
                    </div>

                    <div>
                        <Anexos showButtons={false} />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        {isAssistenteOuDiretor ? (
                            <Button
                                variant="submit"
                                onClick={() => handleSaveAll()}
                                disabled={isPending}
                            >
                                {isPending ? "Salvando..." : "Finalizar"}
                            </Button>
                        ) : (
                            <>
                                <Button
                                    size="sm"
                                    variant="customOutline"
                                    type="button"
                                    disabled
                                >
                                    Anterior
                                </Button>
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="submit"
                                    onClick={() => handleSaveAll()}
                                    disabled={isPending}
                                >
                                    {isPending ? "Salvando..." : "Próximo"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </QuadroBranco>
        </>
    );
}
