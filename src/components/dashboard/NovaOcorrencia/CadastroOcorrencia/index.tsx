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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserStore } from "@/stores/useUserStore";
import { formSchema, CadastroOcorrenciaData } from "./schema";

export default function CadastroOcorrencia() {
    const user = useUserStore((state) => state.user);

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const maxDate = `${yyyy}-${mm}-${dd}`;

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
                className="flex flex-col gap-6 mt-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        max={maxDate}
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
                                <FormLabel className="text-[#b0b0b0]">
                                    Qual a DRE?*
                                </FormLabel>
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
                            <FormLabel className="text-[#b0b0b0]">
                                Qual a Unidade Educacional?*
                            </FormLabel>
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
                    <Button size="sm" variant="outline" disabled>
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
            </form>
        </Form>
    );
}
