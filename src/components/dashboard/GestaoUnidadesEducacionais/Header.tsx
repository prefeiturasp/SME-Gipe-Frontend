"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import NovoUsuario from "@/assets/icons/NovoUsuario";


export default function Header() {
    return (
        <div className="flex flex-row space-x-4 items-center justify-between">
            <span className="text-[14px] text-[#42474a]">
                Para permitir acesso ao GIPE à outras UEs, clique no botão
                &quot;Cadastrar Unidade Educacional&quot;
            </span>
            <Button asChild variant="submit" size="sm" className="font-normal">
                <Link href="/dashboard/gestao-unidades-educacionais/cadastro">
                    <NovoUsuario />{" "}
                    <span className="ml-2">Cadastrar Unidade Educacional</span>
                </Link>
            </Button>
        </div>
    );
}
