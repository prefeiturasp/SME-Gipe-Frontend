"use client";
import React from "react";
import { Usuario } from "@/types/usuarios";

import { CardUsuariosPendenciasAprovacao } from "./CardUsuariosPendenciasAprovacao";

import { RenderMessage } from "../RenderMessage";

type ListaDeUsuariosPendenciasAprovacaoProps = {
    usuarios?: Usuario[];
    isLoading?: boolean;
    isError?: boolean;
    error?: {message?: string} | null;
};

export default function ListaDeUsuariosPendenciasAprovacao({
    usuarios,
    isLoading = false,
    isError = false,
    error = null,
}: Readonly<ListaDeUsuariosPendenciasAprovacaoProps>) {

    const onAprovar = (usuario: Usuario) => {
        console.log("Aprovado:", usuario);
    };

    const onRecusar = (usuario: Usuario) => {
        console.log("Recusado:", usuario);
    };

    return (
        <>
            <RenderMessage
                isLoading={isLoading}
                isError={isError}
                error={error}
                usuarios={usuarios}
            />

            {usuarios && usuarios.length > 0 && (
                <CardUsuariosPendenciasAprovacao
                    usuarios={usuarios}
                    onAprovar={onAprovar}
                    onRecusar={onRecusar}
                />
            )}
        </>
    );
}
