"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserPermissions } from "@/hooks/useUserPermissions";

export default function Header() {
    const { isAssistenteOuDiretor } = useUserPermissions();
    return (
        <div className="flex flex-row space-x-4 items-center justify-between">
            <span className="text-[14px] text-[#42474a]">
                Para registrar uma nova intercorrência institucional, clique no
                botão &quot;nova ocorrência&quot;
            </span>

            {isAssistenteOuDiretor && (
                <Button
                    asChild
                    variant="submit"
                    size="sm"
                    className="font-normal"
                >
                    <Link href="/dashboard/cadastrar-ocorrencia" replace>
                        + Nova ocorrência
                    </Link>
                </Button>
            )}
        </div>
    );
}
