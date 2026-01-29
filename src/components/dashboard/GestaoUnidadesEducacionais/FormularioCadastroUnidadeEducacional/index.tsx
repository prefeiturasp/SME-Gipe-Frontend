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
import { useConsultarEolUnidade } from "@/hooks/useConsultarEolUnidade";
import { useGetUnidades } from "@/hooks/useGetUnidades";
import { useObterUnidadeGestao } from "@/hooks/useObterUnidadeGestao";
import { useTiposUnidade } from "@/hooks/useTiposUnidade";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useUserStore } from "@/stores/useUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import MensagemInativacao from "./MensagemInativacao";
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
    const { data: dreOptions = [] } = useGetUnidades(true, undefined, "DRE");
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

    const isActive = unidadeData?.ativa ?? true;
    const dataInativacaoFormatada = unidadeData?.data_inativacao_formatada;
    const responsavelInativacaoNome = unidadeData?.responsavel_inativacao_nome;
    const motivoInativacao = unidadeData?.motivo_inativacao;

    const disabledFields = mode === "edit" || !isActive;

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

    const redeSelecionada = form.watch("rede");
    const tipoSelecionado = form.watch("tipo");

    const filteredTipoOptions = useMemo(() => {
        let opcoesFiltradas = tipoOptions;

        // Remover DRE se for rede INDIRETA ou ponto focal
        if (redeSelecionada === "INDIRETA" || isPontoFocal) {
            opcoesFiltradas = opcoesFiltradas.filter(
                (tipo) => tipo.id !== "DRE",
            );
        }

        return opcoesFiltradas;
    }, [tipoOptions, isPontoFocal, redeSelecionada]);

    useEffect(() => {
        if (mode === "edit") {
            setDadosIniciaisCarregados(false);
            setCarregandoDados(false);
            montagemInicialRef.current = true;
        } else if (mode === "create" && montagemInicialRef.current) {
            montagemInicialRef.current = false;
        }
    }, [mode, unidadeUuid]);

    useEffect(() => {
        if (
            mode === "create" &&
            redeSelecionada &&
            !montagemInicialRef.current
        ) {
            form.setValue("tipo", "");
            form.setValue("codigoEol", "");
            form.setValue("nomeUnidadeEducacional", "");
            form.setValue(
                "diretoriaRegional",
                isPontoFocal && userDreUuid ? userDreUuid : "",
            );
            form.setValue("siglaDre", "");
        }
    }, [redeSelecionada, mode, form, isPontoFocal, userDreUuid]);

    useEffect(() => {
        if (
            mode === "edit" &&
            unidadeData &&
            dreOptions.length > 0 &&
            filteredTipoOptions.length > 0 &&
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
        filteredTipoOptions,
    ]);

    const isDreSelected = tipoSelecionado === "DRE";
    const mostrarCamposAdicionais = redeSelecionada && tipoSelecionado;
    const gridColsFirstRow =
        !isPontoFocal && mostrarCamposAdicionais
            ? "md:grid-cols-3"
            : "md:grid-cols-2";

    const isFormValid = form.formState.isValid;

    const { mutateAsync: cadastrarUnidade, isPending: isPendingCreate } =
        useCadastrarUnidade();
    const { mutateAsync: atualizarUnidade, isPending: isPendingUpdate } =
        useAtualizarUnidade(unidadeUuid || "");
    const { mutateAsync: consultarEolUnidade, isPending: isPendingConsultar } =
        useConsultarEolUnidade();

    const isPending = mode === "edit" ? isPendingUpdate : isPendingCreate;

    const handleConsultarEol = async () => {
        const codigoEol = form.getValues("codigoEol");

        const response = await consultarEolUnidade(codigoEol);

        if (response.success) {
            form.setValue(
                "nomeUnidadeEducacional",
                response.data.nome_unidade,
                { shouldValidate: true },
            );
        } else {
            toast({
                title: "Código EOL inválido!",
                description: response.error,
                variant: "error",
            });
        }
    };

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

                <div className={`grid grid-cols-1 gap-4 ${gridColsFirstRow}`}>
                    <FormField
                        control={form.control}
                        name="rede"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel disabled={disabledFields}>
                                    Tipo*
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={
                                            disabledFields || carregandoDados
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
                        name="tipo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel
                                    disabled={
                                        disabledFields || !redeSelecionada
                                    }
                                >
                                    Etapa/modalidade*
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={
                                            field.disabled ||
                                            carregandoDados ||
                                            disabledFields ||
                                            !redeSelecionada
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredTipoOptions.map((tipo) => (
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
                    {!isPontoFocal && mostrarCamposAdicionais && (
                        <FormField
                            control={form.control}
                            name="codigoEol"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabledFields}>
                                        Código EOL*
                                    </FormLabel>
                                    <div className="flex items-start">
                                        <FormControl>
                                            <Input
                                                disabled={disabledFields}
                                                {...field}
                                                type="text"
                                                placeholder="Exemplo: 123456"
                                                className="font-normal rounded-r-none"
                                                maxLength={6}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            "",
                                                        );
                                                    field.onChange(value);
                                                }}
                                            />
                                        </FormControl>
                                        {redeSelecionada === "DIRETA" &&
                                            mode === "create" && (
                                                <Button
                                                    type="button"
                                                    variant="submit"
                                                    size="sm"
                                                    className="h-10 whitespace-nowrap rounded-l-none border-l-0"
                                                    disabled={
                                                        disabledFields ||
                                                        field.value.length !== 6
                                                    }
                                                    loading={isPendingConsultar}
                                                    onClick={handleConsultarEol}
                                                >
                                                    Consultar
                                                </Button>
                                            )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                {mostrarCamposAdicionais && (
                    <div className={`grid grid-cols-1 gap-4 md:grid-cols-2`}>
                        {isPontoFocal && (
                            <FormField
                                control={form.control}
                                name="codigoEol"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel disabled={disabledFields}>
                                            Código EOL*
                                        </FormLabel>
                                        <div className="flex items-start">
                                            <FormControl>
                                                <Input
                                                    disabled={disabledFields}
                                                    {...field}
                                                    type="text"
                                                    placeholder="Exemplo: 123456"
                                                    className="font-normal rounded-r-none"
                                                    maxLength={6}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                "",
                                                            );
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                            {redeSelecionada === "DIRETA" &&
                                                mode === "create" && (
                                                    <Button
                                                        type="button"
                                                        variant="submit"
                                                        size="sm"
                                                        className="h-10 whitespace-nowrap rounded-l-none border-l-0"
                                                        disabled={
                                                            disabledFields ||
                                                            field.value
                                                                .length !== 6
                                                        }
                                                        loading={
                                                            isPendingConsultar
                                                        }
                                                        onClick={
                                                            handleConsultarEol
                                                        }
                                                    >
                                                        Consultar
                                                    </Button>
                                                )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="nomeUnidadeEducacional"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={!isActive}>
                                        Nome da Unidade Educacional*
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={!isActive}
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

                        {!isDreSelected && !isPontoFocal && (
                            <FormField
                                control={form.control}
                                name="diretoriaRegional"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel disabled={!isActive}>
                                            Diretoria Regional*
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={!isActive}
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
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {isDreSelected && (
                            <FormField
                                control={form.control}
                                name="siglaDre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel disabled={!isActive}>
                                            Sigla da DRE (opcional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={!isActive}
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
                        )}
                    </div>
                )}

                <div className="mt-4">
                    {!isActive && motivoInativacao && (
                        <MensagemInativacao
                            dataInativacaoFormatada={
                                dataInativacaoFormatada ?? ""
                            }
                            responsavelInativacaoNome={
                                responsavelInativacaoNome ?? ""
                            }
                            motivoInativacao={motivoInativacao}
                        />
                    )}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="customOutline"
                        onClick={() =>
                            router.push(
                                "/dashboard/gestao-unidades-educacionais",
                            )
                        }
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="submit"
                        disabled={!isFormValid || isPending || !isActive}
                        loading={isPending}
                    >
                        {mode === "edit" ? "Salvar alterações" : "Cadastrar UE"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
