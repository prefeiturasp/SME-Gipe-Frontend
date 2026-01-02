"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type ModalInativacaoProps = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
    isReativacao?: boolean;
};

export default function ModalInativacao({
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
    isReativacao = false,
}: Readonly<ModalInativacaoProps>) {
    function handleConfirm() {
        onConfirm();
    }

    const title = isReativacao ? "Reativação de perfil" : "Inativação de perfil";
    const description = isReativacao
        ? "Ao reativar o perfil, a pessoa terá acesso ao GIPE novamente. Tem certeza que deseja continuar?"
        : "Ao inativar o perfil, a pessoa não terá mais acesso ao GIPE. Tem certeza que deseja continuar?";
    const confirmButtonText = isReativacao ? "Reativar perfil" : "Inativar perfil";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-6 rounded-[4px]">
                <DialogHeader>
                    <DialogTitle className="text-[20px] text-[#42474a]">
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    {isReativacao ? "Confirmação de reativação" : "Confirmação de inativação"} de perfil no GIPE
                </DialogDescription>

                <span className="text-[14px] text-[#42474a]">
                    {description}
                </span>

                <DialogFooter className="mt-6">
                    <Button
                        type="button"
                        variant="customOutline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        variant="submit"
                        className="min-w-[86px] text-center rounded-md text-[14px] font-[700]"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        loading={isLoading}
                    >
                        {confirmButtonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
