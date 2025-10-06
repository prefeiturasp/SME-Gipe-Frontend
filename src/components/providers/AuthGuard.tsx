"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import useMe from "@/hooks/useMe";
import { useUserStore } from "@/stores/useUserStore";
import FullPageLoader from "@/components/ui/FullPageLoader";

/**
 * Este componente atua como um "portão" para rotas autenticadas.
 * 1. Inicia a busca dos dados do usuário.
 * 2. Exibe um loader em tela cheia enquanto os dados estão sendo carregados.
 * 3. Se houver um erro de autenticação, redireciona para o login.
 * 4. Apenas renderiza os componentes filhos (`children`) quando o usuário está autenticado e os dados estão prontos.
 */
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { clearUser } = useUserStore();
    const { isLoading, isError, error, data } = useMe();

    useEffect(() => {
        if (isError) {
            console.error("Erro de autenticação:", error);
            // Limpa qualquer estado local residual
            clearUser();
            queryClient.removeQueries({ queryKey: ["me"] });
            // Redireciona para o login
            router.push("/login");
        }
    }, [isError, error, router, clearUser, queryClient]);

    // Enquanto carrega, exibe um loader em tela cheia.
    // Isso evita que as páginas internas precisem ter seus próprios skeletons para o usuário.
    if (isLoading || !data) {
        return <FullPageLoader />; // Ex: um spinner centralizado na tela
    }

    // Se passou pelo carregamento e não deu erro, os dados existem.
    // Renderiza a página real.
    return <>{children}</>;
};

export default AuthGuard;
