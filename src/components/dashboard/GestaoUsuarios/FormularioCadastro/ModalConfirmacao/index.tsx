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

type ModalConfirmacaoProps = {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    onConfirm: () => void;
    isLoading?: boolean;
};

export default function ModalConfirmacao({
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
}: Readonly<ModalConfirmacaoProps>) {
    function handleConfirm() {
        onConfirm();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-6 rounded-[4px]">
                <DialogHeader>
                    <DialogTitle className="text-[20px] text-[#42474a]">
                        Cadastro de pessoa usuária
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="sr-only">
                    Confirmação de cadastro de pessoa usuária no CoreSSO
                </DialogDescription>

                <span className="text-[14px] text-[#42474a]">
                    Ao cadastrar a pessoa usuária, o perfil será registrado no
                    CoreSSO. Tem certeza que deseja continuar?
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
                        className="min-w-[86px] text-center rounded-md text-[14px] font-[700] bg-[#717FC7] text-white hover:bg-[#5a65a8]"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        loading={isLoading}
                    >
                        Cadastrar pessoa usuária
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
