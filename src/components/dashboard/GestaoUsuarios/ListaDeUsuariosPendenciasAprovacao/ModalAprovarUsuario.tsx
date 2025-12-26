"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";

interface ModalAprovarUsuarioProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAprovar: () => void;
    isLoading?: boolean;
}

export default function ModalAprovarUsuario({
    open,
    onOpenChange,
    onAprovar,
    isLoading = false,
}: Readonly<ModalAprovarUsuarioProps>) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-8 rounded-[4px]">
                <DialogHeader>
                    <DialogTitle>Aprovação de perfil</DialogTitle>
                </DialogHeader>
                <DialogDescription className="mb-6 mt-2 text-[#42474A] text-[15px]">
                    Ao aprovar, o perfil será registrado no CoreSSO. Tem certeza
                    que deseja continuar?
                </DialogDescription>
                <div className="flex justify-end gap-3 mt-6">
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
                        onClick={onAprovar}
                        loading={isLoading}
                    >
                        Aprovar perfil
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
