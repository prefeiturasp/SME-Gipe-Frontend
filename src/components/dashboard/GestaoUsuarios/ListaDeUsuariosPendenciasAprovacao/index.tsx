"use client";
import React from "react";
import { Usuario } from "@/types/usuarios";

import { CardUsuariosPendenciasAprovacao } from "./CardUsuariosPendenciasAprovacao";

import { RenderMessage } from "../RenderMessage";
import ModalAprovarUsuario from "./ModalAprovarUsuario";
import ModalRecusarUsuario from "./ModalRecusarUsuario";
import { useHandleAprovarUsuario } from "@/hooks/useHandleAprovarUsuario";
import { useHandleRecusarUsuario } from "@/hooks/useHandleRecusarUsuario";

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

    const {
        usuarioParaRecusar,
        setUsuarioParaRecusar,
        handleRecusarPerfil,
        isLoadingRecusar,
    } = useHandleRecusarUsuario();

    const onAprovar = (usuario: Usuario) => {
        setUsuarioParaAprovar(usuario);
    };

    const onRecusar = (usuario: Usuario) => {
        setUsuarioParaRecusar(usuario);
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

            <ModalRecusarUsuario
                open={usuarioParaRecusar !== null}
                onOpenChange={() => setUsuarioParaRecusar(null)}
                onRecusar={handleRecusarPerfil}
                isLoading={isLoadingRecusar}
            />
        </>
    );
}
