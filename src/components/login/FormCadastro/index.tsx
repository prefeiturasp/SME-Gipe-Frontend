"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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

const DRE_OPTIONS = [
    "DRE Butantã",
    "DRE Campo Limpo",
    "DRE Capela do Socorro",
    "DRE Freguesia/Brasilândia",
    "DRE Guaianases",
    "DRE Ipiranga",
    "DRE Itaquera",
    "DRE Jaçanã/Tremembé",
    "DRE Penha",
    "DRE Pirituba",
    "DRE Santo Amaro",
    "DRE São Mateus",
    "DRE São Miguel",
];

const UE_OPTIONS = [
    "EMEF João da Silva",
    "EMEI Criança Feliz",
    "EMEF Maria Clara Medeiros",
    "EMEI Pequeno Príncipe",
    "EMEF Paulo Freire",
    "EMEI Mundo Encantado",
    "EMEF Ana Neri",
    "EMEI Jardim das Flores",
    "EMEF José de Anchieta",
    "EMEI Sonho Meu",
];

export default function FormCadastro() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [cadastroFinalizado, setCadastroFinalizado] = useState(false);
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
        },
    });

    const values = form.watch();
    const isFormFilled =
        values.dre &&
        values.ue &&
        values.fullName &&
        values.cpf &&
        values.email;

    async function tratarCadastro() {
        setErrorMessage(null);
        const response = await mutateAsync(values);

        console.log(response);
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
                                        {DRE_OPTIONS.map((dre) => (
                                            <SelectItem key={dre} value={dre}>
                                                {dre}
                                            </SelectItem>
                                        ))}
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
                                    options={UE_OPTIONS.map((ue) => ({
                                        label: ue,
                                        value: ue,
                                    }))}
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
                        <FormItem className="mb-4">
                            <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                Qual o seu CPF?
                            </FormLabel>
                            <FormControl>
                                <InputMask
                                    {...field}
                                    inputMode="numeric"
                                    placeholder="123.456.789-10"
                                    maskProps={{ mask: "999.999.999-99" }}
                                    className="font-normal"
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
                        <FormItem className="mb-10">
                            <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                Qual o seu e-mail?
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="nome.sobrenome@sme.prefeitura.sp.gov.br"
                                    className="font-normal"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    variant="secondary"
                    className="w-full text-center rounded-md text-[16px] font-[700] md:h-[45px] inline-block align-middle bg-[#717FC7] text-white hover:bg-[#5a65a8]"
                    disabled={!isFormFilled}
                    loading={isLoading}
                >
                    Cadastrar agora
                </Button>
                <button
                    type="button"
                    className="w-full border border-[#717FC7] bg-white text-[#717FC7] font-bold rounded-md py-2 transition-colors hover:bg-[#f3f4fa] hover:border-[#5a65a8] mt-2"
                    onClick={() => router.push("/")}
                >
                    Cancelar
                </button>

                {errorMessage && (
                    <div className="text-center border border-[#B40C31] text-[#B40C31] text-[14px] font-bold rounded-[4px] py-2 px-3 mt-2 max-w-sm w-full mx-auto break-words">
                        {errorMessage}
                    </div>
                )}
            </form>
        </Form>
    );
}
