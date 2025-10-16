"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/headless-toast";
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
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { formSchema, CadastroOcorrenciaData } from "./schema";
import { useCadastrarOcorrencia } from "@/hooks/useCadastrarOcorrencia";

export type CadastroOcorrenciaProps = {
    onSuccess: () => void;
};

export default function CadastroOcorrencia({
    onSuccess,
}: Readonly<CadastroOcorrenciaProps>) {
    const user = useUserStore((state) => state.user);
    const { mutateAsync, isPending } = useCadastrarOcorrencia();

    const { formData, setFormData, setOcorrenciaUuid } =
        useOcorrenciaFormStore();

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const maxDate = `${yyyy}-${mm}-${dd}`;

    const form = useForm<CadastroOcorrenciaData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            dataOcorrencia: formData.dataOcorrencia || "",
            dre: formData.dre ?? user?.unidades[0]?.dre.codigo_eol ?? undefined,
            unidadeEducacional:
                formData.unidadeEducacional ??
                user?.unidades[0]?.ue.codigo_eol ??
                undefined,
            tipoOcorrencia: formData.tipoOcorrencia || undefined,
        },
    });

    const { isValid } = form.formState;

    const onSubmit = async (data: CadastroOcorrenciaData) => {
        if (formData && Object.keys(formData).length > 0) {
            return onSuccess();
        }
        const dataOcorrencia = new Date(data.dataOcorrencia).toISOString();
        setFormData(data);

        const response = await mutateAsync({
            data_ocorrencia: dataOcorrencia,
            unidade_codigo_eol: data.unidadeEducacional,
            dre_codigo_eol: data.dre,
            sobre_furto_roubo_invasao_depredacao: data.tipoOcorrencia === "Sim",
        });

        if (response.success && response?.data?.uuid) {
            setOcorrenciaUuid(response.data.uuid);
            onSuccess();
        } else {
            toast({
                variant: "error",
                title: "Erro ao cadastrar ocorrência",
                description: response.error,
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6 mt-4"
            >
                <fieldset className="contents">
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
                                        key={field.value}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a DRE" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {user?.unidades[0]?.dre
                                                ?.codigo_eol && (
                                                <SelectItem
                                                    value={
                                                        user.unidades[0].dre
                                                            .codigo_eol
                                                    }
                                                >
                                                    {user.unidades[0].dre.nome}
                                                </SelectItem>
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
                        name="unidadeEducacional"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[#b0b0b0]">
                                    Qual a Unidade Educacional?*
                                </FormLabel>
                                <Select
                                    key={field.value}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a unidade" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {user?.unidades[0]?.ue?.codigo_eol && (
                                            <SelectItem
                                                value={
                                                    user.unidades[0].ue
                                                        .codigo_eol
                                                }
                                            >
                                                {user.unidades[0].ue.nome}
                                            </SelectItem>
                                        )}
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
                                    A ocorrência é sobre furto, roubo, invasão
                                    ou depredação?*
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
                            disabled={!isValid || isPending}
                        >
                            Próximo
                        </Button>
                    </div>
                </fieldset>
            </form>
        </Form>
    );
}
