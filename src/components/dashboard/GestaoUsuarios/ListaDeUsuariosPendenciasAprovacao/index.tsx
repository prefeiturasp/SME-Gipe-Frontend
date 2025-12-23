"use client";
import React from "react";
import { Usuario } from "@/types/usuarios";

import { CardUsuariosPendenciasAprovacao } from "./CardUsuariosPendenciasAprovacao";

import { RenderMessage } from "../RenderMessage";
import ModalAprovarUsuario from "./ModalAprovarUsuario";
import { useHandleAprovarUsuario } from "@/hooks/useHandleAprovarUsuario";

type ListaDeUsuariosPendenciasAprovacaoProps = {
    usuarios?: Usuario[];
    isLoading?: boolean;
    isError?: boolean;
    error?: { message?: string } | null;
};

export default function ListaDeUsuariosPendenciasAprovacao({
    usuarios,
    isLoading = false,
    isError = false,
    error = null,
}: Readonly<ListaDeUsuariosPendenciasAprovacaoProps>) {
    const {
        usuarioParaAprovar,
        setUsuarioParaAprovar,
        handleAprovarPerfil,
        isLoadingAprovar,
    } = useHandleAprovarUsuario();

    const onAprovar = (usuario: Usuario) => {
        setUsuarioParaAprovar(usuario);
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

            <ModalAprovarUsuario
                open={usuarioParaAprovar !== null}
                onOpenChange={() => {
                    setUsuarioParaAprovar(null);
                }}
                onAprovar={handleAprovarPerfil}
                isLoading={isLoadingAprovar}
            />
        </>
    );
}
