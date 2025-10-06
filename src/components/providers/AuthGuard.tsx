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
    const { user, clearUser } = useUserStore();
    const { isLoading, isError, error } = useMe();

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

    // Exibe o loader enquanto a query estiver em andamento OU se a query terminou
    // mas o usuário ainda não foi populado no store.
    if (isLoading || !user) {
        return <FullPageLoader />;
    }

    // Se passou pelo carregamento, não deu erro e o usuário existe no store,
    // renderiza a página real.
    return <>{children}</>;
};

export default AuthGuard;
