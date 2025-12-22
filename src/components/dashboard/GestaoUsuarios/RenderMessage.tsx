import React from "react";

import { Usuario } from "@/types/usuarios";

type RenderMessageProps = {
    isLoading: boolean;
    isError: boolean;
    error: {message?: string} | null;
    usuarios?: Usuario[];
};

const baseMessageClass = "text-sm text-[#42474A]";

const Message = ({ children }: {children: React.ReactNode}) => (
    <p className={baseMessageClass}>{children}</p>
);

export function RenderMessage({
    isLoading,
    isError,
    error,
    usuarios,
}: Readonly<RenderMessageProps>) {
    if (isLoading) {
        return <Message>Carregando usuários...</Message>;
    }

    if (isError) {
        return (
            <Message>
                Erro ao carregar usuários. {error?.message}
            </Message>
        );
    }

    if (!usuarios || usuarios.length === 0) {
        return <Message>Nenhum usuário encontrado.</Message>;
    }

    return null;
}
