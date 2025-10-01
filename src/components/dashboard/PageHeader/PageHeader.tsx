"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import ArrowLeft from "@/assets/icons/ArrowLeft";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
    title: string;
    showBackButton?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    showBackButton = true,
}) => {
    const router = useRouter();
    return (
        <div className="flex items-center justify-between w-full px-4">
            <h1 className="text-[#42474a] text-[24px] font-bold m-0">
                {title}
            </h1>
            {showBackButton && (
                <Button
                    variant="customOutline"
                    size="sm"
                    onClick={() => router.back()}
                >
                    <ArrowLeft />
                    &nbsp;Voltar
                </Button>
            )}
        </div>
    );
};

export default PageHeader;
