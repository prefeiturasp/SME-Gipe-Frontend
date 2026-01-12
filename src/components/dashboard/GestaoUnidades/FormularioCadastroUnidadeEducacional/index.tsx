"use client";

import { UnidadeCadastroPayload } from "@/actions/cadastrar-unidade";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/headless-toast";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAtualizarUnidade } from "@/hooks/useAtualizarUnidade";
import { useCadastrarUnidade } from "@/hooks/useCadastrarUnidade";
import { useObterUnidadeGestao } from "@/hooks/useObterUnidadeGestao";
import { useTiposUnidade } from "@/hooks/useTiposUnidade";
import { useFetchDREs } from "@/hooks/useUnidades";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useUserStore } from "@/stores/useUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FormData, formSchema } from "./schema";

const redeOptions = [
    { label: "Direta", value: "DIRETA" },
    { label: "Indireta", value: "INDIRETA" },
];

type FormularioCadastroUnidadeEducacionalProps = {
    mode?: "create" | "edit";
    unidadeUuid?: string;
};

export default function FormularioCadastroUnidadeEducacional({
    mode = "create",
    unidadeUuid,
}: Readonly<FormularioCadastroUnidadeEducacionalProps>) {
    const router = useRouter();
    const { isPontoFocal } = useUserPermissions();
    const user = useUserStore((state) => state.user);
    const userDreUuid = user?.unidades?.[0]?.dre?.dre_uuid;
    const { data: dreOptions = [] } = useFetchDREs();
    const { data: tipoOptions = [] } = useTiposUnidade();
    const queryClient = useQueryClient();
    const [dadosIniciaisCarregados, setDadosIniciaisCarregados] =
        useState(false);
    const [carregandoDados, setCarregandoDados] = useState(false);
    const montagemInicialRef = useRef(true);

    const { data: unidadeData } = useObterUnidadeGestao({
        uuid: unidadeUuid || "",
        enabled: mode === "edit" && !!unidadeUuid,
    });

    const defaultValues = useMemo(() => {
        if (mode === "edit" && unidadeData) {
            return {
                tipo: unidadeData.tipo_unidade,
                nomeUnidadeEducacional: unidadeData.nome,
                rede: unidadeData.rede,
                codigoEol: unidadeData.codigo_eol,
                diretoriaRegional: unidadeData.dre_uuid,
                siglaDre: unidadeData.sigla,
            };
        }
        return {
            tipo: "",
            nomeUnidadeEducacional: "",
            rede: "",
            codigoEol: "",
            diretoriaRegional: isPontoFocal && userDreUuid ? userDreUuid : "",
            siglaDre: "",
        };
    }, [isPontoFocal, userDreUuid, mode, unidadeData]);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues,
        mode: "onChange",
    });

    useEffect(() => {
        if (mode === "edit") {
            setDadosIniciaisCarregados(false);
            setCarregandoDados(false);
            montagemInicialRef.current = true;
        }
    }, [mode, unidadeUuid]);

    useEffect(() => {
        if (
            mode === "edit" &&
            unidadeData &&
            dreOptions.length > 0 &&
            tipoOptions.length > 0 &&
            !dadosIniciaisCarregados
        ) {
            setCarregandoDados(true);

            form.reset({
                tipo: unidadeData.tipo_unidade,
                nomeUnidadeEducacional: unidadeData.nome,
                rede: unidadeData.rede,
                codigoEol: unidadeData.codigo_eol,
                diretoriaRegional: unidadeData.dre_uuid,
                siglaDre: unidadeData.sigla,
            });

            setDadosIniciaisCarregados(true);
            setTimeout(() => {
                setCarregandoDados(false);
                montagemInicialRef.current = false;
            }, 200);
        }
    }, [
        mode,
        unidadeData,
        dreOptions,
        tipoOptions,
        form,
        dadosIniciaisCarregados,
        unidadeData?.uuid,
    ]);

    const tipoSelecionado = form.watch("tipo");
    const isDreSelected = tipoSelecionado === "DRE";

    const isFormValid = form.formState.isValid;

    const { mutateAsync: cadastrarUnidade, isPending: isPendingCreate } =
        useCadastrarUnidade();
    const { mutateAsync: atualizarUnidade, isPending: isPendingUpdate } =
        useAtualizarUnidade(unidadeUuid || "");

    const isPending = mode === "edit" ? isPendingUpdate : isPendingCreate;

    const onSubmit = async (data: FormData) => {
        const payload: UnidadeCadastroPayload = {
            nome: data.nomeUnidadeEducacional,
            codigo_eol: data.codigoEol,
            tipo_unidade: data.tipo,
            rede: data.rede,
            sigla: data.siglaDre,
            ativa: true,
            dre: null,
        };
        if (data.tipo !== "DRE") {
            payload.dre = data.diretoriaRegional;
        }

        const response =
            mode === "edit"
                ? await atualizarUnidade(payload)
                : await cadastrarUnidade(payload);

        if (response.success) {
            toast({
                title: "Tudo certo por aqui!",
                description:
                    mode === "edit"
                        ? "As alterações foram salvas com sucesso!"
                        : "A Unidade Educacional foi cadastrada com sucesso.",
                variant: "success",
            });
            if (mode === "edit") {
                queryClient.invalidateQueries({
                    queryKey: ["unidade-gestao", unidadeUuid],
                });
            }
            router.push("/dashboard/gestao-unidades-educacionais");
        } else {
            toast({
                title: "Não conseguimos concluir a ação!",
                description: response.error,
                variant: "error",
            });
        }
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
                                <FormLabel>Tipo*</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={
                                            field.disabled || carregandoDados
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tipoOptions.map((tipo) => (
                                                <SelectItem
                                                    key={tipo.id}
                                                    value={tipo.id}
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
                                <FormLabel>
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
                                <FormLabel disabled={mode === "edit"}>
                                    Rede*
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={
                                            mode === "edit" || carregandoDados
                                        }
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
                                <FormLabel disabled={mode === "edit"}>
                                    Código EOL*
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={mode === "edit"}
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
                                    <FormLabel>Diretoria Regional*</FormLabel>
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
                        disabled={!isFormValid || isPending}
                        loading={isPending}
                    >
                        {mode === "edit" ? "Salvar alterações" : "Cadastrar UE"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
