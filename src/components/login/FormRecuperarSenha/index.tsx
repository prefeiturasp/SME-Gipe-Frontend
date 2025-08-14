"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import LogoPrefeituraSP from "@/components/login/LogoPrefeituraSP";
import LogoGipe from "@/components/login/LogoGipe";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Check from "@/assets/icons/Check";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { InputMask } from "@/components/ui/input";

import formSchema, { FormRecuperarSenha } from "./schema";

export default function LoginForm() {
    const [returnMessage, setReturnMessage] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    const form = useForm<FormRecuperarSenha>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    async function handleLogin(values: FormRecuperarSenha) {
        setIsLoading(false);
        console.log(values);
        setReturnMessage({
            success: true,
            message: `Seu link de recuperação de senha foi enviado para ama***********@prefeitura.sme.gov.br
            Verifique sua caixa de entrada ou lixo eletrônico!`,
        });
    }

    return (
        <Form {...form}>
            <form
                className="w-full max-w-sm"
                onSubmit={form.handleSubmit(handleLogin)}
            >
                <div className="flex justify-start mb-6">
                    <LogoGipe />
                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                    Recuperação de senha
                </h1>
                {!returnMessage ? (
                    <>
                        <p className="text-sm text-gray-600 mb-10">
                            Informe o seu usuário ou RF. Você receberá um e-mail
                            com orientações para redefinir sua senha.
                        </p>

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
                    </>
                ) : (
                    <Alert className="mt-4">
                        <Check height={20} width={20} />
                        <AlertDescription>
                            {returnMessage.message}
                        </AlertDescription>
                    </Alert>
                )}

                {!returnMessage ? (
                    <>
                        <Button
                            type="submit"
                            variant="secondary"
                            className="w-full text-center rounded-md text-[16px] font-[700] md:h-[45px] inline-block align-middle bg-[#717FC7] text-white hover:bg-[#5a65a8] mt-6"
                            disabled={false}
                            loading={isLoading}
                        >
                            Continuar
                        </Button>
                        <Button
                            type="button"
                            variant="customOutline"
                            className="w-full mt-2"
                            onClick={() => router.push("/")}
                        >
                            Voltar
                        </Button>
                    </>
                ) : (
                    <Button
                        type="button"
                        className="w-full text-center rounded-md text-[16px] font-[700] md:h-[45px] inline-block align-middle bg-[#717FC7] text-white hover:bg-[#5a65a8] mt-6"
                        variant="secondary"
                        onClick={() => router.push("/")}
                    >
                        Continuar
                    </Button>
                )}
                <div className="flex justify-center mt-4 py-2">
                    <LogoPrefeituraSP />
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[#42474a] text-[12px] font-normal mt-3 text-center py-6">
                        - Sistema homologado para navegadores: Google Chrome e
                        Firefox
                    </span>
                </div>
            </form>
        </Form>
    );
}
