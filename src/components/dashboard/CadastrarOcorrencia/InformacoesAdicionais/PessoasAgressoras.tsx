import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";
import { InformacoesAdicionaisData } from "./schema";

type PessoasAgressorasProps = Readonly<{
    control: Control<InformacoesAdicionaisData>;
    disabled?: boolean;
}>;

export default function PessoasAgressoras({
    control,
    disabled = false,
}: PessoasAgressorasProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "pessoasAgressoras",
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-sm border border-[#DADADA] p-4 flex flex-col gap-4">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="grid grid-cols-1 gap-4 items-start md:grid-cols-2"
                    >
                        <FormField
                            control={control}
                            name={`pessoasAgressoras.${index}.nome`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel disabled={disabled}>
                                        Qual o nome da pessoa agressora?*
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

                        <div className="flex gap-2 items-start">
                            <FormField
                                control={control}
                                name={`pessoasAgressoras.${index}.idade`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel disabled={disabled}>
                                            Qual a idade da pessoa agressora?*
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

                            {index > 0 && (
                                <Button
                                    type="button"
                                    variant="outlineDestructive"
                                    size="icon"
                                    className="mt-8"
                                    disabled={disabled}
                                    onClick={() => remove(index)}
                                    aria-label="Remover pessoa"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <Button
                    type="button"
                    variant="customOutline"
                    size="sm"
                    disabled={disabled}
                    onClick={() => append({ nome: "", idade: "" })}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar pessoa
                </Button>
            </div>
        </div>
    );
}
