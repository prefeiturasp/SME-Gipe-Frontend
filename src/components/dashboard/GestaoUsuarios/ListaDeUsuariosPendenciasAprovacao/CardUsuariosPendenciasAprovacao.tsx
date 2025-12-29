"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";

import { Usuario } from "@/types/usuarios";

type ListaDeUsuariosProps = {
    usuarios: Usuario[];
    onAprovar?: (usuario: Usuario) => void;
    onRecusar?: (usuario: Usuario) => void;
};

export function CardUsuariosPendenciasAprovacao({
    usuarios,
    onAprovar,
    onRecusar,
}: Readonly<ListaDeUsuariosProps>) {
    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {usuarios.map((usuario) => (
                <Card
                    key={usuario.uuid}
                    className="flex h-full flex-col border-slate-200 shadow-sm pt-3 pb-0 rounded-md"
                >
                    <CardHeader className="pb-3">
                        <h3 className="text-xl font-bold leading-snug text-[#42474A]">
                            {usuario.nome}
                        </h3>
                        <p className="text-sm text-[#42474A]">
                            {usuario.perfil}
                        </p>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-4 text-sm text-[#42474A]">
                        <div className="space-y-3">
                            <div>
                                <p className="font-bold">CPF:</p>
                                <p className="text-[#42474A]">
                                    {usuario.rf_ou_cpf}
                                </p>
                            </div>

                            <div>
                                <p className="font-bold">E-mail:</p>
                                <p className="break-all text-[#42474A]">
                                    {usuario.email}
                                </p>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200" />

                        <div className="space-y-3">
                            <div>
                                <p className="font-bold">Diretoria Regional:</p>
                                <p className="text-[#42474A]">
                                    {usuario.diretoria_regional ?? "—"}
                                </p>
                            </div>

                            <div>
                                <p className="font-bold">
                                    Unidade Educacional:
                                </p>
                                <p className="text-[#42474A]">
                                    {usuario.unidade_educacional ?? "—"}
                                </p>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200" />

                        <p className="text-sm">
                            <span className="font-bold">
                                Data da solicitação:
                            </span>{" "}
                            <span className="text-[#42474A]">
                                {usuario.data_solicitacao ?? "09/06/2025"}
                            </span>
                        </p>
                    </CardContent>

                    <CardFooter className="border-slate-200 px-4 py-4">
                        <div className="flex w-full items-center gap-3">
                            <Button
                                variant="customOutline"
                                size="sm"
                                className="w-1/2 h-[40px]"
                                onClick={() => onRecusar?.(usuario)}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Recusar
                            </Button>
                            <Button
                                variant="submit"
                                size="sm"
                                className="w-1/2 font-normal h-[40px]"
                                onClick={() => onAprovar?.(usuario)}
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Aprovar
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
