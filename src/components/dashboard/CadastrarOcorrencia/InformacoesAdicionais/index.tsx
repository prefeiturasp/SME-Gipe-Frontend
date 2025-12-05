"use client";
import { forwardRef, useImperativeHandle } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/headless-toast";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultiSelect } from "@/components/ui/multi-select";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { formSchema, InformacoesAdicionaisData } from "./schema";
import { Search } from "lucide-react";
import { ESTADOS_BRASILEIROS } from "@/const/estados-brasileiros";
import { useCategoriasDisponiveis } from "@/hooks/useCategoriasDisponiveis";
import { useAtualizarInfoAgressor } from "@/hooks/useAtualizarInfoAgressor";
import { hasFormDataChanged } from "@/lib/formUtils";
import { useEnderecoPorCep } from "@/hooks/useEnderecoViaCep";

export type InformacoesAdicionaisProps = {
    onPrevious?: () => void;
    onNext?: () => void;
    showButtons?: boolean;
};

export type InformacoesAdicionaisRef = {
    getFormData: () => InformacoesAdicionaisData;
    submitForm: () => Promise<boolean>;
    getFormInstance: () => UseFormReturn<InformacoesAdicionaisData>;
};

const InformacoesAdicionais = forwardRef<
    InformacoesAdicionaisRef,
    InformacoesAdicionaisProps
>(({ onPrevious, onNext, showButtons = true }, ref) => {
    const {
        formData,
        savedFormData,
        setFormData,
        setSavedFormData,
        ocorrenciaUuid,
    } = useOcorrenciaFormStore();
    const { data: categoriasDisponiveis } = useCategoriasDisponiveis();
    const { mutate: atualizarInfoAgressor } = useAtualizarInfoAgressor();
    const { mutateAsync: buscarCep, isPending } = useEnderecoPorCep();
    const form = useForm<InformacoesAdicionaisData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            nomeAgressor: formData.nomeAgressor || "",
            idadeAgressor: formData.idadeAgressor || "",
            cep: formData.cep || "",
            logradouro: formData.logradouro || "",
            numero: formData.numero || "",
            complemento: formData.complemento || "",
            estado: formData.estado || "",
            cidade: formData.cidade || "",
            bairro: formData.bairro || "",
            motivoOcorrencia: formData.motivoOcorrencia || [],
            genero: formData.genero || "",
            grupoEtnicoRacial: formData.grupoEtnicoRacial || "",
            etapaEscolar: formData.etapaEscolar || "",
            frequenciaEscolar: formData.frequenciaEscolar || "",
            interacaoAmbienteEscolar: formData.interacaoAmbienteEscolar || "",
            redesProtecao: formData.redesProtecao || "",
            notificadoConselhoTutelar:
                formData.notificadoConselhoTutelar || undefined,
            acompanhadoNAAPA: formData.acompanhadoNAAPA || undefined,
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

    const formatCep = (value: string) => {
        const numbers = value.replaceAll(/\D/g, "");
        if (numbers.length <= 5) {
            return numbers;
        }
        return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
    };

    const handleCepChange = (value: string) => {
        const formatted = formatCep(value);
        form.setValue("cep", formatted, { shouldValidate: true });
    };

    // Função de submit isolada para ser chamada programaticamente
    const handleSubmit = async (data: InformacoesAdicionaisData) => {
        const currentValues = form.getValues();

        if (ocorrenciaUuid) {
            if (
                !hasFormDataChanged(currentValues, savedFormData, [
                    "nomeAgressor",
                    "idadeAgressor",
                    "cep",
                    "logradouro",
                    "numero",
                    "complemento",
                    "estado",
                    "cidade",
                    "bairro",
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
                        nome_pessoa_agressora: data.nomeAgressor,
                        idade_pessoa_agressora: Number.parseInt(
                            data.idadeAgressor
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
                        cep: data.cep,
                        logradouro: data.logradouro,
                        numero_residencia: data.numero,
                        complemento: data.complemento || "",
                        bairro: data.bairro,
                        cidade: data.cidade,
                        estado: data.estado,
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
                }
            );
        } else {
            setFormData(data);
            onNext?.();
        }
    };

    const handleBuscarCep = async () => {
        const cep = form.getValues("cep");
        try {
            const endereco = await buscarCep(cep);
            form.setValue("logradouro", endereco.logradouro);
            form.setValue("bairro", endereco.bairro);
            form.setValue("cidade", endereco.cidade);
            form.setValue("estado", endereco.estado);
        } catch (err) {
            const mensagemErro = err instanceof Error ? err.message : "";

            if (mensagemErro.includes("CEP")) {
                toast({
                    variant: "error",
                    title: "Número de CEP inválido!",
                    description: "Verifique o número e tente novamente.",
                });
            } else {
                toast({
                    variant: "error",
                    title: "Houve um erro...",
                    description:
                        "Não conseguimos buscar o CEP. Por favor, tente novamente.",
                });
            }
        }
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-4 mt-4"
            >
                <fieldset className="contents">
                    <FormField
                        control={form.control}
                        name="nomeAgressor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Qual o nome da pessoa agressora?*
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Digite aqui..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="idadeAgressor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Qual a idade da pessoa agressora?*
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Digite aqui..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="border border-[#DADADA] rounded-md p-6 space-y-3 my-3">
                        <h3 className="text-[14px] font-bold text-[#42474a]">
                            Qual o endereço da pessoa agressora?
                        </h3>

                        <div className="flex gap-2 mt-4 items-start">
                            <FormField
                                control={form.control}
                                name="cep"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>CEP*</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Digite o CEP..."
                                                    {...field}
                                                    onChange={(e) =>
                                                        handleCepChange(
                                                            e.target.value
                                                        )
                                                    }
                                                    maxLength={9}
                                                    className="pr-10"
                                                />
                                                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#717FC7] pointer-events-none" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="customOutline"
                                size="sm"
                                className="h-10 mt-8"
                                onClick={handleBuscarCep}
                                disabled={isPending}
                            >
                                {isPending ? "Buscando..." : "Pesquisar CEP"}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="logradouro"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Logradouro</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Digite o logradouro..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="numero"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Número da residência
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Digite o número..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="complemento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Complemento</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Digite o complemento..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="estado"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
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
                                                {ESTADOS_BRASILEIROS.map(
                                                    (estado) => (
                                                        <SelectItem
                                                            key={estado.sigla}
                                                            value={estado.sigla}
                                                        >
                                                            {estado.nome}
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
                                name="cidade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cidade</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Digite a cidade..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bairro"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bairro</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Digite o bairro..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="motivoOcorrencia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        O que motivou a ocorrência?*
                                    </FormLabel>
                                    <FormControl>
                                        <MultiSelect
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
                                    <FormLabel>Qual o gênero?*</FormLabel>
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
                                            {categoriasDisponiveis?.genero.map(
                                                (genero) => (
                                                    <SelectItem
                                                        key={genero.value}
                                                        value={genero.value}
                                                    >
                                                        {genero.label}
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="grupoEtnicoRacial"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Qual o grupo étnico-racial?*
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
                                            {categoriasDisponiveis?.grupo_etnico_racial.map(
                                                (grupo) => (
                                                    <SelectItem
                                                        key={grupo.value}
                                                        value={grupo.value}
                                                    >
                                                        {grupo.label}
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
                            name="etapaEscolar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Qual a etapa escolar?*
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
                                            {categoriasDisponiveis?.etapa_escolar.map(
                                                (etapa) => (
                                                    <SelectItem
                                                        key={etapa.value}
                                                        value={etapa.value}
                                                    >
                                                        {etapa.label}
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
                            name="frequenciaEscolar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Qual a frequência escolar?*
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
                                            {categoriasDisponiveis?.frequencia_escolar.map(
                                                (frequencia) => (
                                                    <SelectItem
                                                        key={frequencia.value}
                                                        value={frequencia.value}
                                                    >
                                                        {frequencia.label}
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

                    <FormField
                        control={form.control}
                        name="interacaoAmbienteEscolar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Como é a interação da pessoa agressora no
                                    ambiente escolar?*
                                </FormLabel>
                                <FormControl>
                                    <Textarea
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
                                <FormLabel>
                                    Quais as redes de proteção estão
                                    acompanhando o caso?*
                                </FormLabel>
                                <FormControl>
                                    <Textarea
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
                                <FormLabel>
                                    A ocorrência foi notificada ao Conselho
                                    Tutelar?*
                                </FormLabel>
                                <FormControl>
                                    <div className="pt-2">
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                            className="flex flex-col space-y-2"
                                        >
                                            <label className="flex items-center space-x-2">
                                                <RadioGroupItem value="Sim" />
                                                <span className="text-sm text-[#42474a]">
                                                    Sim
                                                </span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <RadioGroupItem value="Não" />
                                                <span className="text-sm text-[#42474a]">
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
                                <FormLabel>
                                    A ocorrência foi acompanhada pelo NAAPA?*
                                </FormLabel>
                                <FormControl>
                                    <div className="pt-2">
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                            className="flex flex-col space-y-2"
                                        >
                                            <label className="flex items-center space-x-2">
                                                <RadioGroupItem value="Sim" />
                                                <span className="text-sm text-[#42474a]">
                                                    Sim
                                                </span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <RadioGroupItem value="Não" />
                                                <span className="text-sm text-[#42474a]">
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
