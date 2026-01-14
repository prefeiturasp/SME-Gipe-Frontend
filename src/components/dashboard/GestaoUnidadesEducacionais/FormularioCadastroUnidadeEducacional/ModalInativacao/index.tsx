"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface ModalInativacaoProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onInativar: (motivo: string) => void;
    isLoading?: boolean;
}

export default function ModalInativacao({
    open,
    onOpenChange,
    onInativar,
    isLoading = false,
}: Readonly<ModalInativacaoProps>) {
    const [motivo, setMotivo] = useState("");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-6 rounded-[4px] w-full max-w-[640px]">
                <DialogHeader>
                    <DialogTitle className="text-[#42474A] text-[20px] font-[700]">
                        Inativação de Unidade Educacional
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="mb-2 text-[#42474A] text-[14px]">
                    Ao inativar o perfil da unidade educacional, não será mais
                    possível vincular novas intercorrências a ela e as pessoas
                    dessa UE deixarão de ter acesso ao GIPE. Tem certeza de que
                    deseja continuar?
                </DialogDescription>

                <div className="mb-4">
                    <label
                        htmlFor="motivo"
                        className="text-[#42474A] text-[14px] font-[700] mb-2 block"
                    >
                        Motivo da inativação da UE*
                    </label>
                    <textarea
                        id="motivo"
                        className="h-[80px]flex min-h-[80px] w-full border border-[#dadada] bg-background px-3 py-2 text-sm font-medium ring-0 ring-offset-0 shadow-none outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none focus:bg-[#E8F0FE] focus:border-[#ced4da] disabled:cursor-not-allowed rounded-[4px] resize-none"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Digite aqui..."
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
                        onClick={() => onInativar(motivo)}
                        disabled={isLoading || motivo.trim() === ""}
                        loading={isLoading}
                    >
                        Inativar Unidade Educacional
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
