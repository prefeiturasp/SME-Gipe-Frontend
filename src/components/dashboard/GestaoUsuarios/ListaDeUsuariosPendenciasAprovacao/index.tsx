"use client";
import React from "react";
import { dataUsuarios } from "../data-usuarios";
import { Usuario } from "@/types/usuarios";

import {CardUsuariosPendenciasAprovacao} from "./CardUsuariosPendenciasAprovacao";

export default function ListaDeUsuariosPendenciasAprovacao() {

    const onAprovar = (usuario: Usuario) => {
        console.log("Aprovado:", usuario);
    }

    const onRecusar = (usuario: Usuario) => {
        console.log("Recusado:", usuario);
    }

    return <CardUsuariosPendenciasAprovacao usuarios={dataUsuarios} onAprovar={onAprovar} onRecusar={onRecusar} />;
}
