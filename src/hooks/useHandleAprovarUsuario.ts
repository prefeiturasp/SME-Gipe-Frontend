import { useState } from "react";
import { Usuario } from "@/types/usuarios";
import { useAprovarUsuarioGestao } from "@/hooks/useAprovarUsuarioGestao";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/headless-toast";

export function useHandleAprovarUsuario() {
    const [usuarioParaAprovar, setUsuarioParaAprovar] =
        useState<Usuario | null>(null);
    const { mutateAsync: aprovarUsuario, isPending: isLoadingAprovar } =
        useAprovarUsuarioGestao();
    const queryClient = useQueryClient();

    const handleAprovarPerfil = async () => {
        if (!usuarioParaAprovar) return;

        const result = await aprovarUsuario(usuarioParaAprovar.uuid);

        if (result?.success) {
            toast({
                title: "Tudo certo por aqui!",
                description: "Usuário aprovado com sucesso!",
                variant: "success",
            });
            setUsuarioParaAprovar(null);
            queryClient.invalidateQueries({ queryKey: ["get-usuarios"] });
        } else {
            toast({
                title: "Não conseguimos concluir a ação!",
                description: result?.error || "Erro ao aprovar usuário.",
                variant: "error",
            });
        }
    };

    return {
        usuarioParaAprovar,
        setUsuarioParaAprovar,
        handleAprovarPerfil,
        isLoadingAprovar,
    };
}
