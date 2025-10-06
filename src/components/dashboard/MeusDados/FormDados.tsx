"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import { User, useUserStore } from "@/stores/useUserStore";
import ModalNovaSenha from "./ModalNovaSenha/ModalNovaSenha";
import ModalAlterarEmail from "./ModalAlterarEmail/ModalAlterarEmail";
import FormDadosSkeleton from "./FormDadosSkeleton";

const ProfileForm = ({ user }: { user: User }) => {
    const [openModalNovaSenha, setOpenModalNovaSenha] = useState(false);
    const [openModalAlterarEmail, setOpenModalAlterarEmail] = useState(false);

    const form = useForm<FormDataMeusDados>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: user.name,
            email: user.email,
            senha: "****************",
            cpf: user.cpf,
            dre: user.unidades?.map((unidade) => unidade.dre.nome).join(", "),
            unidade: user.unidades
                ?.map((unidade) => unidade.ue.nome)
                .join(", "),
            perfil: user.perfil_acesso?.nome,
        },
    });

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
                                    <FormLabel className="text-[#dadada] text-[14px] font-bold">
                                        Nome completo
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
                currentMail={user?.email}
            />
        </div>
    );
};
const FormDados: React.FC = () => {
    const user = useUserStore((state) => state.user);

    if (!user) {
        return <FormDadosSkeleton />;
    }

    return <ProfileForm user={user} />;
};

export default FormDados;
