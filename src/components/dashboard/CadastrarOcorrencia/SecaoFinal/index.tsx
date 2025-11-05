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
import { formSchema, SecaoFinalData } from "./schema";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useDeclarantes } from "@/hooks/useDeclarantes";
import { useAtualizarSecaoFinal } from "@/hooks/useAtualizarSecaoFinal";
import { toast } from "@/components/ui/headless-toast";

export type SecaoFinalProps = {
    onNext: () => void;
    onPrevious: () => void;
};

export default function SecaoFinal({
    onNext,
    onPrevious,
}: Readonly<SecaoFinalProps>) {
    const {
        formData,
        setFormData,
        ocorrenciaUuid,
        savedFormData,
        setSavedFormData,
    } = useOcorrenciaFormStore();
    const { data: declarantes, isLoading: isLoadingDeclarantes } =
        useDeclarantes();
    const { mutate, isPending } = useAtualizarSecaoFinal();

    const form = useForm<SecaoFinalData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            declarante: formData.declarante || "",
            comunicacaoSeguranca: formData.comunicacaoSeguranca || "",
            protocoloAcionado: formData.protocoloAcionado || "",
        },
    });

    const { isValid } = form.formState;

    const mapFormDataToApi = (data: SecaoFinalData) => {
        const comunicacaoMap: Record<string, string> = {
            "Sim, com a GCM": "sim_gcm",
            "Sim, com a PM": "sim_pm",
            Não: "nao",
        };

        const protocoloMap: Record<string, string> = {
            Ameaça: "ameaca",
            Alerta: "alerta",
            "Apenas para registro/não se aplica": "registro",
        };

        return {
            unidade_codigo_eol: formData.unidadeEducacional || "",
            dre_codigo_eol: formData.dre || "",
            declarante: data.declarante,
            comunicacao_seguranca_publica:
                comunicacaoMap[data.comunicacaoSeguranca],
            protocolo_acionado: protocoloMap[data.protocoloAcionado],
        };
    };

    const hasChanges = () => {
        if (!savedFormData) return true;

        const currentData = form.getValues();
        return (
            currentData.declarante !== savedFormData.declarante ||
            currentData.comunicacaoSeguranca !==
                savedFormData.comunicacaoSeguranca ||
            currentData.protocoloAcionado !== savedFormData.protocoloAcionado
        );
    };

    const onSubmit = async (data: SecaoFinalData) => {
        setFormData(data);

        if (!ocorrenciaUuid || !hasChanges()) {
            onNext();
            return;
        }

        const apiData = mapFormDataToApi(data);

        mutate(
            { uuid: ocorrenciaUuid, body: apiData },
            {
                onSuccess: (response) => {
                    if (response.success) {
                        setSavedFormData(data);
                        onNext();
                    } else {
                        toast({
                            title: "Erro ao atualizar seção final",
                            description: response.error,
                            variant: "error",
                        });
                    }
                },
                onError: () => {
                    toast({
                        title: "Erro ao atualizar seção final",
                        description:
                            "Ocorreu um erro inesperado. Tente novamente.",
                        variant: "error",
                    });
                },
            }
        );
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6 mt-4"
            >
                <fieldset className="contents">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="declarante"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quem é o declarante?</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isLoadingDeclarantes}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o declarante" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {declarantes?.map((declarante) => (
                                                <SelectItem
                                                    key={declarante.uuid}
                                                    value={declarante.uuid}
                                                >
                                                    {declarante.declarante}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="comunicacaoSeguranca"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Houve comunicação com a segurança
                                        pública?
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma opção" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Sim, com a GCM">
                                                Sim, com a GCM
                                            </SelectItem>
                                            <SelectItem value="Sim, com a PM">
                                                Sim, com a PM
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
                            control={form.control}
                            name="protocoloAcionado"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Qual protocolo acionado?
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o protocolo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Ameaça">
                                                Ameaça
                                            </SelectItem>
                                            <SelectItem value="Alerta">
                                                Alerta
                                            </SelectItem>
                                            <SelectItem value="Apenas para registro/não se aplica">
                                                Apenas para registro/não se
                                                aplica
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="p-4 bg-[#F5F5F5] border border-[#DADADA] rounded-md mt-2">
                        <p className="text-[14px] font-bold text-[#42474a] m-0">
                            É possível imprimir uma cópia das respostas depois
                            de enviá-las
                        </p>
                    </div>
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
                            disabled={!isValid || isPending}
                            loading={isPending}
                        >
                            Próximo
                        </Button>
                    </div>
                </fieldset>
            </form>
        </Form>
    );
}
