"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import ArrowLeft from "@/assets/icons/ArrowLeft";
import Link from "next/link";
import UserBlock from "@/assets/icons/UserBlock";
import { useObterUsuarioGestao } from "@/hooks/useObterUsuarioGestao";

interface PageHeaderProps {
    title: string;
    edit?: boolean;
    usuarioUuid?: string;
    onClickBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    edit = true,
    usuarioUuid,
    onClickBack,
}) => {
    const { data: usuarioData } = useObterUsuarioGestao({uuid: usuarioUuid || ""});

    return (
        <div className="flex items-center justify-between w-full px-4">
            <h1 className="text-[#42474a] text-[20px] font-bold m-0">
                {title}
            </h1>
            {edit ? (
                <div className="flex gap-2">
                    <Button asChild variant="customOutline" size="icon">
                        <Link
                            href="/dashboard/gestao-usuarios"
                            onClick={onClickBack}
                        >
                            <ArrowLeft />
                        </Link>
                    </Button>
                    {usuarioData?.is_active ?
                    <Button
                        variant="outlineDestructive"
                        type="button"
                        className="text-center rounded-md text-[14px] font-[700]"
                    >
                        <UserBlock className="mr-2" />
                        Inativar perfil
                    </Button>
                    : <Button
                        variant="customOutline"
                        type="button"
                        className="text-center rounded-md text-[14px] font-[700]"
                    >
                        Reativar perfil
                    </Button>}
                </div>
            ) : (
                <Button asChild variant="customOutline">
                    <Link
                        href="/dashboard/gestao-usuarios"
                        onClick={onClickBack}
                    >
                        <ArrowLeft className="mr-2" />
                        &nbsp;Voltar
                    </Link>
                </Button>
            )}
        </div>
    );
};

export default PageHeader;
