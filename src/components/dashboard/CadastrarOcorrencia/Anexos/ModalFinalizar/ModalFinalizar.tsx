"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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

import Aviso from "@/components/login/FormCadastro/Aviso";
import Exclamation from "@/assets/icons/Exclamation";

const schema = z.object({
    motivo: z
        .string()
        .min(5, "O motivo deve ter pelo menos 5 caracteres.")
        .max(500, "O motivo pode ter no máximo 500 caracteres."),
});

type FormData = z.infer<typeof schema>;

type ModalFinalizarEtapaProps = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
};

export default function ModalFinalizarEtapa({
    open,
    onOpenChange,
}: Readonly<ModalFinalizarEtapaProps>) {
    const [success, setSuccess] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    function handleClose(v: boolean) {
        onOpenChange(v);
        if (!v) {
            form.reset();
            setSuccess(false);
        }
    }

    async function handleSubmit(values: FormData) {
        setSuccess(true);
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-[700px] p-8 rounded-[4px]">
                
                <DialogHeader>
                    <DialogTitle>Finalizar ocorrência</DialogTitle>
                </DialogHeader>

                <Aviso
                    icon={<Exclamation className="w-[50px] text-[#42474a]" />}
                >
                    Você está finalizando a intercorrência.
                    Esta ação registrará o encerramento no sistema e ficará
                    disponível para consulta e auditoria.
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
                                            className="min-h-[110px] text-[14px] font-normal"
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
                            {!success ? (
                                <>
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
                                        className="text-center rounded-md text-[14px] font-[700] bg-[#717FC7] text-white hover:bg-[#5a65a8]"
                                        disabled={!form.formState.isValid}
                                    >
                                        Finalizar
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    size="sm"
                                    className="text-center rounded-md text-[14px] font-[700] bg-[#717FC7] text-white hover:bg-[#5a65a8]"
                                    onClick={() => handleClose(false)}
                                >
                                    Fechar
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
