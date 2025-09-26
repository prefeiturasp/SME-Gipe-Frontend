"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmCancelButtons } from "@/components/ui/ConfirmCancelButtons";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/headless-toast";

import useAtualizarNome from "@/hooks/useAtualizarNome";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormDataMeusDados } from "./schema";
import { useUserStore } from "@/stores/useUserStore";
import ModalNovaSenha from "./ModalNovaSenha/ModalNovaSenha";
import ModalAlterarEmail from "./ModalAlterarEmail/ModalAlterarEmail";

const FormDados: React.FC = () => {
    const { mutateAsync, isPending } = useAtualizarNome();
    const [openModalNovaSenha, setOpenModalNovaSenha] = useState(false);
    const [openModalAlterarEmail, setOpenModalAlterarEmail] = useState(false);
    const user = useUserStore((state) => state.user);
    const [originalName, setOriginalName] = useState(user?.nome || "");
    const [editingName, setEditingName] = useState(false);
    const form = useForm<FormDataMeusDados>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            nome: user?.nome,
            email: user?.email,
            senha: "111111111111",
            cpf: user?.cpf,
            dre: user?.perfil_acesso.nome,
            unidade: user?.unidade
                .map((unidade) => unidade.nomeUnidade)
                .join(", "),
            perfil: user?.perfil_acesso.nome,
        },
    });

    const handleCancelEdit = () => {
        form.setValue("nome", originalName, { shouldDirty: false });
        form.reset();

        setEditingName(false);
    };

    const handleConfirmEdit = async () => {
        const values = form.getValues();

        const response = await mutateAsync({
            name: values.nome,
        });

        if (response.success) {
            toast({
                variant: "success",
                title: "Tudo certo por aqui!",
                description: "Seu nome foi atualizado.",
            });

            useUserStore.getState().setUser({
                ...user!,
                nome: values.nome,
            });

            setOriginalName(values.nome);
            setEditingName(false);
            form.reset(values);
        } else {
            toast({
                variant: "error",
                title: "Erro ao salvar",
                description: response.error,
            });
        }
    };

    return (
        <div className="w-full md:w-1/2 flex flex-col h-full flex-1">
            <Form {...form}>
                <form
                    className="flex flex-col h-full flex-1"
                    onSubmit={form.handleSubmit(() => {})}
                >
                    <div className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome completo</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                disabled={!editingName}
                                                onFocus={() =>
                                                    setEditingName(true)
                                                }
                                            />
                                        </FormControl>

                                        {editingName ? (
                                            <ConfirmCancelButtons
                                                onCancel={handleCancelEdit}
                                                onConfirm={handleConfirmEdit}
                                                disabled={
                                                    form.watch("nome") ===
                                                        originalName ||
                                                    !!form.formState.errors.nome
                                                }
                                                loading={isPending}
                                            />
                                        ) : (
                                            form.watch("nome") ===
                                                user?.nome && (
                                                <Button
                                                    variant="customOutline"
                                                    type="button"
                                                    className="rounded-[4px]"
                                                    onClick={() =>
                                                        setEditingName(true)
                                                    }
                                                >
                                                    Alterar nome
                                                </Button>
                                            )
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                disabled
                                            />
                                        </FormControl>
                                        <Button
                                            variant="customOutline"
                                            type="button"
                                            className="rounded-[4px]"
                                            onClick={() =>
                                                setOpenModalAlterarEmail(true)
                                            }
                                        >
                                            Alterar e-mail
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="senha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                disabled
                                            />
                                        </FormControl>
                                        <Button
                                            variant="customOutline"
                                            type="button"
                                            className="rounded-[4px]"
                                            onClick={() =>
                                                setOpenModalNovaSenha(true)
                                            }
                                        >
                                            Alterar senha
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cpf"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#dadada] text-[14px] font-bold">
                                        CPF
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            disabled
                                            className="text-[#dadada] bg-[#fff] border border-[#dadada]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#dadada] text-[14px] font-bold">
                                        Diretoria Regional de Educação (DRE)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            disabled
                                            className="text-[#dadada] bg-[#fff] border border-[#dadada]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="unidade"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#dadada] text-[14px] font-bold">
                                        Unidade Educacional
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            disabled
                                            className="text-[#dadada] bg-[#fff] border border-[#dadada]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="perfil"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#dadada] text-[14px] font-bold">
                                        Perfil de acesso
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            disabled
                                            className="text-[#dadada] bg-[#fff] border border-[#dadada]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>

            <ModalNovaSenha
                open={openModalNovaSenha}
                onOpenChange={setOpenModalNovaSenha}
            />

            <ModalAlterarEmail
                open={openModalAlterarEmail}
                onOpenChange={setOpenModalAlterarEmail}
                currentMail={user?.email || ""}
            />
        </div>
    );
};

export default FormDados;
