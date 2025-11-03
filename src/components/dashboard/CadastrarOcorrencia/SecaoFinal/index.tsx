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

export type SecaoFinalProps = {
    onNext: () => void;
    onPrevious: () => void;
};

export default function SecaoFinal({
    onNext,
    onPrevious,
}: Readonly<SecaoFinalProps>) {
    const { formData, setFormData } = useOcorrenciaFormStore();

    const form = useForm<SecaoFinalData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            declarante: formData.declarante || undefined,
            comunicacaoSeguranca: formData.comunicacaoSeguranca || undefined,
            protocoloAcionado: formData.protocoloAcionado || undefined,
        },
    });

    const { isValid } = form.formState;

    const onSubmit = async (data: SecaoFinalData) => {
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
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o declarante" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Gabinete DRE">
                                                Gabinete DRE
                                            </SelectItem>
                                            <SelectItem value="GCM">
                                                GCM
                                            </SelectItem>
                                            <SelectItem value="GIPE">
                                                GIPE
                                            </SelectItem>
                                            <SelectItem value="NAAPA">
                                                NAAPA
                                            </SelectItem>
                                            <SelectItem value="Unidade Educacional">
                                                Unidade Educacional
                                            </SelectItem>
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
