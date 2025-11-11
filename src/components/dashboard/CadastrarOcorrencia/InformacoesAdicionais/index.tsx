"use client";

import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultiSelect } from "@/components/ui/multi-select";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { formSchema, InformacoesAdicionaisData } from "./schema";
import { Search } from "lucide-react";
import { ESTADOS_BRASILEIROS } from "@/const/estados-brasileiros";

// Mock data - será substituído quando o backend estiver pronto
const MOCK_MOTIVOS = [
    { value: "conflito", label: "Conflito interpessoal" },
    { value: "bullying", label: "Bullying" },
    { value: "violencia_fisica", label: "Violência física" },
    { value: "violencia_verbal", label: "Violência verbal" },
    { value: "discriminacao", label: "Discriminação" },
];

const MOCK_GENEROS = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
    { value: "nao_binario", label: "Não binário" },
    { value: "prefiro_nao_informar", label: "Prefiro não informar" },
];

const MOCK_GRUPOS_ETNICOS = [
    { value: "branco", label: "Branco" },
    { value: "preto", label: "Preto" },
    { value: "pardo", label: "Pardo" },
    { value: "amarelo", label: "Amarelo" },
    { value: "indigena", label: "Indígena" },
];

const MOCK_ETAPAS_ESCOLARES = [
    { value: "educacao_infantil", label: "Educação Infantil" },
    { value: "ensino_fundamental_1", label: "Ensino Fundamental I" },
    { value: "ensino_fundamental_2", label: "Ensino Fundamental II" },
    { value: "ensino_medio", label: "Ensino Médio" },
    { value: "eja", label: "EJA" },
];

const MOCK_FREQUENCIAS = [
    { value: "regular", label: "Regular" },
    { value: "irregular", label: "Irregular" },
    { value: "infrequente", label: "Infrequente" },
];

export type InformacoesAdicionaisProps = {
    onPrevious: () => void;
    onNext: () => void;
};

export default function InformacoesAdicionais({
    onPrevious,
    onNext,
}: Readonly<InformacoesAdicionaisProps>) {
    const { formData, setFormData } = useOcorrenciaFormStore();

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

    const onSubmit = async (data: InformacoesAdicionaisData) => {
        setFormData(data);
        onNext();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6 mt-4"
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

                    <div className="border border-[#DADADA] rounded-md p-6 space-y-3">
                        <h3 className="text-[14px] font-bold text-[#42474a]">
                            Qual o endereço da pessoa agressora?
                        </h3>

                        <div className="flex gap-2 mt-4">
                            <FormField
                                control={form.control}
                                name="cep"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>CEP*</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Digite o CEP..."
                                                {...field}
                                                onChange={(e) =>
                                                    handleCepChange(
                                                        e.target.value
                                                    )
                                                }
                                                maxLength={9}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    variant="customOutline"
                                    size="sm"
                                    className="h-10"
                                >
                                    <Search className="w-4 h-4 mr-2" />
                                    Pesquisar CEP
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="logradouro"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Logradouro*</FormLabel>
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
                                            Número da residência*
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
                                        <FormLabel>Estado*</FormLabel>
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
                                        <FormLabel>Cidade*</FormLabel>
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
                                        <FormLabel>Bairro*</FormLabel>
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
                                            options={MOCK_MOTIVOS}
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
                                            {MOCK_GENEROS.map((genero) => (
                                                <SelectItem
                                                    key={genero.value}
                                                    value={genero.value}
                                                >
                                                    {genero.label}
                                                </SelectItem>
                                            ))}
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
                                            {MOCK_GRUPOS_ETNICOS.map(
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
                                            {MOCK_ETAPAS_ESCOLARES.map(
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
                                            {MOCK_FREQUENCIAS.map(
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
                                            value={field.value ?? ""}
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
                                            value={field.value ?? ""}
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

                    <div className="flex justify-end gap-2">
                        <Button
                            size="sm"
                            variant="customOutline"
                            type="button"
                            onClick={() => {
                                setFormData(form.getValues());
                                onPrevious();
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
                </fieldset>
            </form>
        </Form>
    );
}
