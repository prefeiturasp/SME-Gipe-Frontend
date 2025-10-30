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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultiSelect } from "@/components/ui/multi-select";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";
import { formSchema, SecaoNaoFurtoERouboData } from "./schema";

export type SecaoNaoFurtoERouboProps = {
    onPrevious: () => void;
    onNext: () => void;
};

export default function SecaoNaoFurtoERoubo({
    onPrevious,
    onNext,
}: Readonly<SecaoNaoFurtoERouboProps>) {
    const { formData, setFormData, ocorrenciaUuid } = useOcorrenciaFormStore();
    const { data: tiposOcorrencia, isLoading: isLoadingTipos } =
        useTiposOcorrencia();

    const tiposOcorrenciaOptions =
        tiposOcorrencia?.map((tipo) => ({
            value: tipo.uuid,
            label: tipo.nome,
        })) || [];

    const envolvidosOptions: { value: string; label: string }[] = [
        { value: "aluno", label: "Aluno" },
        { value: "professor", label: "Professor" },
    ];

    const form = useForm<SecaoNaoFurtoERouboData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            tiposOcorrencia: formData.tiposOcorrencia || [],
            envolvidos: formData.envolvidos || [],
            descricao: formData.descricao || "",
            possuiInfoAgressorVitima:
                formData.possuiInfoAgressorVitima || undefined,
        },
    });

    const { isValid } = form.formState;

    const onSubmit = async (data: SecaoNaoFurtoERouboData) => {
        setFormData(data);
        onNext();
        console.log(
            "Submitted data for ocorrência UUID:",
            ocorrenciaUuid,
            data
        );
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
                            name="tiposOcorrencia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Qual o tipo de ocorrência?*
                                    </FormLabel>

                                    <FormControl>
                                        <MultiSelect
                                            options={tiposOcorrenciaOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Selecione os tipos de ocorrência"
                                            disabled={isLoadingTipos}
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
                            name="envolvidos"
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
                    </div>

                    <FormField
                        control={form.control}
                        name="descricao"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descreva a ocorrência*</FormLabel>
                                <p className="text-sm text-[#42474a] mt-1 mb-2">
                                    se houver informações sobre agressores ou
                                    vítimas, preencher aqui
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

                    <FormField
                        control={form.control}
                        name="possuiInfoAgressorVitima"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Existem informações sobre o agressor e/ou
                                    vítima?*
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
                            variant="outline"
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
