"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/headless-toast";

import Aviso from "@/components/login/FormCadastro/Aviso";

import { useFinalizarEtapa } from "@/hooks/useFinalizarEtapa";
import { useFinalizarEtapaDre } from "@/hooks/useFinalizarEtapaDre";
import { useFinalizarEtapaGipe } from "@/hooks/useFinalizarEtapaGipe";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { FinalizarOcorrenciaResponse } from "@/types/finalizar-etapa";

type ModalFinalizarEtapaProps = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onLoadingChange?: (loading: boolean) => void;
    etapa: string;
};

type CamposFinalizarEtapaProps = {
    label: string;
    key: keyof FinalizarOcorrenciaResponse;
    perfisVisiveis: string[];
};

const camposFinalizarEtapa: CamposFinalizarEtapaProps[] = [
    {
        label: "Responsável",
        key: "responsavel_nome",
        perfisVisiveis: ["diretor", "assistente", "dre", "gipe"],
    },
    {
        label: "CPF",
        key: "responsavel_cpf",
        perfisVisiveis: ["diretor", "assistente", "dre", "gipe"],
    },
    {
        label: "E-mail",
        key: "responsavel_email",
        perfisVisiveis: ["diretor", "assistente", "dre", "gipe"],
    },
    {
        label: "Perfil de acesso",
        key: "perfil_acesso",
        perfisVisiveis: ["diretor", "assistente"],
    },
    {
        label: "Diretoria Regional",
        key: "nome_dre",
        perfisVisiveis: ["diretor", "assistente", "dre"],
    },
    {
        label: "Unidade Educacional",
        key: "nome_unidade",
        perfisVisiveis: ["diretor", "assistente"],
    },
];

export default function ModalFinalizarEtapa({
    open,
    onOpenChange,
    onLoadingChange,
    etapa,
}: Readonly<ModalFinalizarEtapaProps>) {
    const [success, setSuccess] = useState(false);
    const [apiData, setApiData] = useState<FinalizarOcorrenciaResponse | null>(
        null,
    );
    const hasCalledRef = useRef(false);
    const { formData, ocorrenciaUuid } = useOcorrenciaFormStore();

    const { mutateAsync: finalizarEtapaUE } = useFinalizarEtapa();
    const { mutateAsync: finalizarEtapaDRE } = useFinalizarEtapaDre();
    const { mutateAsync: finalizarEtapaGIPE } = useFinalizarEtapaGipe();

    const router = useRouter();

    function handleClose(value: boolean) {
        onOpenChange(value);

        if (!value) {
            setSuccess(false);
            router.push("/dashboard");
        }
    }

    const finalizarEtapa = useCallback(async () => {
        const body = {
            unidade_codigo_eol: formData.unidadeEducacional,
            dre_codigo_eol: formData.dre,
        };

        onLoadingChange?.(true);

        try {
            let response;

            switch (etapa) {
                case "diretor":
                case "assistente":
                    response = await finalizarEtapaUE({
                        ocorrenciaUuid: ocorrenciaUuid!,
                        body,
                    });
                    break;
                case "dre":
                    response = await finalizarEtapaDRE({
                        ocorrenciaUuid: ocorrenciaUuid!,
                        body,
                    });
                    break;
                case "gipe":
                    response = await finalizarEtapaGIPE({
                        ocorrenciaUuid: ocorrenciaUuid!,
                        body,
                    });
                    break;
                default:
                    return;
            }

            if (!response.success) {
                toast({
                    variant: "error",
                    title: "Erro ao finalizar etapa",
                    description: response.error,
                });
                onOpenChange(false);
                return;
            }

            if (response.data?.uuid) {
                setApiData(response.data);
                setSuccess(true);
            }
        } catch {
            toast({
                variant: "error",
                title: "Erro ao finalizar etapa",
                description: "Ocorreu um erro inesperado. Tente novamente.",
            });
            onOpenChange(false);
        } finally {
            onLoadingChange?.(false);
        }
    }, [
        formData,
        ocorrenciaUuid,
        etapa,
        finalizarEtapaUE,
        finalizarEtapaDRE,
        finalizarEtapaGIPE,
        onOpenChange,
        onLoadingChange,
    ]);

    useEffect(() => {
        if (open && !hasCalledRef.current) {
            hasCalledRef.current = true;
            finalizarEtapa();
        }

        if (!open) {
            hasCalledRef.current = false;
        }
    }, [open, finalizarEtapa]);

    return (
        <Dialog open={open && success} onOpenChange={() => onOpenChange(false)}>
            <DialogContent className="max-w-[700px] p-6 rounded-[4px]">
                <DialogHeader className="pt-2">
                    <DialogTitle className="text-[20px] text-[#42474a] font-[700]">
                        Ocorrência registrada com sucesso!
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Confira os dados o protocolo da sua intercorrência.
                </DialogDescription>
                <Aviso>
                    <span
                        data-testid="protocolo-text"
                        className="text-[14px] font-[700]"
                    >
                        Protocolo da intercorrência:{" "}
                        <strong>{apiData?.protocolo_da_intercorrencia}</strong>
                    </span>
                </Aviso>
                <Aviso>
                    <div className="text-[14px] leading-5 text-[#42474a]">
                        {camposFinalizarEtapa.map((campo) =>
                            campo.perfisVisiveis.includes(etapa) ? (
                                <p
                                    key={campo.key}
                                    data-testid={`campo-${campo.key}`}
                                >
                                    <strong>{campo.label}:</strong>{" "}
                                    {apiData?.[campo.key] ?? ""}
                                </p>
                            ) : null,
                        )}
                    </div>
                </Aviso>

                <p className="text-[12px] text-[#6B6B6B] mt-2 px-1">
                    Você pode acompanhar o status no histórico de ocorrência
                    registradas.
                </p>

                <DialogFooter className="mt-6">
                    <Button
                        size="sm"
                        className="text-center rounded-md text-[14px] font-[700] bg-[#717FC7] text-white hover:bg-[#5a65a8]"
                        onClick={() => handleClose(false)}
                    >
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
