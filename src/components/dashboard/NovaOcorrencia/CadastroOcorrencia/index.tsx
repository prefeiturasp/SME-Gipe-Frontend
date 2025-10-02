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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/useUserStore";
import { formSchema, CadastroOcorrenciaData } from "./schema";

export default function CadastroOcorrencia() {
    const user = useUserStore((state) => state.user);

    const form = useForm<CadastroOcorrenciaData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            dataOcorrencia: "",
            dre: user?.perfil_acesso.nome,
            unidadeEducacional: user?.unidade[0]?.nomeUnidade,
            tipoOcorrencia: undefined,
        },
    });

    const { isValid } = form.formState;

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(() => {})}
                className="flex flex-col gap-4 mt-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="dataOcorrencia"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Quando a ocorrência aconteceu?*
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        placeholder="dd/mm/aaaa"
                                        {...field}
                                        className="has-calendar"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Qual a DRE?*</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a DRE" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={field.value}>
                                            {field.value}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="unidadeEducacional"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Qual a Unidade Educacional?*</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a unidade" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={field.value}>
                                        {field.value}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tipoOcorrencia"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                A ocorrência é sobre furto, roubo, invasão ou
                                depredação?*
                            </FormLabel>
                            <FormControl>
                                <div className="flex items-center space-x-4 pt-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="Sim"
                                            checked={field.value === "Sim"}
                                            onChange={field.onChange}
                                            name={field.name}
                                            className="form-radio h-4 w-4"
                                        />
                                        <span className="text-sm">Sim</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="Não"
                                            checked={field.value === "Não"}
                                            onChange={field.onChange}
                                            name={field.name}
                                            className="form-radio h-4 w-4"
                                        />
                                        <span className="text-sm">Não</span>
                                    </label>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-4 mt-4">
                    <Button variant="outline" disabled>
                        Anterior
                    </Button>
                    <Button type="submit" variant="submit" disabled={!isValid}>
                        Próximo
                    </Button>
                </div>
            </form>
        </Form>
    );
}
