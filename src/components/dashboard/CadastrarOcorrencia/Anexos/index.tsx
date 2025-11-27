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
import { Upload } from "lucide-react";
import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { useEnviarAnexo } from "@/hooks/useEnviarAnexo";
import { toast } from "@/components/ui/headless-toast";
import { useTiposDocumentos } from "@/hooks/useTiposDocumentos";
import ModalTipoArquivos from "./ModalTipoArquivos/ModalTipoArquivos";
import { useObterAnexos } from "@/hooks/useObterAnexos";
import { ListagemAnexos } from "./ListagemAnexos";
import ModalFinalizarEtapa from "./ModalFinalizar/ModalFinalizar";

export type AnexosProps = {
    onPrevious?: () => void;
    onNext?: () => void;
    showButtons?: boolean;
    modoVisualizacao?: boolean
};

export default function Anexos({
    onPrevious,
    onNext,
    showButtons = true,
    modoVisualizacao,
}: Readonly<AnexosProps>) {
    const { formData, setFormData, ocorrenciaUuid } = useOcorrenciaFormStore();
    const user = useUserStore((state) => state.user);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const enviarAnexoMutation = useEnviarAnexo();
    const { data: tiposDocumento = [] } = useTiposDocumentos();
    const [openModalTipos, setOpenModalTipos] = useState(false);
    const [openModalFinalizarEtapa, setOpenModalFinalizarEtapa] =
        useState(false);

    const { data: anexosData, refetch: refetchAnexos } = useObterAnexos({
        intercorrenciaUuid: ocorrenciaUuid ?? "",
    });

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
                toast({
                    variant: "error",
                    title: "Arquivo muito grande",
                    description: "O arquivo deve ter no máximo 2MB.",
                });
                return;
            }

            const allowedTypes = [
                "application/pdf",
                "image/jpeg",
                "image/png",
                "image/jpg",
                "video/mp4",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "text/plain",
            ];

            if (!allowedTypes.includes(file.type)) {
                toast({
                    variant: "error",
                    title: "Formato não suportado",
                    description: "Envie PDF, JPG, PNG, MP4, XLSX, DOC, DOCX ou TXT.",
                });
                return;
            }

            setSelectedFile(file);
            form.setValue("arquivo", file, { shouldValidate: true });
        }
    };

    const perfilMap: Record<string, "diretor" | "assistente" | "dre" | "gipe"> = {
            "DIRETOR DE ESCOLA": "diretor",
            "ASSISTENTE DE DIRETOR DE ESCOLA": "assistente",
            "PONTO FOCAL DRE": "dre",
            GIPE: "gipe",
        };

        const perfilUsuario = (user?.perfil_acesso?.nome && perfilMap[user.perfil_acesso.nome]) || "diretor";

    const handleAnexarDocumento = async () => {
        if (!ocorrenciaUuid) {
            toast({
                variant: "error",
                title: "Não conseguimos anexar o arquivo",
                description:
                    "UUID da intercorrência não encontrado. Salve a ocorrência primeiro.",
            });
            return;
        }

        const tipoDocumento = form.getValues("tipoDocumento")!;

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

        const response = await enviarAnexoMutation.mutateAsync({
            intercorrencia_uuid: ocorrenciaUuid,
            perfil: perfilUsuario,
            categoria: tipoDocumento,
            arquivo: selectedFile!,
        });

        if (response.success) {
            await refetchAnexos();
            toast({
                variant: "success",
                title: "Tudo certo por aqui!",
                description: "O documento foi anexado com sucesso!",
            });
        } else {
            toast({
                variant: "error",
                title: "Não conseguimos anexar o arquivo",
                description: response.error,
            });
        }
    };

    const onSubmit = async (data: AnexosData) => {
        setFormData(data);
        onNext?.();
    };

    return (
        <div className="mt-4">
            <h2 className="text-[#42474a] text-[20px] font-bold mb-2">
                Anexos
            </h2>

            <ListagemAnexos anexosAPI={anexosData?.results} modoVisualizacao={modoVisualizacao} />

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
                                                    accept=".pdf,.jpg,.jpeg,.png,.mp4,.xlsx,.doc,.docx,.txt"
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
                                                Formatos aceitos: PDF, JPG, PNG, MP4, XLSX, DOC, DOCX e TXT
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
                                                    {tiposDocumento.map(
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
                                    onClick={() => setOpenModalTipos(true)}
                                >
                                    clique aqui
                                </button>
                                {"."}
                            </p>
                        </div>

                        {showButtons && (
                            <div className="flex justify-end gap-2 mt-4">
                            <Button
                                size="sm"
                                variant="customOutline"
                                type="button"
                                onClick={() => {
                                    setFormData(form.getValues());
                                        onPrevious?.();
                                }}
                            >
                                Anterior
                            </Button>
                                <Button
                                    size="sm"
                                    type="submit"
                                    variant="submit"
                                    onClick={() =>
                                        setOpenModalFinalizarEtapa(true)
                                    }
                                >
                                Finalizar
                            </Button>
                        </div>
                        )}
                    </fieldset>
                </form>
            </Form>
            <ModalTipoArquivos
                open={openModalTipos}
                onOpenChange={setOpenModalTipos}
            />
            <ModalFinalizarEtapa 
                open={openModalFinalizarEtapa} 
                onOpenChange={setOpenModalFinalizarEtapa}
                perfilUsuario={perfilUsuario}
            />
        </div>
    );
}