import { useState } from "react";
import { Usuario } from "@/types/usuarios";
import { useRecusarUsuarioGestao } from "@/hooks/useRecusarUsuarioGestao";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/headless-toast";

export function useHandleRecusarUsuario() {
    const [usuarioParaRecusar, setUsuarioParaRecusar] =
        useState<Usuario | null>(null);
    const { mutateAsync: recusarUsuario, isPending: isLoadingRecusar } =
        useRecusarUsuarioGestao();
    const queryClient = useQueryClient();

    const handleRecusarPerfil = async (motivo: string) => {
        if (!usuarioParaRecusar) return;

        const result = await recusarUsuario({
            uuid: usuarioParaRecusar.uuid,
            justificativa: motivo,
        });

        if (result?.success) {
            toast({
                title: "Ação concluída com sucesso!",
                description:
                    "O perfil receberá um e-mail com o motivo da recusa.",
                variant: "success",
            });
            setUsuarioParaRecusar(null);
            queryClient.invalidateQueries({ queryKey: ["get-usuarios"] });
        } else {
            toast({
                title: "Não conseguimos concluir a ação!",
                description: result?.error || "Erro ao recusar usuário.",
                variant: "error",
            });
        }
    };

    return {
        usuarioParaRecusar,
        setUsuarioParaRecusar,
        handleRecusarPerfil,
        isLoadingRecusar,
    };
}
