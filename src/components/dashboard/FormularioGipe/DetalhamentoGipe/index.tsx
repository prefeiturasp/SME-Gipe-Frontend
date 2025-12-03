"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import QuadroBranco from "../../QuadroBranco/QuadroBranco";
import Anexos from "../../CadastrarOcorrencia/Anexos";
import { formSchema, FormularioGipeData } from "./schema";
import { RadioForm } from "./RadioForm";
import { TextareaForm } from "./TextareaForm";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useState } from "react";
import ModalFinalizarEtapa from "../../CadastrarOcorrencia/Anexos/ModalFinalizar/ModalFinalizar";
import { useUserStore } from "@/stores/useUserStore";
import { MultiSelect } from "@/components/ui/multi-select";
import { useEnvolvidos } from "@/hooks/useEnvolvidos";
import { useCategoriasDisponiveis } from "@/hooks/useCategoriasDisponiveis";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";

export type DetalhamentoGipeProps = {
    readonly onPrevious?: () => void;
};

export function DetalhamentoGipe({ onPrevious }: DetalhamentoGipeProps) {
    const [openModalFinalizarEtapa, setOpenModalFinalizarEtapa] =
        useState(false);
    const { formData, setFormData } = useOcorrenciaFormStore();
    const user = useUserStore((state) => state.user);

    const { data: envolvidos, isLoading: isLoadingEnvolvidos } =
        useEnvolvidos();
    const { data: categorias, isLoading: isLoadingCategorias } =
        useCategoriasDisponiveis();
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

    const motivacaoOptions = categorias?.motivo_ocorrencia || [];

    const cicloAprendizagemOptions = [
        { value: "educacao_infantil", label: "Educação Infantil" },
        { value: "alfabetizacao", label: "Alfabetização" },
        { value: "interdisciplinar", label: "Interdisciplinar" },
        { value: "autoral", label: "Autoral" },
    ];

    const form = useForm<FormularioGipeData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            envolveArmaOuAtaque: formData.envolveArmaOuAtaque || undefined,
            ameacaRealizada: formData.ameacaRealizada || undefined,
            envolvidosGipe: formData.envolvidosGipe || [],
            motivacaoOcorrenciaGipe: formData.motivacaoOcorrenciaGipe || [],
            tipoOcorrenciaGipe: formData.tipoOcorrenciaGipe || "",
            cicloAprendizagem: formData.cicloAprendizagem || "",
            informacoesInteracoesVirtuais:
                formData.informacoesInteracoesVirtuais || "",
            encaminhamentos: formData.encaminhamentos || "",
        },
    });

    const { isValid } = form.formState;

    return (
        <>
            <Form {...form}>
                <form>
                    <QuadroBranco>
                        <h2 className="text-[20px] font-bold text-[#42474a] mb-2">
                            Continuação da ocorrência
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <RadioForm
                                control={form.control}
                                name="envolveArmaOuAtaque"
                                label="Envolve arma ou ataque?*"
                            />

                            <RadioForm
                                control={form.control}
                                name="ameacaRealizada"
                                label="Ameaça foi realizada de qual maneira?*"
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
                                                placeholder="Selecione os envolvidos"
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
                                                placeholder="Selecione as motivações"
                                                disabled={isLoadingCategorias}
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
                                                    <SelectValue placeholder="Selecione o tipo de ocorrência" />
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
                                                    <SelectValue placeholder="Selecione o ciclo de aprendizagem" />
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
                    <Button type="button" variant="submit" disabled={!isValid}>
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
