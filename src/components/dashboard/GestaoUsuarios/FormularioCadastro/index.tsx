"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/Combobox";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useFetchDREs, useFetchUEs } from "@/hooks/useUnidades";
import formSchema, { FormDataCadastroUsuario } from "./schema";

export default function FormularioCadastroPessoaUsuaria() {
    const { data: dreOptions = [] } = useFetchDREs();
    const router = useRouter();

    const form = useForm<FormDataCadastroUsuario>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rede: "",
            cargo: "",
            fullName: "",
            rfOuCpf: "",
            email: "",
            dre: "",
            ue: "",
            isAdmin: false,
        },
        mode: "onChange",
        reValidateMode: "onChange",
    });

    const { isValid } = form.formState;

    const values = form.watch();
    const { data: ueOptions = [] } = useFetchUEs(values.dre);

    useEffect(() => {
        if (values.rede) {
            form.setValue("cargo", "");
            form.setValue("rfOuCpf", "");
        }
    }, [values.rede, form]);

    useEffect(() => {
        if (values.cargo === "gipe") {
            form.setValue("dre", "");
            form.setValue("ue", "");
        } else if (values.cargo === "ponto_focal") {
            form.setValue("ue", "");
        }
    }, [values.cargo, form]);

    const redeOptions = [
        { value: "DIRETA", label: "Direta" },
        { value: "INDIRETA", label: "Indireta" },
    ];

    const getCargoOptions = () => {
        if (values.rede === "INDIRETA") {
            return [
                { value: "diretor", label: "Diretor(a)" },
                { value: "assistente", label: "Assistente de direção" },
            ];
        }
        return [
            { value: "diretor", label: "Diretor(a)" },
            { value: "assistente", label: "Assistente de direção" },
            { value: "ponto_focal", label: "Ponto focal" },
            { value: "gipe", label: "GIPE" },
        ];
    };

    const cargoOptions = getCargoOptions();

    const isRedeSelected = !!values.rede;
    const isDreDisabled = !isRedeSelected || values.cargo === "gipe";
    const isUeDisabled =
        !isRedeSelected ||
        !values.dre ||
        values.cargo === "ponto_focal" ||
        values.cargo === "gipe";
    const isAdminCheckboxDisabled =
        !isRedeSelected ||
        (values.cargo !== "ponto_focal" && values.cargo !== "gipe");

    return (
        <Form {...form}>
            <form className="mt-6">
                <h2 className="text-[14px] text-[#42474a] mb-6">
                    Cadastre as informações da pessoa usuária.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormField
                        control={form.control}
                        name="rede"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                    Rede*
                                </FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className="w-full border-[#DADADA]"
                                            data-testid="select-rede"
                                        >
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {redeOptions.map((rede) => (
                                            <SelectItem
                                                key={rede.value}
                                                value={rede.value}
                                            >
                                                {rede.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cargo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                    Cargo*
                                </FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={!isRedeSelected}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className="w-full disabled:bg-[#F5F5F5] border-[#DADADA] disabled:opacity-100"
                                            data-testid="select-cargo"
                                        >
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {cargoOptions.map((cargo) => (
                                            <SelectItem
                                                key={cargo.value}
                                                value={cargo.value}
                                            >
                                                {cargo.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                    Nome completo*
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Exemplo: Maria Clara Medeiros"
                                        className="font-normal disabled:bg-[#F5F5F5] border-[#DADADA]"
                                        disabled={!isRedeSelected}
                                        data-testid="input-fullName"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="rfOuCpf"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                    RF ou CPF*
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        inputMode="numeric"
                                        placeholder="123.456.789-10"
                                        className="font-normal disabled:bg-[#F5F5F5] border-[#DADADA]"
                                        disabled={!isRedeSelected}
                                        data-testid="input-rfOuCpf"
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
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                    E-mail*
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="Digite o e-mail corporativo"
                                        className="font-normal disabled:bg-[#F5F5F5] border-[#DADADA]"
                                        disabled={!isRedeSelected}
                                        data-testid="input-email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="dre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                    Diretoria Regional*
                                </FormLabel>
                                <FormControl>
                                    <Combobox
                                        data-testid="select-dre"
                                        options={dreOptions.map(
                                            (dre: {
                                                uuid: string;
                                                nome: string;
                                            }) => ({
                                                label: dre.nome,
                                                value: dre.uuid,
                                            })
                                        )}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Digite ou selecione"
                                        disabled={isDreDisabled}
                                        className="disabled:bg-[#F5F5F5] border-[#DADADA] disabled:opacity-100"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                    Unidade Educacional*
                                </FormLabel>
                                <FormControl>
                                    <Combobox
                                        data-testid="select-ue"
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
                                        placeholder="Digite ou selecione"
                                        disabled={isUeDisabled}
                                        className="disabled:bg-[#F5F5F5] border-[#DADADA] disabled:opacity-100"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="mt-6">
                    <FormField
                        control={form.control}
                        name="isAdmin"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isAdminCheckboxDisabled}
                                        data-testid="checkbox-isAdmin"
                                        className="h-[18px] w-[18px] border-2 border-[#B0B0B0]"
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel
                                        className={`text-[14px] font-[700] ${
                                            isAdminCheckboxDisabled
                                                ? "text-[#B0B0B0]"
                                                : "text-[#42474a]"
                                        }`}
                                    >
                                        Atribuir perfil administrador
                                    </FormLabel>
                                    <p
                                        className={`text-[12px] font-normal ${
                                            isAdminCheckboxDisabled
                                                ? "text-[#B0B0B0]"
                                                : "text-[#42474a]"
                                        }`}
                                    >
                                        Opção disponível para usuários que
                                        possuem cargo de Ponto Focal ou GIPE.
                                    </p>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex gap-4 mt-8 justify-end">
                    <Button
                        type="button"
                        variant="customOutline"
                        onClick={() =>
                            router.push("/dashboard/gestao/pessoa-usuaria")
                        }
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="submit"
                        disabled={!isValid}
                        data-testid="button-cadastrar"
                    >
                        Cadastrar pessoa usuária
                    </Button>
                </div>
            </form>
        </Form>
    );
}
