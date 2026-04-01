import { CategoriasDisponiveisAPI } from "@/actions/categorias-disponiveis";
import InfoTooltip from "@/components/login/InfoTooltip";
import { Button } from "@/components/ui/button";
import {
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
import { Plus, Trash2 } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";
import { InformacoesAdicionaisData } from "./schema";

type EnvolvidosProps = Readonly<{
    control: Control<InformacoesAdicionaisData>;
    disabled?: boolean;
    categoriasDisponiveis?: CategoriasDisponiveisAPI;
}>;

const EMPTY_PESSOA = {
    nome: "",
    idade: "",
    genero: "",
    grupoEtnicoRacial: "",
    etapaEscolar: "",
    frequenciaEscolar: "",
    interacaoAmbienteEscolar: "",
    nacionalidade: "",
    pessoaComDeficiencia: "",
};

export default function Envolvidos({
    control,
    disabled = false,
    categoriasDisponiveis,
}: EnvolvidosProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "pessoasAgressoras",
    });

    return (
        <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="rounded-sm border bg-[#F5F6F8] p-4 flex flex-col gap-4"
                >
                    <div className="grid grid-cols-1 gap-4 items-start md:grid-cols-3">
                        <FormField
                            control={control}
                            name={`pessoasAgressoras.${index}.nome`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        Qual o nome da pessoa?*
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={disabled}
                                            placeholder="Digite aqui..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`pessoasAgressoras.${index}.idade`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        Qual a idade?*
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={disabled}
                                            type="number"
                                            placeholder="Digite aqui..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`pessoasAgressoras.${index}.genero`}
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

                    <div className="grid grid-cols-1 gap-4 items-start md:grid-cols-3">
                        <FormField
                            control={control}
                            name={`pessoasAgressoras.${index}.grupoEtnicoRacial`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        Raça/cor auto declarada*
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
                            control={control}
                            name={`pessoasAgressoras.${index}.etapaEscolar`}
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
                            control={control}
                            name={`pessoasAgressoras.${index}.frequenciaEscolar`}
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

                    <div className="grid grid-cols-1 gap-4 items-start md:grid-cols-3">
                        <FormField
                            control={control}
                            name={`pessoasAgressoras.${index}.pessoaComDeficiencia`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        Pessoa com deficiência?*
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
                                            <SelectItem value="Sim">
                                                Sim
                                            </SelectItem>
                                            <SelectItem value="Não">
                                                Não
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`pessoasAgressoras.${index}.nacionalidade`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        <span className="flex items-center gap-1">
                                            Nacionalidade*
                                            <InfoTooltip content="A nacionalidade se refere ao país ao qual a pessoa pertence." />
                                        </span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={disabled}
                                            placeholder="Digite a nacionalidade..."
                                            maxLength={100}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={control}
                        name={`pessoasAgressoras.${index}.interacaoAmbienteEscolar`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel disabled={disabled}>
                                    Como é a interação da pessoa no ambiente
                                    escolar?*
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

                    {index > 0 && (
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="outlineDestructive"
                                size="sm"
                                disabled={disabled}
                                onClick={() => remove(index)}
                                aria-label="Remover pessoa"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remover pessoa
                            </Button>
                        </div>
                    )}
                </div>
            ))}

            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="customOutline"
                    size="sm"
                    disabled={disabled}
                    onClick={() => append(EMPTY_PESSOA)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar pessoa
                </Button>
            </div>
        </div>
    );
}
