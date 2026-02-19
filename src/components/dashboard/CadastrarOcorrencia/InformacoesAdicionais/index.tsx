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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAtualizarInfoAgressor } from "@/hooks/useAtualizarInfoAgressor";
import { useCategoriasDisponiveis } from "@/hooks/useCategoriasDisponiveis";
import { hasFormDataChanged } from "@/lib/formUtils";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import PessoasAgressoras from "./PessoasAgressoras";
import { formSchema, InformacoesAdicionaisData } from "./schema";

export type InformacoesAdicionaisProps = {
    onPrevious?: () => void;
    onNext?: () => void;
    showButtons?: boolean;
    disabled?: boolean;
};

export type InformacoesAdicionaisRef = {
    getFormData: () => InformacoesAdicionaisData;
    submitForm: () => Promise<boolean>;
    getFormInstance: () => UseFormReturn<InformacoesAdicionaisData>;
};

const InformacoesAdicionais = forwardRef<
    InformacoesAdicionaisRef,
    InformacoesAdicionaisProps
>(({ onPrevious, onNext, showButtons = true, disabled = false }, ref) => {
    const {
        formData,
        savedFormData,
        setFormData,
        setSavedFormData,
        ocorrenciaUuid,
    } = useOcorrenciaFormStore();
    const { data: categoriasDisponiveis } = useCategoriasDisponiveis();
    const { mutate: atualizarInfoAgressor } = useAtualizarInfoAgressor();
    const form = useForm<InformacoesAdicionaisData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            pessoasAgressoras: formData.pessoasAgressoras?.length
                ? formData.pessoasAgressoras
                : [{ nome: "", idade: "" }],
            motivoOcorrencia: formData.motivoOcorrencia ?? [],
            genero: formData.genero ?? "",
            grupoEtnicoRacial: formData.grupoEtnicoRacial ?? "",
            etapaEscolar: formData.etapaEscolar ?? "",
            frequenciaEscolar: formData.frequenciaEscolar ?? "",
            interacaoAmbienteEscolar: formData.interacaoAmbienteEscolar ?? "",
            redesProtecao: formData.redesProtecao ?? "",
            notificadoConselhoTutelar:
                formData.notificadoConselhoTutelar ?? undefined,
            acompanhadoNAAPA: formData.acompanhadoNAAPA ?? undefined,
        },
    });

    const { isValid } = form.formState;

    // Expõe métodos para o componente pai via ref
    useImperativeHandle(ref, () => ({
        getFormData: () => form.getValues(),
        submitForm: async () => {
            const isValid = await form.trigger();
            if (!isValid) return false;

            const data = form.getValues();
            await handleSubmit(data);
            return true;
        },
        getFormInstance: () => form,
    }));

    // Função de submit isolada para ser chamada programaticamente
    const handleSubmit = async (data: InformacoesAdicionaisData) => {
        const currentValues = form.getValues();

        if (ocorrenciaUuid) {
            if (
                !hasFormDataChanged(currentValues, savedFormData, [
                    "pessoasAgressoras",
                    "motivoOcorrencia",
                    "genero",
                    "grupoEtnicoRacial",
                    "etapaEscolar",
                    "frequenciaEscolar",
                    "interacaoAmbienteEscolar",
                    "redesProtecao",
                    "notificadoConselhoTutelar",
                    "acompanhadoNAAPA",
                ])
            ) {
                onNext?.();
                return;
            }

            atualizarInfoAgressor(
                {
                    uuid: ocorrenciaUuid,
                    body: {
                        unidade_codigo_eol: formData.unidadeEducacional || "",
                        dre_codigo_eol: formData.dre || "",
                        pessoas_agressoras: data.pessoasAgressoras.map(
                            (pessoa) => ({
                                nome: pessoa.nome,
                                idade: Number.parseInt(pessoa.idade),
                            }),
                        ),
                        motivacao_ocorrencia: data.motivoOcorrencia,
                        genero_pessoa_agressora: data.genero,
                        grupo_etnico_racial: data.grupoEtnicoRacial,
                        etapa_escolar: data.etapaEscolar,
                        frequencia_escolar: data.frequenciaEscolar,
                        interacao_ambiente_escolar:
                            data.interacaoAmbienteEscolar,
                        redes_protecao_acompanhamento: data.redesProtecao,
                        notificado_conselho_tutelar:
                            data.notificadoConselhoTutelar === "Sim",
                        acompanhado_naapa: data.acompanhadoNAAPA === "Sim",
                    },
                },
                {
                    onSuccess: (response) => {
                        if (!response.success) {
                            toast({
                                title: "Erro ao atualizar informações adicionais",
                                description: response.error,
                                variant: "error",
                            });
                            return;
                        }

                        setFormData(data);
                        setSavedFormData(data);
                        onNext?.();
                    },
                    onError: () => {
                        toast({
                            title: "Erro ao atualizar informações adicionais",
                            description:
                                "Não foi possível atualizar os dados. Tente novamente.",
                            variant: "error",
                        });
                    },
                },
            );
        } else {
            setFormData(data);
            onNext?.();
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-4 mt-4"
            >
                <fieldset className="contents">
                    <PessoasAgressoras
                        control={form.control}
                        disabled={disabled}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="motivoOcorrencia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        O que motivou a ocorrência?*
                                    </FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            disabled={disabled}
                                            options={
                                                categoriasDisponiveis?.motivo_ocorrencia ||
                                                []
                                            }
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Selecione"
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
                            name="genero"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        Qual o gênero?*
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={disabled}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categoriasDisponiveis?.genero.map(
                                                (genero) => (
                                                    <SelectItem
                                                        key={genero.value}
                                                        value={genero.value}
                                                    >
                                                        {genero.label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="grupoEtnicoRacial"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        Qual o grupo étnico-racial?*
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={disabled}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categoriasDisponiveis?.grupo_etnico_racial.map(
                                                (grupo) => (
                                                    <SelectItem
                                                        key={grupo.value}
                                                        value={grupo.value}
                                                    >
                                                        {grupo.label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="etapaEscolar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        Qual a etapa escolar?*
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={disabled}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categoriasDisponiveis?.etapa_escolar.map(
                                                (etapa) => (
                                                    <SelectItem
                                                        key={etapa.value}
                                                        value={etapa.value}
                                                    >
                                                        {etapa.label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="frequenciaEscolar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        Qual a frequência escolar?*
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={disabled}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categoriasDisponiveis?.frequencia_escolar.map(
                                                (frequencia) => (
                                                    <SelectItem
                                                        key={frequencia.value}
                                                        value={frequencia.value}
                                                    >
                                                        {frequencia.label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="interacaoAmbienteEscolar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel disabled={disabled}>
                                    Como é a interação da pessoa agressora no
                                    ambiente escolar?*
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={disabled}
                                        placeholder="Digite aqui..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="redesProtecao"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel disabled={disabled}>
                                    Quais as redes de proteção estão
                                    acompanhando o caso?*
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        disabled={disabled}
                                        placeholder="Digite aqui..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="notificadoConselhoTutelar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel disabled={disabled}>
                                    A ocorrência foi notificada ao Conselho
                                    Tutelar?*
                                </FormLabel>
                                <FormControl>
                                    <div className="pt-2">
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                            disabled={disabled}
                                            className="flex flex-col space-y-2"
                                        >
                                            <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                                <RadioGroupItem value="Sim" />
                                                <span
                                                    className={
                                                        disabled
                                                            ? "text-sm text-[#B0B0B0]"
                                                            : "text-sm text-[#42474a]"
                                                    }
                                                >
                                                    Sim
                                                </span>
                                            </label>
                                            <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                                <RadioGroupItem value="Não" />
                                                <span
                                                    className={
                                                        disabled
                                                            ? "text-sm text-[#B0B0B0]"
                                                            : "text-sm text-[#42474a]"
                                                    }
                                                >
                                                    Não
                                                </span>
                                            </label>
                                        </RadioGroup>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="acompanhadoNAAPA"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel disabled={disabled}>
                                    A ocorrência foi acompanhada pelo NAAPA?*
                                </FormLabel>
                                <FormControl>
                                    <div className="pt-2">
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                            disabled={disabled}
                                            className="flex flex-col space-y-2"
                                        >
                                            <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                                <RadioGroupItem value="Sim" />
                                                <span
                                                    className={
                                                        disabled
                                                            ? "text-sm text-[#B0B0B0]"
                                                            : "text-sm text-[#42474a]"
                                                    }
                                                >
                                                    Sim
                                                </span>
                                            </label>
                                            <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                                <RadioGroupItem value="Não" />
                                                <span
                                                    className={
                                                        disabled
                                                            ? "text-sm text-[#B0B0B0]"
                                                            : "text-sm text-[#42474a]"
                                                    }
                                                >
                                                    Não
                                                </span>
                                            </label>
                                        </RadioGroup>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {showButtons && (
                        <div className="flex justify-end gap-2">
                            <Button
                                size="sm"
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
                                size="sm"
                                type="submit"
                                variant="submit"
                                disabled={!isValid}
                            >
                                Próximo
                            </Button>
                        </div>
                    )}
                </fieldset>
            </form>
        </Form>
    );
});

InformacoesAdicionais.displayName = "InformacoesAdicionais";

export default InformacoesAdicionais;
