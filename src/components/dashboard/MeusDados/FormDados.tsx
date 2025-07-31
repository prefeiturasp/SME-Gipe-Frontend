"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
import { useUserStore } from "@/stores/useUserStore";

const FormDados: React.FC = () => {
    const user = useUserStore((state) => state.user);
    const router = useRouter();
    const form = useForm<FormDataMeusDados>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: user?.nome,
            email: user?.email,
            senha: "111111111111",
            cpf: user?.cpf,
            dre: user?.perfil_acesso,
            unidade: user?.unidade,
            perfil: user?.perfil_acesso,
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
                                    <FormLabel>Nome completo</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" />
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
                    <div className="flex justify-end gap-4 mt-8">
                        <Button
                            variant="customOutline"
                            type="button"
                            onClick={() => router.push("/dashboard")}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="submit"
                            type="submit"
                            disabled={!form.formState.isDirty}
                        >
                            Salvar alterações
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default FormDados;
