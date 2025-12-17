"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useExcluirAnexo } from "@/hooks/useExcluirAnexo";
import { toast } from "@/components/ui/headless-toast";

type ModalExcluirEtapaProps = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    uuid: string | null;
    onSuccess?: () => void;
};

export function ModalExcluir({
    open,
    onOpenChange,
    uuid,
    onSuccess,
}: ModalExcluirEtapaProps) {
    const { mutateAsync, isPending } = useExcluirAnexo();

    async function handleExcluir() {
        if (!uuid) return;

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

        onSuccess?.();
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[672px] p-6 rounded-[4px]">
                <DialogHeader className="pt-2">
                    <DialogTitle>Excluir Documento</DialogTitle>
                    <DialogDescription className="sr-only">
                        Excluir documento anexado à intercorrência.
                    </DialogDescription>
                </DialogHeader>

                <p className="mt-6 text-[14px] text-[#42474a]">
                    Tem certeza que deseja excluir o documento em anexo?
                </p>

                <DialogFooter className="mt-6">
                    <Button
                        type="button"
                        variant="customOutline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        size="sm"
                        className="min-w-[160px] text-center rounded-md text-[14px] font-[700] bg-[#717FC7] text-white hover:bg-[#5a65a8]"
                        onClick={handleExcluir}
                        disabled={isPending}
                    >
                        Excluir Documento
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
