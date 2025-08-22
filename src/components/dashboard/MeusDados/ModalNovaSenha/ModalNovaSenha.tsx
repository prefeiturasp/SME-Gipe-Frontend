"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputSenhaComToggle from "../../../InputSenhaComToggle/InputSenhaComToggle";
import { cn } from "@/lib/utils";
import Check from "@/assets/icons/Check";
import CloseCheck from "@/assets/icons/CloseCheck";

import formSchema, { FormAlterarSenha } from "./schema";

type ModalNovaSenhaProps = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSalvar?: (payload: {
        senhaAtual: string;
        novaSenha: string;
    }) => Promise<void> | void;
    loading?: boolean;
    erroGeral?: string | null;
};

type StatusType = "idle" | "ok" | "error";

export default function ModalNovaSenha({
    open,
    onOpenChange,
    onSalvar,
    loading,
    erroGeral,
}: Readonly<ModalNovaSenhaProps>) {
    const form = useForm<FormAlterarSenha>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            oldPassword: "",
            password: "",
            confirmPassword: "",
        },
    });

    const { watch, formState } = form;
    const password = watch("password");
    const confirmPassword = watch("confirmPassword");
    const oldPassword = watch("oldPassword");

    const STATUS_STYLES: Record<StatusType, string> = {
        idle: "text-[#42474a]",
        ok: "text-[#297805]",
        error: "text-[#b40c31]",
    };

    const getStatus = (hasPassword: boolean, pass: boolean): StatusType => {
        let status: StatusType;
        if (!hasPassword) {
            status = "idle";
        } else if (pass) {
            status = "ok";
        } else {
            status = "error";
        }
        return status;
    };

    const passwordCriteria = useMemo(
        () => [
            {
                label: "Uma letra maiúscula",
                test: (v: string) => /[A-Z]/.test(v),
            },
            {
                label: "Uma letra minúscula",
                test: (v: string) => /[a-z]/.test(v),
            },
            {
                label: "Entre 8 e 12 caracteres",
                test: (v: string) => v.length >= 8 && v.length <= 12,
            },
            {
                label: "Ao menos 01 número",
                test: (v: string) => /\d/.test(v),
            },
            {
                label: "Ao menos 01 símbolo",
                test: (v: string) => /[#!@&?.*_]/.test(v),
            },
            {
                label: "Espaço em branco",
                test: (v: string) => !/\s/.test(v),
            },
            {
                label: "Caracteres acentuados",
                test: (v: string) => !/[À-ÖØ-öø-ÿ]/.test(v),
            },
        ],
        []
    );

    const passwordStatus = passwordCriteria.map((c) => c.test(password || ""));

    const todosCriteriosOk = passwordStatus.every(Boolean);
    const podeSalvar =
        !!oldPassword &&
        !!password &&
        !!confirmPassword &&
        todosCriteriosOk &&
        formState.isValid &&
        !loading;

    const onSubmit = form.handleSubmit(async ({ oldPassword, password }) => {
        await onSalvar?.({ senhaAtual: oldPassword, novaSenha: password });
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[660px] p-8 rounded-none rounded-0">
                <DialogHeader>
                    <DialogTitle>Nova senha</DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Informe sua nova senha seguindo os critérios abaixo.
                </DialogDescription>

                <Form {...form}>
                    <form onSubmit={onSubmit}>
                        <div className="flex flex-col md:flex-row gap-6 mt-3">
                            <div className="w-full md:w-[40%]">
                                <span className="text-[14px] font-[700] text-[#42474a] leading-[1.2]">
                                    A nova senha deve conter:
                                </span>
                                <div className="mt-3">
                                    {passwordCriteria
                                        .slice(0, 5)
                                        .map((c, idx) => {
                                            const status = getStatus(
                                                !!password,
                                                passwordStatus[idx]
                                            );
                                            return (
                                                <div
                                                    key={c.label}
                                                    className={cn(
                                                        "flex items-center text-sm gap-1 mb-2 last:mb-0",
                                                        STATUS_STYLES[status]
                                                    )}
                                                >
                                                    {status === "ok" && (
                                                        <Check />
                                                    )}
                                                    {status === "error" && (
                                                        <CloseCheck />
                                                    )}
                                                    {c.label}
                                                </div>
                                            );
                                        })}
                                </div>
                                <span className="text-[14px] font-[700] text-[#42474a] leading-[1.2] mt-4 block">
                                    A nova senha NÃO deve conter:
                                </span>
                                <div className="mt-3">
                                    {passwordCriteria.slice(5).map((c, idx) => {
                                        const status = getStatus(
                                            !!password,
                                            passwordStatus[idx + 5]
                                        );
                                        return (
                                            <div
                                                key={c.label}
                                                className={cn(
                                                    "flex items-center text-sm gap-1 mb-2 last:mb-0",
                                                    STATUS_STYLES[status]
                                                )}
                                            >
                                                {status === "ok" && <Check />}
                                                {status === "error" && (
                                                    <CloseCheck />
                                                )}
                                                {c.label}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="w-full md:w-[60%] space-y-4">
                                <FormField
                                    control={form.control}
                                    name="oldPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="required text-[#42474a] text-[14px] font-[700] mb-2 block">
                                                Senha atual*
                                            </FormLabel>
                                            <FormControl>
                                                <InputSenhaComToggle
                                                    placeholder="Digite a senha atual"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="required text-[#42474a] text-[14px] font-[700] mb-2 block">
                                                Nova senha*
                                            </FormLabel>
                                            <FormControl>
                                                <InputSenhaComToggle
                                                    placeholder="Digite a nova senha"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="required text-[#42474a] text-[14px] font-[700] mb-2 block">
                                                Confirmação da nova senha*
                                            </FormLabel>
                                            <FormControl>
                                                <InputSenhaComToggle
                                                    placeholder="Digite a nova senha novamente"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {erroGeral && (
                            <p className="text-[12px] text-[#b40c31] mt-3">
                                {erroGeral}
                            </p>
                        )}

                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                size="sm"
                                variant="customOutline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                className="text-center rounded-md text-[14px] font-[700] bg-[#717FC7] text-white hover:bg-[#5a65a8]"
                                disabled={!podeSalvar}
                                loading={!!loading}
                            >
                                Salvar senha
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
