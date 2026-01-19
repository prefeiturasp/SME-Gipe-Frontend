"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

interface ModalRecusarUsuarioProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRecusar: (motivo: string) => void;
    isLoading?: boolean;
}

export default function ModalRecusarUsuario({
    open,
    onOpenChange,
    onRecusar,
    isLoading = false,
}: Readonly<ModalRecusarUsuarioProps>) {
    const [motivo, setMotivo] = useState("");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-6 rounded-[4px] w-full max-w-[640px]">
                <DialogHeader>
                    <DialogTitle className="text-[#42474A] text-[20px] font-[700]">
                        Recusar solicitação
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="mb-2 text-[#42474A] text-[14px]">
                    Ao recusar a solicitação, a ação não poderá ser desfeita e a
                    pessoa não terá acesso ao GIPE. Tem certeza que deseja
                    continuar?
                </DialogDescription>

                <div className="mb-4">
                    <label
                        htmlFor="motivo"
                        className="text-[#42474A] text-[14px] font-[700] mb-2 block"
                    >
                        Motivo da recusa*
                    </label>
                    <textarea
                        id="motivo"
                        className="h-[80px]flex min-h-[80px] w-full border border-[#dadada] bg-background px-3 py-2 text-sm font-medium ring-0 ring-offset-0 shadow-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none focus:bg-[#E8F0FE] focus:border-[#ced4da] disabled:cursor-not-allowed rounded-[4px] resize-none"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Descreva o motivo da recusa"
                        required
                    />
                </div>

                <div className="flex justify-end gap-3 mt-2">
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
                        onClick={() => onRecusar(motivo)}
                        disabled={isLoading || motivo.trim() === ""}
                        loading={isLoading}
                    >
                        Recusar perfil
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
