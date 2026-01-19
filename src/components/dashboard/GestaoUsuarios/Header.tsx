"use client";

import NovoUsuario from "@/assets/icons/NovoUsuario";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
    return (
        <div className="flex flex-row space-x-4 items-center justify-between">
            <span className="text-[14px] text-[#42474a]">
                Para permitir acesso ao GIPE à outras pessoas, clique no botão
                &quot;Cadastrar perfil&quot;
            </span>

            <Button asChild variant="submit" size="sm" className="font-normal">
                <Link href="/dashboard/gestao-usuarios/cadastro">
                    <NovoUsuario />{" "}
                    <span className="ml-2">Cadastrar perfil</span>
                </Link>
            </Button>
        </div>
    );
}
