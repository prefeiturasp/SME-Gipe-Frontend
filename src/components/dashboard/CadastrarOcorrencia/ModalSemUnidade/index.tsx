"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ModalSemUnidadeProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ModalSemUnidade({
    open,
    onOpenChange,
}: Readonly<ModalSemUnidadeProps>) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-6 rounded-[4px] w-full max-w-[640px]">
                <DialogHeader>
                    <DialogTitle className="text-[#42474A] text-[20px] font-[700]">
                        Não encontramos a sua Unidade Educacional
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="mb-2 text-[#42474A] text-[14px]">
                    Para registrar uma intercorrência, é necessário possuir uma
                    unidade educacional associada ao seu perfil. Entre em
                    contato com o Gabinete da DRE para atualizar seu cadastro.
                </DialogDescription>

                <div className="flex justify-end mt-2">
                    <Button
                        type="button"
                        variant="customOutline"
                        onClick={() => onOpenChange(false)}
                    >
                        Fechar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
