import { Button } from "@/components/ui/button";
import { Paperclip, Trash2 } from "lucide-react";
import { AnexoAPI } from "@/types/anexo";
import { useExcluirAnexo } from "@/hooks/useExcluirAnexo";
import { toast } from "@/components/ui/headless-toast";

type ListagemAnexosProps = {
    anexosAPI?: AnexoAPI[];
};

export function ListagemAnexos({
    anexosAPI = [],
}: Readonly<ListagemAnexosProps>) {
    const { mutateAsync, isPending } = useExcluirAnexo();

    const formatarDataHora = (dataISO: string) => {
        const data = new Date(dataISO);
        const dia = String(data.getDate()).padStart(2, "0");
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, "0");
        const minutos = String(data.getMinutes()).padStart(2, "0");
        return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    };

    const handleExcluir = async (uuid: string) => {
        const response = await mutateAsync(uuid);

        if (!response.success) {
            toast({
                variant: "error",
                title: "Não conseguimos excluir o arquivo.",
                description: "Por favor, tente novamente.",
            });
            return;
        }

        toast({
            variant: "success",
            title: "Tudo certo por aqui!",
            description: "O documento foi excluído com sucesso!",
        });
    };

    if (anexosAPI.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 pb-8 border-b border-[#DADADA]">
            <p className="text-[14px] text-[#42474a] mb-5">
                Estes são os documentos já anexados na ocorrência.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {anexosAPI.map((anexo) => (
                    <div
                        key={anexo.uuid}
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
                                    {anexo.nome_original}
                                </h4>

                                <p className="text-[14px] text-[#86858D] mt-1">
                                    {anexo.categoria_display}
                                </p>

                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-[12px] text-[#86858D]">
                                        Anexado por: {anexo.usuario_username}
                                    </p>

                                    <span className="text-[12px] text-[#86858D]">
                                        {formatarDataHora(anexo.criado_em)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={isPending}
                                onClick={() => handleExcluir(anexo.uuid)}
                                className="h-10 w-full p-0 border border-[#B40C02] text-[#B40C02] font-bold flex items-center justify-center hover:bg-[#B40C02] hover:text-white transition-colors"
                            >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Excluir arquivo
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
