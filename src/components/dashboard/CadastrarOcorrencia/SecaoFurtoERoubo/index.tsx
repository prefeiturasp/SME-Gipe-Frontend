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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultiSelect } from "@/components/ui/multi-select";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useTiposOcorrencia } from "@/hooks/useTiposOcorrencia";
import { useAtualizarSecaoFurtoRoubo } from "@/hooks/useAtualizarSecaoFurtoRoubo";
import { formSchema, SecaoFurtoERouboData } from "./schema";
import { hasFormDataChanged } from "@/lib/formUtils";

export type SecaoFurtoERouboProps = {
    onPrevious: () => void;
    onNext: () => void;
};

export default function SecaoFurtoERoubo({
    onPrevious,
    onNext,
}: Readonly<SecaoFurtoERouboProps>) {
    const {
        formData,
        savedFormData,
        setFormData,
        setSavedFormData,
        ocorrenciaUuid,
    } = useOcorrenciaFormStore();
    const { data: tiposOcorrencia, isLoading: isLoadingTipos } =
        useTiposOcorrencia();
    const { mutate: atualizarSecaoFurtoRoubo } = useAtualizarSecaoFurtoRoubo();

    const tiposOcorrenciaOptions =
        tiposOcorrencia?.map((tipo) => ({
            value: tipo.uuid,
            label: tipo.nome,
        })) || [];

    const form = useForm<SecaoFurtoERouboData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            tiposOcorrencia: formData.tiposOcorrencia || [],
            descricao: formData.descricao || "",
            smartSampa: formData.smartSampa || undefined,
        },
    });

    const { isValid } = form.formState;

    const onSubmit = async (data: SecaoFurtoERouboData) => {
        const currentValues = form.getValues();

        if (ocorrenciaUuid) {
            if (
                !hasFormDataChanged(currentValues, savedFormData, [
                    "tiposOcorrencia",
                ])
            ) {
                onNext();
                return;
            }

            const smartSampaSituacao = data.smartSampa;

            atualizarSecaoFurtoRoubo(
                {
                    uuid: ocorrenciaUuid,
                    body: {
                        tipos_ocorrencia: data.tiposOcorrencia,
                        descricao_ocorrencia: data.descricao,
                        smart_sampa_situacao: smartSampaSituacao,
                    },
                },
                {
                    onSuccess: (response) => {
                        if (!response.success) {
                            toast({
                                title: "Erro ao atualizar seção Furto e Roubo",
                                description: response.error,
                                variant: "error",
                            });
                            return;
                        }

                        setFormData(data);
                        setSavedFormData(data);
                        onNext();
                    },
                    onError: () => {
                        toast({
                            title: "Erro ao atualizar seção Furto e Roubo",
                            description:
                                "Não foi possível atualizar os dados. Tente novamente.",
                            variant: "error",
                        });
                    },
                }
            );
        } else {
            setFormData(data);
            onNext();
        }
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
                                    Se necessário, selecione mais de uma opção
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                        name="smartSampa"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Unidade Educacional é contemplada pelo Smart
                                    Sampa? Se sim, houve dano às câmeras do
                                    sistema?*
                                </FormLabel>
                                <FormControl>
                                    <div className="pt-2">
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value ?? ""}
                                            className="flex flex-col space-y-2"
                                        >
                                            <label className="flex items-center space-x-2">
                                                <RadioGroupItem value="sim_com_dano" />
                                                <span className="text-sm text-[#42474a]">
                                                    Sim e houve dano
                                                </span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <RadioGroupItem value="sim_sem_dano" />
                                                <span className="text-sm text-[#42474a]">
                                                    Sim, mas não houve dano
                                                </span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <RadioGroupItem value="nao_faz_parte" />
                                                <span className="text-sm text-[#42474a]">
                                                    A UE não faz parte do Smart
                                                    Sampa
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
