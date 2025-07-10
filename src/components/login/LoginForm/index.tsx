"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import LogoPrefeituraSP from "@/components/login/LogoPrefeituraSP";
import LogoGipe from "@/components/login/LogoGipe";

import ClosedEye from "@/assets/icons/CloseEye";
import OpenEye from "@/assets/icons/OpenEye";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input, InputMask } from "@/components/ui/input";
import useLogin from "@/hooks/useLogin";

import formSchema, { FormDataLogin } from "./schema";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const loginMutation = useLogin();
    const { mutateAsync, isPending } = loginMutation;
    const isLoading = isPending;

    const form = useForm<FormDataLogin>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function handleLogin(values: FormDataLogin) {
        setErrorMessage(null);

        try {
            await mutateAsync(values);
        } catch (error) {
            // Acesse diretamente a mensagem do erro
            const message =
                error instanceof Error ? error.message : "Erro ao autenticar";
            setErrorMessage(message);
        }
    }
    return (
        <Form {...form}>
            <form
                className="space-y-4 md:space-y-3"
                onSubmit={form.handleSubmit(handleLogin)}
            >
                <div className="flex justify-center mb-6">
                    <LogoGipe />
                </div>

                <FormField
                    control={form.control}
                    name="username"
                    disabled={isLoading}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="required text-[#42474a] text-[14px] font-[400]">
                                RF ou CPF
                            </FormLabel>
                            <FormControl>
                                <InputMask
                                    {...field}
                                    inputMode="numeric"
                                    placeholder="Digite um RF ou CPF"
                                    maskProps={{
                                        mask: "99999999999",
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="relative">
                    <FormField
                        control={form.control}
                        name="password"
                        disabled={isLoading}
                        render={({ field }) => (
                            <FormItem className="md:col-span-5">
                                <FormLabel className="required text-[#42474a] text-[14px] font-[400]">
                                    Senha
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Digite sua senha"
                                        autoComplete="password"
                                        className="pr-[40px]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <button
                        type="button"
                        aria-label={
                            showPassword ? "Senha visível" : "Senha invisível."
                        }
                        className="text-[#282828] dark:text-white cursor-pointer absolute top-[2.9rem] right-[1rem]"
                        onClick={() => {
                            setShowPassword((prev) => !prev);
                        }}
                    >
                        {showPassword ? <OpenEye /> : <ClosedEye />}
                    </button>
                </div>

                <Button
                    variant="secondary"
                    className="w-full text-center rounded-md text-[16px] font-[700] md:h-[45px] inline-block align-middle bg-[#717FC7] text-white hover:bg-[#5a65a8]"
                    loading={isLoading}
                >
                    Acessar
                </Button>
                <div className="flex justify-center mt-2">
                    <span className="text-[#717FC7] text-sm font-semibold cursor-pointer hover:underline">
                        Esqueci minha senha
                    </span>
                </div>
                {errorMessage && (
                    <div className="text-center border border-[#B40C31] text-[#B40C31] text-[14px] font-bold rounded-[4px] py-2 px-3 mt-2">
                        {errorMessage}
                    </div>
                )}
                <div className="flex justify-center mt-6 py-6">
                    <LogoPrefeituraSP />
                </div>
                <div className="flex flex-col items-center mt-4">
                    <span className="text-gray-700 text-sm font-medium mb-2">
                        Ainda não possui cadastro?
                    </span>
                    <button
                        type="button"
                        className="w-full max-w-xs border border-[#717FC7] bg-white text-[#717FC7] font-bold rounded-md py-2 transition-colors hover:bg-[#f3f4fa] hover:border-[#5a65a8]"
                    >
                        Cadastre-se
                    </button>
                    <span className="text-[#42474a] text-[12px] font-normal mt-3 text-center py-6">
                        - Sistema homologado para navegadores: Google Chrome e
                        Firefox
                    </span>
                </div>
            </form>
        </Form>
    );
}
