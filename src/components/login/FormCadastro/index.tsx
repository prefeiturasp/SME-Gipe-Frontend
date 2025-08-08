"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import LogoGipe from "@/components/login/LogoGipe";
import { Button } from "@/components/ui/button";
import useCadastro from "@/hooks/useCadastro";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input, InputMask } from "@/components/ui/input";
import InputSenhaComValidador from "./InputSenhaComValidador";
import { Combobox } from "@/components/ui/Combobox";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import formSchema, { FormDataSignup } from "./schema";
import Aviso from "./Aviso";
import Finalizado from "./Finalizado";
import { Stepper } from "./Stepper";
import { ArrowLeft } from "lucide-react";
import { useFetchDREs, useFetchUEs } from "@/hooks/useUnidades";

export default function FormCadastro() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [cadastroFinalizado, setCadastroFinalizado] = useState(false);
    const { data: dreOptions = [] } = useFetchDREs();

    const [step, setStep] = useState(1);
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();
    const cadastroMutation = useCadastro();
    const { mutateAsync, isPending } = cadastroMutation;
    const isLoading = isPending;

    const form = useForm<FormDataSignup>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dre: "",
            ue: "",
            fullName: "",
            cpf: "",
            email: "",
            password: "",
        },
        mode: "onChange",
        reValidateMode: "onChange",
    });

    const values = form.watch();

    const { data: ueOptions = [] } = useFetchUEs(values.dre);

    const isStep1Filled =
        values.dre && values.ue && values.fullName && values.cpf;
    const isStep2Filled = values.email && values.password && confirmPassword;

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

    async function tratarCadastro() {
        setErrorMessage(null);

        const response = await mutateAsync(values);

        if (response.success) {
            setCadastroFinalizado(true);
        } else {
            setErrorMessage(response.error);
        }
    }

    if (cadastroFinalizado) {
        return <Finalizado aoConfirmar={() => router.push("/")} />;
    }

    return (
        <Form {...form}>
            <form
                className="w-full max-w-sm"
                onSubmit={form.handleSubmit(tratarCadastro)}
            >
                {step === 2 && (
                    <div className="flex justify-end mb-2">
                        <Button
                            type="button"
                            variant="customOutline"
                            onClick={() => setStep(1)}
                            className="w-[88px] h-[35px] flex items-center justify-center px-2"
                        >
                            <ArrowLeft />
                            <span className="text-[14px]">&nbsp;Voltar</span>
                        </Button>
                    </div>
                )}
                <div className="flex justify-start mb-4">
                    <LogoGipe className="w-48" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Faça o seu cadastro
                </h1>
                <p className="text-sm text-gray-600 mb-10">
                    Preencha os dados para solicitar acesso ao GIPE.
                </p>
                <Aviso>
                    O cadastro de novos usuários é permitido apenas para
                    diretores escolares.
                </Aviso>
                <Stepper
                    currentStep={step}
                    steps={[
                        { label: "Etapa 01", description: "Dados pessoais" },
                        { label: "Etapa 02", description: "Dados de acesso" },
                    ]}
                />
                {step === 1 && (
                    <>
                        <FormField
                            control={form.control}
                            name="dre"
                            render={({ field }) => (
                                <FormItem className="mb-4 mt-4">
                                    <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                        Selecione a DRE
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={field.disabled}
                                        >
                                            <SelectTrigger className="w-full border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#717FC7]">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dreOptions.map(
                                                    (dre: {
                                                        uuid: string;
                                                        nome: string;
                                                    }) => (
                                                        <SelectItem
                                                            key={dre.uuid}
                                                            value={dre.uuid}
                                                        >
                                                            {dre.nome}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ue"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                    <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                        Digite o nome da UE
                                    </FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={ueOptions.map(
                                                (ue: {
                                                    nome: string;
                                                    uuid: string;
                                                }) => ({
                                                    label: ue.nome,
                                                    value: ue.uuid,
                                                })
                                            )}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Exemplo: EMEF João da Silva"
                                            disabled={!values.dre}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                    <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                        Qual o seu nome completo?
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Exemplo: Maria Clara Medeiros"
                                            className="font-normal"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cpf"
                            render={({ field }) => (
                                <FormItem className="mb-10">
                                    <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                        Qual o seu CPF?
                                    </FormLabel>
                                    <FormControl>
                                        <InputMask
                                            {...field}
                                            inputMode="numeric"
                                            placeholder="123.456.789-10"
                                            maskProps={{
                                                mask: "999.999.999-99",
                                            }}
                                            className="font-normal"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full text-center rounded-md text-[16px] font-[700] md:h-[45px] inline-block align-middle bg-[#717FC7] text-white hover:bg-[#5a65a8]"
                            disabled={
                                !isStep1Filled ||
                                Object.keys(form.formState.errors).length > 0
                            }
                            onClick={async () => {
                                const valid = await form.trigger([
                                    "dre",
                                    "ue",
                                    "fullName",
                                    "cpf",
                                ]);
                                if (valid) setStep(2);
                            }}
                        >
                            Avançar
                        </Button>
                        <button
                            type="button"
                            className="w-full border border-[#717FC7] bg-white text-[#717FC7] font-bold rounded-md py-2 transition-colors hover:bg-[#f3f4fa] hover:border-[#5a65a8] mt-2"
                            onClick={() => router.push("/")}
                        >
                            Cancelar
                        </button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="mb-6 mt-8">
                                    <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                        Qual o seu e-mail?
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="Digite o seu e-mail corporativo"
                                            className="font-normal"
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
                                <InputSenhaComValidador
                                    password={field.value}
                                    confirmPassword={confirmPassword}
                                    onPasswordChange={(val) =>
                                        field.onChange(val)
                                    }
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
                            className="w-full text-center rounded-md text-[16px] font-[700] md:h-[45px] inline-block align-middle bg-[#717FC7] text-white hover:bg-[#5a65a8] mt-2"
                            disabled={
                                !isStep2Filled ||
                                isLoading ||
                                Object.keys(form.formState.errors).length > 0 ||
                                (!!confirmPassword &&
                                    confirmPassword !== values.password)
                            }
                            loading={isLoading}
                        >
                            Cadastrar agora
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => router.push("/")}
                        >
                            Cancelar
                        </Button>
                    </>
                )}
                {errorMessage && (
                    <div className="text-center border border-[#B40C31] text-[#B40C31] text-[14px] font-bold rounded-[4px] py-2 px-3 mt-2 max-w-sm w-full mx-auto break-words">
                        {errorMessage}
                    </div>
                )}
            </form>
        </Form>
    );
}
