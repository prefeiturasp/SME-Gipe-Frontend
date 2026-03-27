import type { TipoOcorrenciaAPI } from "@/actions/tipos-ocorrencia";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type ModalTiposOcorrenciaProps = {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly tiposOcorrencia: TipoOcorrenciaAPI[];
};

export function ModalTiposOcorrencia({
    open,
    onOpenChange,
    tiposOcorrencia,
}: ModalTiposOcorrenciaProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-6 rounded-[4px] w-full max-w-[780px]">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-bold text-[#42474a]">
                        Tipos de ocorrência
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription className="text-sm text-[#42474a]">
                    Entenda o que é cada um dos tipos de ocorrências.
                </DialogDescription>

                <div className="flex flex-col gap-4 mt-2 max-h-[60vh] overflow-y-auto pr-1 pb-2">
                    {tiposOcorrencia.map((tipo) => (
                        <div
                            key={tipo.uuid}
                            className="rounded-[4px] p-3 border border-[#DADADA]"
                        >
                            <p className="text-sm font-bold text-[#42474a]">
                                {tipo.nome}:
                            </p>
                            {tipo.descricao && (
                                <p className="text-sm text-[#86858D] mt-1">
                                    {tipo.descricao}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-2">
                    <Button
                        variant="submit"
                        onClick={() => onOpenChange(false)}
                    >
                        Fechar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
