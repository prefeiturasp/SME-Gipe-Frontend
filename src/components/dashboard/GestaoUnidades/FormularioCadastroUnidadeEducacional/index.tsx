"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { formSchema, FormData } from "./schema";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useUserStore } from "@/stores/useUserStore";
import { useFetchDREs } from "@/hooks/useUnidades";
import { useRouter } from "next/navigation";

const tipoOptions = [
    { label: "ADM", value: "ADM" },
    { label: "DRE", value: "DRE" },
    { label: "IFSP", value: "IFSP" },
    { label: "CMCT", value: "CMCT" },
    { label: "CECI", value: "CECI" },
    { label: "CEI", value: "CEI" },
    { label: "CEMEI", value: "CEMEI" },
    { label: "CIEJA", value: "CIEJA" },
    { label: "EMEBS", value: "EMEBS" },
    { label: "EMEF", value: "EMEF" },
    { label: "EMEFM", value: "EMEFM" },
    { label: "EMEI", value: "EMEI" },
    { label: "CEU", value: "CEU" },
    { label: "CEU CEI", value: "CEU CEI" },
    { label: "CEU EMEF", value: "CEU EMEF" },
    { label: "CEU EMEI", value: "CEU EMEI" },
    { label: "CEU CEMEI", value: "CEU CEMEI" },
    { label: "CEI DIRET", value: "CEI DIRET" },
];

const redeOptions = [
    { label: "Direta", value: "DIRETA" },
    { label: "Indireta", value: "INDIRETA" },
];

export default function FormularioCadastroUnidadeEducacional() {
    const router = useRouter();
    const { isPontoFocal } = useUserPermissions();
    const user = useUserStore((state) => state.user);
    const userDreUuid = user?.unidades?.[0]?.dre?.dre_uuid;
    const { data: dreOptions = [] } = useFetchDREs();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tipo: "",
            nomeUnidadeEducacional: "",
            rede: "",
            codigoEol: "",
            diretoriaRegional: "",
            siglaDre: "",
        },
        mode: "onChange",
    });

    const tipoSelecionado = form.watch("tipo");
    const isDreSelected = tipoSelecionado === "DRE";

    useEffect(() => {
        if (isPontoFocal && userDreUuid) {
            form.setValue("diretoriaRegional", userDreUuid);
        }
    }, [isPontoFocal, userDreUuid, form]);

    const isFormValid = form.formState.isValid;

    const onSubmit = (data: FormData) => {
        console.log("Dados do formulário:", data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h2 className="text-[14px] text-[#42474a] mb-6">
                    Cadastre as informações da Unidade Educacional.
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="tipo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                    Tipo*
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={field.disabled}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tipoOptions.map((tipo) => (
                                                <SelectItem
                                                    key={tipo.value}
                                                    value={tipo.value}
                                                >
                                                    {tipo.label}
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
                        name="nomeUnidadeEducacional"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                    Nome da Unidade Educacional*
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Exemplo: EMEF João da Silva"
                                        className="font-normal"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="rede"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                    Rede*
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
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
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="codigoEol"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                    Código EOL*
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        placeholder="Exemplo: 1234567"
                                        className="font-normal"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {!isDreSelected && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="diretoriaRegional"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                        Diretoria Regional*
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            disabled={isPontoFocal}
                                        >
                                            <SelectTrigger className="w-full">
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
                            name="siglaDre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#42474a] text-[14px] font-[700]">
                                        Sigla da DRE (opcional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Digite..."
                                            className="font-normal"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="customOutline"
                        onClick={() =>
                            router.push(
                                "/dashboard/gestao-unidades-educacionais"
                            )
                        }
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="submit"
                        disabled={!isFormValid}
                    >
                        Cadastrar UE
                    </Button>
                </div>
            </form>
        </Form>
    );
}
