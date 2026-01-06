"use client";

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
import { MultiSelect } from "@/components/ui/multi-select";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAtualizarOcorrenciaGipe } from "@/hooks/useAtualizarOcorrenciaGipe";
import { useCategoriasDisponiveisGipe } from "@/hooks/useCategoriasDisponiveisGipe";
import { useEnvolvidos } from "@/hooks/useEnvolvidos";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useUserStore } from "@/stores/useUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Anexos from "../../CadastrarOcorrencia/Anexos";
import ModalFinalizarEtapa from "../../CadastrarOcorrencia/Anexos/ModalFinalizar/ModalFinalizar";
import QuadroBranco from "../../QuadroBranco/QuadroBranco";
import { RadioForm } from "./RadioForm";
import { formSchema, FormularioGipeData } from "./schema";
import { TextareaForm } from "./TextareaForm";

export type DetalhamentoGipeProps = {
    readonly onPrevious?: () => void;
};

export function DetalhamentoGipe({ onPrevious }: DetalhamentoGipeProps) {
    const [openModalFinalizarEtapa, setOpenModalFinalizarEtapa] =
        useState(false);
    const { formData, setFormData, ocorrenciaUuid } = useOcorrenciaFormStore();
    const user = useUserStore((state) => state.user);
    const router = useRouter();

    const { mutate: atualizarOcorrenciaGipe } = useAtualizarOcorrenciaGipe();

    const { data: envolvidos, isLoading: isLoadingEnvolvidos } =
        useEnvolvidos();
    const { data: categoriasGipe, isLoading: isLoadingCategoriasGipe } =
        useCategoriasDisponiveisGipe();
    const { data: tiposOcorrencia, isLoading: isLoadingTipos } =
        useTiposOcorrencia();

    const perfilMap: Record<string, "diretor" | "assistente" | "dre" | "gipe"> =
        {
            "DIRETOR DE ESCOLA": "diretor",
            "ASSISTENTE DE DIRETOR DE ESCOLA": "assistente",
            "PONTO FOCAL DRE": "dre",
            GIPE: "gipe",
        };

    const perfilUsuario =
        (user?.perfil_acesso?.nome && perfilMap[user.perfil_acesso.nome]) ||
        "diretor";

    const envolvidosOptions =
        envolvidos?.map((envolvido) => ({
            value: envolvido.uuid,
            label: envolvido.perfil_dos_envolvidos,
        })) || [];

    const envolveArmaOuAtaqueOptions =
        categoriasGipe?.envolve_arma_ou_ataque || [];
    const ameacaRealizadaOptions =
        categoriasGipe?.ameaca_foi_realizada_de_qual_maneira || [];
    const motivacaoOptions = categoriasGipe?.motivo_ocorrencia || [];
    const cicloAprendizagemOptions = categoriasGipe?.ciclo_aprendizagem || [];

    const form = useForm<FormularioGipeData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            envolveArmaOuAtaque: formData.envolveArmaOuAtaque ?? undefined,
            ameacaRealizada: formData.ameacaRealizada ?? undefined,
            envolvidosGipe: formData.envolvidosGipe ?? [],
            motivacaoOcorrenciaGipe: formData.motivacaoOcorrenciaGipe ?? [],
            tipoOcorrenciaGipe: formData.tipoOcorrenciaGipe ?? "",
            cicloAprendizagem: formData.cicloAprendizagem ?? "",
            informacoesInteracoesVirtuais:
                formData.informacoesInteracoesVirtuais ?? "",
            encaminhamentos: formData.encaminhamentos ?? "",
        },
    });

    const { isValid } = form.formState;

    const handleSubmit = async (data: FormularioGipeData) => {
        atualizarOcorrenciaGipe(
            {
                uuid: ocorrenciaUuid!,
                body: {
                    unidade_codigo_eol: formData.unidadeEducacional!,
                    dre_codigo_eol: formData.dre!,
                    envolve_arma_ataque: data.envolveArmaOuAtaque,
                    ameaca_realizada_qual_maneira: data.ameacaRealizada,
                    envolvido: data.envolvidosGipe[0],
                    motivacao_ocorrencia: data.motivacaoOcorrenciaGipe,
                    tipos_ocorrencia: [data.tipoOcorrenciaGipe],
                    qual_ciclo_aprendizagem: data.cicloAprendizagem,
                    info_sobre_interacoes_virtuais_pessoa_agressora:
                        data.informacoesInteracoesVirtuais,
                    encaminhamentos_gipe: data.encaminhamentos,
                },
            },
            {
                onSuccess: (response) => {
                    if (!response.success) {
                        toast({
                            title: "Erro ao atualizar ocorrência GIPE",
                            description: response.error,
                            variant: "error",
                        });
                        return;
                    }
                    const finalizada = formData.status === "finalizada";

                    if (finalizada) {
                        router.push("/dashboard");
                        return;
                    }

                    setOpenModalFinalizarEtapa(true);
                    setFormData(data);
                },
                onError: () => {
                    toast({
                        title: "Erro ao atualizar ocorrência GIPE",
                        description:
                            "Não foi possível atualizar os dados. Tente novamente.",
                        variant: "error",
                    });
                },
            }
        );

        setFormData(data);
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <QuadroBranco>
                        <h2 className="text-[20px] font-bold text-[#42474a] mb-2">
                            Continuação da ocorrência
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <RadioForm
                                control={form.control}
                                name="envolveArmaOuAtaque"
                                label="Envolve arma ou ataque?*"
                                options={envolveArmaOuAtaqueOptions}
                            />

                            <RadioForm
                                control={form.control}
                                name="ameacaRealizada"
                                label="Ameaça foi realizada de qual maneira?*"
                                options={ameacaRealizadaOptions}
                            />
                        </div>
                    </QuadroBranco>

                    <QuadroBranco>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="envolvidosGipe"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Quem são os envolvidos?*
                                        </FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={envolvidosOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Selecione"
                                                disabled={isLoadingEnvolvidos}
                                            />
                                        </FormControl>
                                        <p className="text-[12px] text-[#42474a] mt-1 mb-2">
                                            Se necessário, selecione mais de uma
                                            opção
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="motivacaoOcorrenciaGipe"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            O que motivou a ocorrência?*
                                        </FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={motivacaoOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Selecione"
                                                disabled={
                                                    isLoadingCategoriasGipe
                                                }
                                            />
                                        </FormControl>
                                        <p className="text-[12px] text-[#42474a] mt-1 mb-2">
                                            Se necessário, selecione mais de uma
                                            opção
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tipoOcorrenciaGipe"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Qual o tipo da ocorrência?*
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={isLoadingTipos}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {tiposOcorrencia?.map(
                                                    (tipo) => (
                                                        <SelectItem
                                                            key={tipo.uuid}
                                                            value={tipo.uuid}
                                                        >
                                                            {tipo.nome}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cicloAprendizagem"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Qual o ciclo de aprendizagem?*
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {cicloAprendizagemOptions.map(
                                                    (ciclo) => (
                                                        <SelectItem
                                                            key={ciclo.value}
                                                            value={ciclo.value}
                                                        >
                                                            {ciclo.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </QuadroBranco>

                    <QuadroBranco>
                        <div className="flex flex-col gap-6">
                            <TextareaForm
                                control={form.control}
                                name="informacoesInteracoesVirtuais"
                                label="Existe informações sobre as interações virtuais da pessoa agressora?"
                            />

                            <FormField
                                control={form.control}
                                name="encaminhamentos"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Encaminhamentos*</FormLabel>
                                        <p className="text-sm text-[#42474a] mb-2">
                                            São informações após a análise feita
                                            pelo GIPE.
                                        </p>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descreva aqui..."
                                                className="min-h-[80px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </QuadroBranco>
                </form>
            </Form>

            <QuadroBranco>
                <Anexos showButtons={false} />

                <div className="flex justify-end gap-2">
                    <Button
                        variant="customOutline"
                        type="button"
                        onClick={() => {
                            setFormData(form.getValues());
                            onPrevious?.();
                        }}
                    >
                        Anterior
                    </Button>
                    <Button
                        onClick={() => handleSubmit(form.getValues())}
                        type="submit"
                        variant="submit"
                        disabled={!isValid}
                    >
                        Salvar informações
                    </Button>
                </div>
            </QuadroBranco>

            <ModalFinalizarEtapa
                open={openModalFinalizarEtapa}
                onOpenChange={setOpenModalFinalizarEtapa}
                perfilUsuario={perfilUsuario}
            />
        </>
    );
}
