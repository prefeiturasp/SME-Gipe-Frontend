"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import LogoGipe from "@/components/login/LogoGipe";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import Check from "@/assets/icons/Check";
import CloseCheck from "@/assets/icons/CloseCheck";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import useRedefinirSenha from "@/hooks/useRedefinirSenha";

import formSchema, { FormAlterarSenha } from "./schema";
import InputSenhaComValidador from "../FormCadastro/InputSenhaComValidador";
import LogoPrefeituraSP from "../LogoPrefeituraSP";

export default function AlterarSenha({
    code,
    token,
}: {
    readonly code: string;
    readonly token: string;
}) {
    const [returnMessage, setReturnMessage] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    const form = useForm<FormAlterarSenha>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
    });
    const values = form.watch();

    const [confirmPassword, setConfirmPassword] = useState("");
    const { mutateAsync, isPending } = useRedefinirSenha();

    async function handleLogin(values: FormAlterarSenha) {
        setReturnMessage(null);
        const response = await mutateAsync({
            password: values.password,
            uid: code,
            token,
            password2: confirmPassword,
        });

        if (response.success) {
            setReturnMessage({
                success: true,
                message: "Você já pode acessar o GIPE com sua nova senha.",
            });
        } else {
            setReturnMessage({
                success: false,
                message: response.error,
            });
        }
    }

    const passwordCriteria = useMemo(
        () => [
            {
                label: "Ao menos uma letra maiúscula",
                test: (v: string) => /[A-Z]/.test(v),
            },
            {
                label: "Ao menos uma letra minúscula",
                test: (v: string) => /[a-z]/.test(v),
            },
            {
                label: "Entre 8 e 12 caracteres",
                test: (v: string) => v.length >= 8 && v.length <= 12,
            },
            {
                label: "Ao menos um caracter numérico",
                test: (v: string) => /\d/.test(v),
            },
            {
                label: "Ao menos um caracter especial (#@&!?.)",
                test: (v: string) => /[#!@&?.*_]/.test(v),
            },
            {
                label: "Não deve conter espaços em branco",
                test: (v: string) => !/\s/.test(v),
            },
            {
                label: "Não deve conter caracteres acentuados",
                test: (v: string) => !/[À-ÿ]/.test(v),
            },
        ],
        []
    );

    const passwordStatus = passwordCriteria.map((c) =>
        c.test(values.password || "")
    );

    if (returnMessage) {
        return (
            <div className="w-full max-w-sm">
                <div className="flex justify-start mb-6">
                    <LogoGipe />
                </div>

                <h1 className="font-bold text-gray-900 text-[20px]">
                    {returnMessage.success
                        ? "Senha criada com sucesso!"
                        : "O link está expirado!"}
                </h1>
                <Alert
                    className="mt-4"
                    variant={returnMessage.success ? "aviso" : "error"}
                >
                    {returnMessage.success ? (
                        <Check height={20} width={20} />
                    ) : (
                        <CloseCheck height={20} width={20} />
                    )}
                    <AlertDescription>{returnMessage.message}</AlertDescription>
                </Alert>

                <Button asChild variant="submit" className="w-full mt-6">
                    <Link
                        href={returnMessage.success ? "/" : "/recuperar-senha"}
                        replace
                    >
                        {returnMessage.success
                            ? "Acessar agora"
                            : "Solicitar novo link"}
                    </Link>
                </Button>
                {!returnMessage.success && (
                    <Button
                        asChild
                        variant="customOutline"
                        className="w-full mt-2"
                    >
                        <Link href="/">Cancelar</Link>
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
            </div>
        );
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
                    Crie uma nova senha
                </h1>
                <p className="text-sm text-gray-600 mb-10">
                    Esta será sua nova senha de acesso ao GIPE.
                </p>

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <InputSenhaComValidador
                            password={field.value}
                            confirmPassword={confirmPassword}
                            onPasswordChange={(val) => field.onChange(val)}
                            onConfirmPasswordChange={setConfirmPassword}
                            criteria={passwordCriteria}
                            passwordStatus={passwordStatus}
                            confirmError={
                                confirmPassword &&
                                confirmPassword !== field.value
                                    ? "As senhas não coincidem"
                                    : undefined
                            }
                        />
                    )}
                />

                <Button
                    type="submit"
                    variant="secondary"
                    className="w-full text-center rounded-md text-[16px] font-[700] md:h-[45px] inline-block align-middle bg-[#717FC7] text-white hover:bg-[#5a65a8] mt-6"
                    disabled={
                        isPending ||
                        Object.keys(form.formState.errors).length > 0 ||
                        !values.password ||
                        !confirmPassword ||
                        (!!confirmPassword &&
                            confirmPassword !== values.password)
                    }
                    loading={isPending}
                >
                    Salvar senha
                </Button>
                <Button asChild variant="customOutline" className="w-full mt-2">
                    <Link href="/">Cancelar</Link>
                </Button>
            </form>
        </Form>
    );
}
