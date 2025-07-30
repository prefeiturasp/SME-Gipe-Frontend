"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import ArrowLeft from "@/assets/icons/ArrowLeft";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
    const router = useRouter();
    return (
        <div className="flex items-center justify-between w-full px-4">
            <h1 className="text-[#42474a] text-[24px] font-bold m-0">
                Meus dados
            </h1>
            <Button
                variant="customOutline"
                onClick={() => router.push("/dashboard")}
            >
                <ArrowLeft />
                &nbsp;Voltar
            </Button>
        </div>
    );
};

export default Header;
