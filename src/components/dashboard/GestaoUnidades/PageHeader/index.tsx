"use client";

import ArrowLeft from "@/assets/icons/ArrowLeft";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PageHeaderProps {
    title: string;
    edit?: boolean;
    onClickBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    edit = true,
    onClickBack,
}) => {
    return (
        <div className="flex items-center justify-between w-full px-4">
            <h1 className="text-[#42474a] text-[20px] font-bold m-0">
                {title}
            </h1>
            {edit ? (
                <div className="flex gap-2">
                    <Button asChild variant="customOutline" size="icon">
                        <Link
                            href="/dashboard/gestao-unidades-educacionais"
                            onClick={onClickBack}
                        >
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <Button
                        variant="outlineDestructive"
                        type="button"
                        className="text-center rounded-md text-[14px] font-[700]"
                    >
                        <Ban className="mr-2" size="sm" />
                        Inativar Unidade Educacional
                    </Button>
                </div>
            ) : (
                <Button asChild variant="customOutline">
                    <Link
                        href="/dashboard/gestao-unidades-educacionais"
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
