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
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { formSchema, AnexosData } from "./schema";
import { Upload, Trash2, Paperclip } from "lucide-react";
import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useEnviarAnexo } from "@/hooks/useEnviarAnexo";
import { toast } from "@/components/ui/headless-toast";

// Mock data - será substituído quando o backend estiver pronto
const TIPOS_DOCUMENTO = [
    { value: "boletim_ocorrencia", label: "Boletim de ocorrência" },
    {
        value: "registro_ocorrencia_interno",
        label: "Registro de ocorrência interno",
    },
    {
        value: "protocolo_conselho_tutelar",
        label: "Protocolo Conselho Tutelar",
    },
    {
        value: "instrucao_normativa_20_2020",
        label: "Instrução Normativa 20/2020",
    },
    { value: "relatorio_naapa", label: "Relatório do NAAPA" },
    { value: "relatorio_cefai", label: "Relatório do CEFAI" },
    { value: "relatorio_sts", label: "Relatório do STS" },
    { value: "relatorio_cpca", label: "Relatório do CPCA" },
    { value: "oficio_gcm", label: "Ofício Guarda Civil Metropolitana (GCM)" },
    { value: "registro_intercorrencia", label: "Registro de intercorrência" },
    {
        value: "relatorio_supervisao_escolar",
        label: "Relatório da Supervisão Escolar",
    },
];

type AnexoItem = {
    id: string;
    arquivo: File;
    tipoDocumento: string;
    tipoDocumentoLabel: string;
    anexadoPor: string;
    dataHora: string;
    enviado?: boolean;
    enviando?: boolean;
};

export type AnexosProps = {
    onPrevious: () => void;
    onNext: () => void;
};

export default function Anexos({ onPrevious, onNext }: Readonly<AnexosProps>) {
    const { formData, setFormData, ocorrenciaUuid } = useOcorrenciaFormStore();
    const user = useUserStore((state) => state.user);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [anexos, setAnexos] = useState<AnexoItem[]>([]);
    const enviarAnexoMutation = useEnviarAnexo();

    const form = useForm<AnexosData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            tipoDocumento: formData.tipoDocumento || "",
            arquivo: undefined,
        },
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar tamanho do arquivo (máx. 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("O arquivo deve ter no máximo 2MB");
                return;
            }

            // Validar tipo do arquivo
            const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
            if (!allowedTypes.includes(file.type)) {
                alert("Formato não suportado. Use PDF, JPG ou PNG");
                return;
            }

            setSelectedFile(file);
            form.setValue("arquivo", file, { shouldValidate: true });
        }
    };

    const handleAnexarDocumento = async () => {
        if (!ocorrenciaUuid) {
            toast({
                variant: "error",
                title: "Erro ao anexar documento",
                description:
                    "UUID da intercorrência não encontrado. Salve a ocorrência primeiro.",
            });
            return;
        }

        const tipoDocumento = form.getValues("tipoDocumento")!;

        const tipoLabel =
            TIPOS_DOCUMENTO.find((t) => t.value === tipoDocumento)?.label ||
            tipoDocumento;

        const now = new Date();
        const dataHora = `${String(now.getDate()).padStart(2, "0")}/${String(
            now.getMonth() + 1
        ).padStart(2, "0")}/${now.getFullYear()} ${String(
            now.getHours()
        ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        const novoAnexoTemp: AnexoItem = {
            id: `${Date.now()}-${selectedFile!.name}`,
            arquivo: selectedFile!,
            tipoDocumento,
            tipoDocumentoLabel: tipoLabel,
            anexadoPor: user?.name || "Usuário",
            dataHora,
            enviando: true,
        };

        setAnexos([...anexos, novoAnexoTemp]);
        setSelectedFile(null);
        form.reset({
            tipoDocumento: "",
            arquivo: undefined,
        });

        const fileInput = document.getElementById(
            "fileInput"
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }

        const perfilMap: Record<
            string,
            "diretor" | "assistente" | "dre" | "gipe"
        > = {
            "DIRETOR DE ESCOLA": "diretor",
            "ASSISTENTE DE DIRETOR DE ESCOLA": "assistente",
            "PONTO FOCAL DRE": "dre",
            GIPE: "gipe",
        };

        const perfilUsuario =
            (user?.perfil_acesso?.nome && perfilMap[user.perfil_acesso.nome]) ||
            "diretor";

        const response = await enviarAnexoMutation.mutateAsync({
            intercorrencia_uuid: ocorrenciaUuid,
            perfil: perfilUsuario,
            categoria: tipoDocumento,
            arquivo: novoAnexoTemp.arquivo,
        });

        if (response.success) {
            setAnexos((prev) =>
                prev.map((a) =>
                    a.id === novoAnexoTemp.id
                        ? { ...a, enviando: false, enviado: true }
                        : a
                )
            );
            toast({
                variant: "success",
                title: "Anexo enviado com sucesso",
                description: "O documento foi anexado à intercorrência.",
            });
        } else {
            setAnexos((prev) => prev.filter((a) => a.id !== novoAnexoTemp.id));
            toast({
                variant: "error",
                title: "Erro ao anexar documento",
                description: response.error,
            });
        }
    };

    const handleRemoverAnexo = (id: string) => {
        setAnexos(anexos.filter((anexo) => anexo.id !== id));
    };

    const onSubmit = async (data: AnexosData) => {
        setFormData(data);
        onNext();
    };

    return (
        <div className="mt-4">
            <h2 className="text-[#42474a] text-[20px] font-bold mb-2">
                Anexos
            </h2>

            {anexos.length > 0 && (
                <div className="mb-6 pb-8 border-b border-[#DADADA]">
                    <p className="text-[14px] text-[#42474a] mb-5">
                        Estes são os documentos já anexados na ocorrência.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {anexos.map((anexo) => (
                            <div
                                key={anexo.id}
                                className="border border-[#DADADA] rounded-md p-6"
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-[#E8F0FE] rounded-[4px] flex items-center justify-center">
                                            <Paperclip className="w-4 h-4 text-[#717FC7]" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[14px] font-bold text-[#42474a] truncate">
                                            {anexo.arquivo.name}
                                        </h4>
                                        <p className="text-[14px] text-[#86858D] mt-1">
                                            {anexo.tipoDocumentoLabel}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-[12px] text-[#86858D]">
                                                Anexado por: {anexo.anexadoPor}
                                            </p>
                                            <span className="text-[12px] text-[#86858D]">
                                                {anexo.dataHora}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-10 w-full p-0 border border-[#B40C02] text-[#B40C02] font-bold flex items-center justify-center hover:bg-[#B40C02] hover:text-white transition-colors"
                                        onClick={() =>
                                            handleRemoverAnexo(anexo.id)
                                        }
                                        disabled={anexo.enviando}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Excluir arquivo
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2"
                >
                    <fieldset className="contents">
                        <div className="mb-4">
                            <h3 className="text-[14px] font-bold text-[#42474a] mb-1">
                                Anexar novo arquivo
                            </h3>
                            <p className="text-[14px] text-[#42474a]">
                                Selecione e classifique o tipo de arquivo,
                                depois clique em &quot;Anexar documento&quot;
                                para salvá-lo.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <FormField
                                    control={form.control}
                                    name="arquivo"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>
                                                Selecione o arquivo
                                            </FormLabel>
                                            <div className="flex">
                                                <FormControl>
                                                    <Input
                                                        value={
                                                            selectedFile
                                                                ? selectedFile.name
                                                                : ""
                                                        }
                                                        placeholder="Nenhum arquivo selecionado"
                                                        readOnly
                                                        className="cursor-default rounded-r-none border-r-0"
                                                    />
                                                </FormControl>
                                                <input
                                                    type="file"
                                                    id="fileInput"
                                                    className="hidden"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={handleFileSelect}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="submit"
                                                    size="sm"
                                                    className="h-10 whitespace-nowrap rounded-l-none"
                                                    onClick={() =>
                                                        document
                                                            .getElementById(
                                                                "fileInput"
                                                            )
                                                            ?.click()
                                                    }
                                                >
                                                    <Upload className="w-3 h-3 mr-2" />
                                                    Escolher arquivo
                                                </Button>
                                            </div>
                                            <p className="text-[12px] text-[#42474a] mt-1">
                                                Formatos aceitos: PDF, JPG, PNG
                                                (máx. 2MB cada)
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex gap-4">
                                <FormField
                                    control={form.control}
                                    name="tipoDocumento"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>
                                                Tipo do documento
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
                                                    {TIPOS_DOCUMENTO.map(
                                                        (tipo) => (
                                                            <SelectItem
                                                                key={tipo.value}
                                                                value={
                                                                    tipo.value
                                                                }
                                                            >
                                                                {tipo.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {selectedFile && !field.value && (
                                                <p className="text-sm font-medium text-destructive">
                                                    Selecione o tipo de
                                                    documento para anexar
                                                </p>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <div className="flex flex-col mt-8">
                                    <Button
                                        type="button"
                                        variant="customOutline"
                                        size="sm"
                                        className="w-[151px] h-10"
                                        disabled={
                                            !selectedFile ||
                                            !form.getValues("tipoDocumento")
                                        }
                                        onClick={handleAnexarDocumento}
                                    >
                                        Anexar documento
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#F5F5F5] border border-[#DADADA] rounded-md p-4 mt-4">
                            <p className="text-[14px] text-[#42474a]">
                                Para conferir mais detalhes sobre os arquivos
                                suportados,{" "}
                                <button
                                    type="button"
                                    className="font-bold underline"
                                >
                                    clique aqui
                                </button>
                                {"."}
                            </p>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
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
                            <Button size="sm" type="submit" variant="submit">
                                Finalizar
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </Form>
        </div>
    );
}
