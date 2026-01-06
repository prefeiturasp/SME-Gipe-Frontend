"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/headless-toast";
import { Textarea } from "@/components/ui/textarea";

import Exclamation from "@/assets/icons/Exclamation";
import Aviso from "@/components/login/FormCadastro/Aviso";

import { FormDataMotivoEncerramento, formSchema } from "./schema";

import { useFinalizarEtapa } from "@/hooks/useFinalizarEtapa";
import { useFinalizarEtapaDre } from "@/hooks/useFinalizarEtapaDre";
import { useFinalizarEtapaGipe } from "@/hooks/useFinalizarEtapaGipe";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import {
    FinalizarEtapaResponse,
    FinalizarOcorrenciaResponse,
} from "@/types/finalizar-etapa";

type ModalFinalizarEtapaProps = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    perfilUsuario: string;
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
    perfilUsuario,
}: Readonly<ModalFinalizarEtapaProps>) {
    const [success, setSuccess] = useState(false);
    const [apiData, setApiData] = useState<FinalizarOcorrenciaResponse | null>(
        null
    );
    const { formData, ocorrenciaUuid } = useOcorrenciaFormStore();

    const { mutateAsync: finalizarEtapaUE, isPending: isPendingEtapaUE } =
        useFinalizarEtapa();
    const { mutateAsync: finalizarEtapaDRE, isPending: isPendingEtapaDRE } =
        useFinalizarEtapaDre();
    const { mutateAsync: finalizarEtapaGIPE, isPending: isPendingEtapaGIPE } =
        useFinalizarEtapaGipe();

    const router = useRouter();

    const form = useForm<FormDataMotivoEncerramento>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    function handleClose(value: boolean) {
        onOpenChange(value);

        if (!value) {
            form.reset();
            setSuccess(false);
            router.push("/dashboard");
        }
    }

    async function processarEncerramento(response: FinalizarEtapaResponse) {
        if (!response.success) {
            toast({
                variant: "error",
                title: "Erro ao finalizar etapa",
                description: response.error,
            });
            return;
        }

        if (response.data?.uuid) {
            setApiData(response.data);
            setSuccess(true);
        }
    }

    async function encerrarIntercorrenciaUE(
        values: FormDataMotivoEncerramento
    ) {
        const body = {
            unidade_codigo_eol: formData.unidadeEducacional,
            dre_codigo_eol: formData.dre,
            motivo_encerramento_ue: values.motivo,
        };

        const response = await finalizarEtapaUE({
            ocorrenciaUuid: ocorrenciaUuid!,
            body,
        });

        return processarEncerramento(response);
    }

    async function encerrarIntercorrenciaDRE(
        values: FormDataMotivoEncerramento
    ) {
        const body = {
            unidade_codigo_eol: formData.unidadeEducacional,
            dre_codigo_eol: formData.dre,
            motivo_encerramento_dre: values.motivo,
        };

        const response = await finalizarEtapaDRE({
            ocorrenciaUuid: ocorrenciaUuid!,
            body,
        });

        return processarEncerramento(response);
    }

    async function encerrarIntercorrenciaGIPE(
        values: FormDataMotivoEncerramento
    ) {
        const body = {
            unidade_codigo_eol: formData.unidadeEducacional,
            dre_codigo_eol: formData.dre,
            motivo_encerramento_gipe: values.motivo,
        };

        const response = await finalizarEtapaGIPE({
            ocorrenciaUuid: ocorrenciaUuid!,
            body,
        });

        return processarEncerramento(response);
    }

    function getApiResponseByPerfil(
        perfil: string,
        values: FormDataMotivoEncerramento
    ) {
        switch (perfil) {
            case "diretor":
            case "assistente":
                return encerrarIntercorrenciaUE(values);
            case "dre":
                return encerrarIntercorrenciaDRE(values);
            case "gipe":
                return encerrarIntercorrenciaGIPE(values);
            default:
                return null;
        }
    }

    async function handleSubmit(values: FormDataMotivoEncerramento) {
        const response = getApiResponseByPerfil(perfilUsuario, values);
        if (!response) return;
        await response;
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            {!success && (
                <DialogContent className="max-w-[700px] p-6 rounded-[4px]">
                    <DialogHeader className="pt-2">
                        <DialogTitle>Conclusão de etapa</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="sr-only">
                        Etapa finalizada, intercorrência criada.
                    </DialogDescription>
                    <Aviso
                        icon={
                            <Exclamation className="w-[50px] text-[#42474a]" />
                        }
                    >
                        Você está finalizando esta etapa da intercorrência e
                        isso registrará o encerramento no sistema e ficará
                        disponível para consulta e auditoria. Descreva o motivo
                        pelo qual esta intercorrência está sendo encerrada.
                    </Aviso>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <FormField
                                control={form.control}
                                name="motivo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[14px] font-[700] text-[#42474a]">
                                            Motivo do encerramento*
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Exemplo: Situação resolvida com conversa, medidas disciplinares aplicadas, encaminhamento realizado, etc."
                                                className="min-h-[80px] text-[14px] font-normal"
                                                data-testid="input-motivo"
                                            />
                                        </FormControl>
                                        <FormMessage />

                                        <p className="text-[12px] text-[#6B6B6B] mt-1">
                                            Esta justificativa será registrada
                                            permanentemente no histórico da
                                            intercorrência.
                                        </p>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="mt-6">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="customOutline"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Voltar
                                </Button>

                                <Button
                                    type="submit"
                                    size="sm"
                                    className="min-w-[86px] text-center rounded-md text-[14px] font-[700] bg-[#717FC7] text-white hover:bg-[#5a65a8]"
                                    disabled={
                                        !form.formState.isValid ||
                                        isPendingEtapaUE ||
                                        isPendingEtapaDRE ||
                                        isPendingEtapaGIPE
                                    }
                                >
                                    Finalizar
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            )}

            {success && (
                <DialogContent className="max-w-[700px] p-6 rounded-[4px]">
                    <DialogHeader className="pt-2">
                        <DialogTitle className="text-[20px]">
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
                            <strong>
                                {apiData?.protocolo_da_intercorrencia}
                            </strong>
                        </span>
                    </Aviso>

                    <Aviso>
                        <div className="text-[14px] leading-5 text-[#42474a]">
                            {camposFinalizarEtapa.map((campo) =>
                                campo.perfisVisiveis.includes(perfilUsuario) ? (
                                    <p
                                        key={campo.key}
                                        data-testid={`campo-${campo.key}`}
                                    >
                                        <strong>{campo.label}:</strong>{" "}
                                        {apiData?.[campo.key] ?? ""}
                                    </p>
                                ) : null
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
            )}
        </Dialog>
    );
}
