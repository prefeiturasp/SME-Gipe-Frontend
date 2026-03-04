"use client";

import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import { Stepper } from "@/components/stepper/Stepper";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/headless-toast";
import { useAtualizarFormularioCompletoUE } from "@/hooks/useAtualizarFormularioCompletoUE";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { filterValidTiposOcorrencia } from "@/lib/formUtils";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { FormularioCompletoUEBody } from "@/types/formulario-completo-ue";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Anexos from "../CadastrarOcorrencia/Anexos";
import InformacoesAdicionais, {
    InformacoesAdicionaisRef,
} from "../CadastrarOcorrencia/InformacoesAdicionais";
import SecaoFinal, { SecaoFinalRef } from "../CadastrarOcorrencia/SecaoFinal";
import SecaoFurtoERoubo, {
    SecaoFurtoERouboRef,
} from "../CadastrarOcorrencia/SecaoFurtoERoubo";
import SecaoInicial, {
    SecaoInicialRef,
} from "../CadastrarOcorrencia/SecaoInicial";
import SecaoNaoFurtoERoubo, {
    SecaoNaoFurtoERouboRef,
} from "../CadastrarOcorrencia/SecaoNaoFurtoERoubo";
import PageHeader from "../PageHeader/PageHeader";

export type FormularioUEProps = {
    readonly onNext?: () => void;
};

export function FormularioUE({ onNext }: FormularioUEProps) {
    const { isAssistenteOuDiretor } = useUserPermissions();
    const formData = useOcorrenciaFormStore((state) => state.formData);
    const setFormData = useOcorrenciaFormStore((state) => state.setFormData);
    const ocorrenciaUuid = useOcorrenciaFormStore(
        (state) => state.ocorrenciaUuid,
    );
    const queryClient = useQueryClient();
    const reset = useOcorrenciaFormStore((state) => state.reset);
    const router = useRouter();

    const isReadOnly = isAssistenteOuDiretor;

    const { mutate: atualizarFormularioCompletoUE, isPending } =
        useAtualizarFormularioCompletoUE();

    // Refs para acessar os métodos dos formulários
    const secaoInicialRef = useRef<SecaoInicialRef>(null);
    const secaoFurtoERouboRef = useRef<SecaoFurtoERouboRef>(null);
    const secaoNaoFurtoERouboRef = useRef<SecaoNaoFurtoERouboRef>(null);
    const informacoesAdicionaisRef = useRef<InformacoesAdicionaisRef>(null);
    const secaoFinalRef = useRef<SecaoFinalRef>(null);

    // Ref para evitar loop infinito ao sincronizar tiposOcorrencia com o store
    const lastSyncedTiposRef = useRef<string[]>(
        (formData.tiposOcorrencia as string[]) ?? [],
    );

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

    // Usa estado local (reativo) para buscar tipos corretos ao trocar o radio
    const tipoFormulario = isFurtoRoubo ? "PATRIMONIAL" : "GERAL";
    const { data: tiposOcorrenciaDisponiveis } =
        useTiposOcorrencia(tipoFormulario);

    // Callbacks para receber mudanças dos formulários
    const handleSecaoInicialChange = (data: { tipoOcorrencia?: string }) => {
        if (data.tipoOcorrencia !== undefined) {
            setCurrentTipoOcorrencia(data.tipoOcorrencia);
        }
    };

    const syncTiposOcorrencia = (tipos: string[]) => {
        const prev = lastSyncedTiposRef.current;
        if (
            prev.length !== tipos.length ||
            prev.some((v, i) => v !== tipos[i])
        ) {
            lastSyncedTiposRef.current = tipos;
            setFormData({ tiposOcorrencia: tipos });
        }
    };

    const handleSecaoFurtoChange = (data: { tiposOcorrencia?: string[] }) => {
        if (data.tiposOcorrencia !== undefined) {
            syncTiposOcorrencia(data.tiposOcorrencia);
        }
    };

    const handleSecaoNaoFurtoChange = (data: {
        possuiInfoAgressorVitima?: string;
        tiposOcorrencia?: string[];
    }) => {
        if (data.possuiInfoAgressorVitima !== undefined) {
            setCurrentPossuiInfoAgressor(data.possuiInfoAgressorVitima);
        }
        if (data.tiposOcorrencia !== undefined) {
            syncTiposOcorrencia(data.tiposOcorrencia);
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

    const validateAllForms = async () => {
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
            return false;
        }

        // Valida seção de furto/roubo ou não furto/roubo
        const secaoTipoValid = isFurtoRoubo
            ? await secaoFurtoERouboRef.current?.getFormInstance().trigger()
            : await secaoNaoFurtoERouboRef.current?.getFormInstance().trigger();

        if (!secaoTipoValid) {
            toast({
                title: isFurtoRoubo
                    ? "Erro ao validar Formulário Patrimonial"
                    : "Erro ao validar Formulário Geral",
                description: "Verifique os campos e tente novamente.",
                variant: "error",
            });
            return false;
        }

        // Valida Informações Adicionais (se houver)
        if (hasAgressorVitimaInfo && !isFurtoRoubo) {
            const infoAdicionaisValid = await informacoesAdicionaisRef.current
                ?.getFormInstance()
                .trigger();
            if (!infoAdicionaisValid) {
                toast({
                    title: "Erro ao validar Informações Adicionais",
                    description: "Verifique os campos e tente novamente.",
                    variant: "error",
                });
                return false;
            }
        }

        // Valida Seção Final
        const secaoFinalValid = await secaoFinalRef.current
            ?.getFormInstance()
            .trigger();
        if (!secaoFinalValid) {
            toast({
                title: "Erro ao validar Seção Final",
                description: "Verifique os campos e tente novamente.",
                variant: "error",
            });
            return false;
        }

        return true;
    };

    const buildRequestBody = (): FormularioCompletoUEBody => {
        const secaoInicialData = secaoInicialRef.current?.getFormData();
        const secaoTipoData = isFurtoRoubo
            ? secaoFurtoERouboRef.current?.getFormData()
            : secaoNaoFurtoERouboRef.current?.getFormData();
        const informacoesAdicionaisData =
            hasAgressorVitimaInfo && !isFurtoRoubo
                ? informacoesAdicionaisRef.current?.getFormData()
                : undefined;
        const secaoFinalData = secaoFinalRef.current?.getFormData();

        const temInfoAgressorVitima =
            !isFurtoRoubo &&
            (secaoTipoData as { possuiInfoAgressorVitima?: string })
                ?.possuiInfoAgressorVitima === "Sim";

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

        const dataHoraOcorrencia = new Date(
            `${secaoInicialData?.dataOcorrencia}T${secaoInicialData?.horaOcorrencia}`,
        ).toISOString();

        let smartSampaSituacao = "nao";
        if (isFurtoRoubo) {
            const smartSampaValue = (secaoTipoData as { smartSampa?: string })
                ?.smartSampa;
            smartSampaSituacao = smartSampaValue === "Sim" ? "sim" : "nao";
        }

        return {
            data_ocorrencia: dataHoraOcorrencia,
            unidade_codigo_eol: secaoInicialData?.unidadeEducacional ?? "",
            dre_codigo_eol: secaoInicialData?.dre ?? "",
            sobre_furto_roubo_invasao_depredacao:
                secaoInicialData?.tipoOcorrencia === "Sim",
            tipos_ocorrencia: filterValidTiposOcorrencia(
                secaoTipoData?.tiposOcorrencia ?? [],
                tiposOcorrenciaDisponiveis,
            ),
            descricao_ocorrencia: secaoTipoData?.descricao ?? "",
            smart_sampa_situacao: smartSampaSituacao,
            ...(!isFurtoRoubo &&
                (secaoTipoData as { envolvidos?: string[] })?.envolvidos && {
                    envolvido:
                        (secaoTipoData as { envolvidos?: string[] })
                            ?.envolvidos ?? [],
                }),
            tem_info_agressor_ou_vitima: temInfoAgressorVitima ? "sim" : "nao",
            declarante: secaoFinalData?.declarante ?? "",
            comunicacao_seguranca_publica:
                comunicacaoMap[secaoFinalData?.comunicacaoSeguranca ?? ""] ||
                "nao",
            protocolo_acionado:
                protocoloMap[secaoFinalData?.protocoloAcionado ?? ""] ||
                "registro",
            ...(informacoesAdicionaisData && {
                pessoas_agressoras:
                    informacoesAdicionaisData.pessoasAgressoras.map(
                        (pessoa) => ({
                            nome: pessoa.nome,
                            idade: Number(pessoa.idade),
                        }),
                    ),
                motivacao_ocorrencia:
                    informacoesAdicionaisData.motivoOcorrencia,
                genero_pessoa_agressora: informacoesAdicionaisData.genero,
                grupo_etnico_racial:
                    informacoesAdicionaisData.grupoEtnicoRacial,
                etapa_escolar: informacoesAdicionaisData.etapaEscolar,
                frequencia_escolar: informacoesAdicionaisData.frequenciaEscolar,
                interacao_ambiente_escolar:
                    informacoesAdicionaisData.interacaoAmbienteEscolar,
                redes_protecao_acompanhamento:
                    informacoesAdicionaisData.redesProtecao,
                notificado_conselho_tutelar:
                    informacoesAdicionaisData.notificadoConselhoTutelar ===
                    "Sim",
                acompanhado_naapa:
                    informacoesAdicionaisData.acompanhadoNAAPA === "Sim",
            }),
        };
    };

    const handleSaveAll = async () => {
        if (isReadOnly) {
            router.push("/dashboard");
            return;
        }

        try {
            const isValid = await validateAllForms();
            if (!isValid) return;

            if (!ocorrenciaUuid) {
                toast({
                    title: "Erro",
                    description: "UUID da ocorrência não encontrado.",
                    variant: "error",
                });
                return;
            }

            const body = buildRequestBody();

            atualizarFormularioCompletoUE(
                {
                    uuid: ocorrenciaUuid,
                    body,
                },
                {
                    onSuccess: (result) => {
                        if (result.success) {
                            queryClient
                                .invalidateQueries({
                                    queryKey: ["ocorrencia", ocorrenciaUuid],
                                })
                                .then(() => {
                                    if (onNext && !isAssistenteOuDiretor) {
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
                    onError: () => {
                        toast({
                            title: "Erro ao atualizar",
                            description:
                                "Ocorreu um erro ao atualizar o formulário.",
                            variant: "error",
                        });
                    },
                },
            );
        } catch {
            toast({
                title: "Erro ao validar",
                description:
                    "Ocorreu um erro ao validar os formulários. Tente novamente.",
                variant: "error",
            });
        }
    };

    const finalizarText = isAssistenteOuDiretor ? "Finalizar" : "Próximo";

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
                            disabled={isReadOnly}
                        />
                    </div>

                    <div>
                        {isFurtoRoubo ? (
                            <SecaoFurtoERoubo
                                ref={secaoFurtoERouboRef}
                                showButtons={false}
                                onFormChange={handleSecaoFurtoChange}
                                disabled={isReadOnly}
                            />
                        ) : (
                            <SecaoNaoFurtoERoubo
                                ref={secaoNaoFurtoERouboRef}
                                showButtons={false}
                                onFormChange={handleSecaoNaoFurtoChange}
                                disabled={isReadOnly}
                            />
                        )}
                    </div>

                    {hasAgressorVitimaInfo && !isFurtoRoubo && (
                        <div>
                            <InformacoesAdicionais
                                ref={informacoesAdicionaisRef}
                                showButtons={false}
                                disabled={isReadOnly}
                            />
                        </div>
                    )}

                    <div>
                        <SecaoFinal
                            ref={secaoFinalRef}
                            showButtons={false}
                            disabled={isReadOnly}
                        />
                    </div>

                    <div>
                        <Anexos
                            showButtons={false}
                            modoVisualizacao
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        {!isAssistenteOuDiretor && (
                            <Button
                                variant="customOutline"
                                type="button"
                                disabled
                            >
                                Anterior
                            </Button>
                        )}
                        <Button
                            variant="submit"
                            onClick={() => handleSaveAll()}
                            disabled={isReadOnly ? false : isPending}
                        >
                            {isPending ? "Salvando..." : finalizarText}
                        </Button>
                    </div>
                </div>
            </QuadroBranco>
        </>
    );
}
