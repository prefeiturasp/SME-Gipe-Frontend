"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/headless-toast";


import Aviso from "@/components/login/FormCadastro/Aviso";
import Exclamation from "@/assets/icons/Exclamation";

import {
    formSchema,
    FormDataMotivoEncerramento,
} from "./schema";

import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useFinalizarEtapa } from "@/hooks/useFinalizarEtapa";
import { FinalizarOcorrenciaResponse } from "@/types/finalizar-etapa";



type ModalFinalizarEtapaProps = {
    open: boolean;
    onOpenChange: (v: boolean) => void;

};

export default function ModalFinalizarEtapa({
    open,
    onOpenChange,
}: Readonly<ModalFinalizarEtapaProps>) {
    const [success, setSuccess] = useState(false);
    const [apiData, setApiData] = useState<FinalizarOcorrenciaResponse | null>(null);
    const {
        formData,
        ocorrenciaUuid
    } = useOcorrenciaFormStore();

    const { mutateAsync, isPending } = useFinalizarEtapa();

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

    async function handleSubmit(values: FormDataMotivoEncerramento) {
        const body = {
            unidade_codigo_eol: formData.unidadeEducacional,
            dre_codigo_eol: formData.dre,
            motivo_encerramento_ue: values.motivo,
        };

        const response = await mutateAsync({
            ocorrenciaUuid: ocorrenciaUuid!,
            body,
        });
        
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
                        <Aviso icon={<Exclamation className="w-[50px] text-[#42474a]" />}>
                            Você está finalizando esta etapa da intercorrência e isso registrará o 
                            encerramento no sistema e ficará disponível para consulta e auditoria. 
                            Descreva o motivo pelo qual esta intercorrência está sendo encerrada.
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
                                                Esta justificativa será registrada permanentemente no histórico da intercorrência.
                                            </p>
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter className="mt-6">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="customOutline"
                                        onClick={() => handleClose(false)}
                                    >
                                        Voltar
                                    </Button>

                                    <Button
                                        type="submit"
                                        size="sm"
                                        className="min-w-[86px] text-center rounded-md text-[14px] font-[700] bg-[#717FC7] text-white hover:bg-[#5a65a8]"
                                        disabled={!form.formState.isValid || isPending}
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
                        <DialogTitle className="text-[20px]">Ocorrência registrada com sucesso!</DialogTitle>
                    </DialogHeader>
                        <DialogDescription className="sr-only">
                            Confira os dados o protocolo da sua intercorrência.
                        </DialogDescription>
                        <Aviso>
                            <span className="text-[14px] font-[700]">
                                Protocolo da intercorrência: <strong>{apiData?.protocolo_da_intercorrencia}</strong>
                            </span>
                        </Aviso>

                        <Aviso>
                            <div className="text-[14px] leading-5 text-[#42474a]">
                                <p><strong>Responsável:</strong> {apiData?.responsavel_nome}</p>
                                <p><strong>CPF:</strong> {apiData?.responsavel_cpf}</p>
                                <p><strong>E-mail:</strong> {apiData?.responsavel_email}</p>
                                <p><strong>Perfil de acesso:</strong> {apiData?.perfil_acesso}</p>
                                <p><strong>Diretoria Regional:</strong> {apiData?.nome_dre}</p>
                                <p><strong>Unidade Educacional:</strong> {apiData?.nome_unidade}</p>
                            </div>
                        </Aviso>

                        <p className="text-[12px] text-[#6B6B6B] mt-2 px-1">
                            Você pode acompanhar o status no histórico de ocorrência registradas.
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
