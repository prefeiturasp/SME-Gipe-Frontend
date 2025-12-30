"use client";

import ArrowLeft from "@/assets/icons/ArrowLeft";
import UserBlock from "@/assets/icons/UserBlock";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/headless-toast";
import { useInativarGestaoUsuario } from "@/hooks/useInativarGestaoUsuario";
import { useObterUsuarioGestao } from "@/hooks/useObterUsuarioGestao";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ModalInativacao from "./ModalInativacao";

interface PageHeaderProps {
    title: string;
    edit?: boolean;
    onClickBack?: () => void;
    onInactivate?: () => void;
    isLoadingInactivate?: boolean;
    usuarioUuid?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    edit = true,
    onClickBack,
    onInactivate,
    isLoadingInactivate,
    usuarioUuid,
}) => {
    const [openModal, setOpenModal] = useState(false);
    const router = useRouter();
    const { mutateAsync: inativarUsuario, isPending } =
        useInativarGestaoUsuario();

    const handleInactivateInternal = async () => {
        if (!usuarioUuid) return;

        const result = await inativarUsuario(usuarioUuid);

        if (result.success) {
            toast({
                title: "Perfil inativado com sucesso.",
                description: "O usuário não terá mais acesso ao GIPE.",
                variant: "success",
            });
            router.push("/dashboard/gestao-usuarios?tab=inativos");
        } else {
            toast({
                title: "Não conseguimos concluir a ação!",
                description: result.error || "Erro ao inativar usuário.",
                variant: "error",
            });
        }
    };

    const handleInactivate = onInactivate || handleInactivateInternal;
    const loading = isLoadingInactivate ?? isPending;
    const { data: usuarioData } = useObterUsuarioGestao({
        uuid: usuarioUuid || "",
    });

    return (
        <>
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
                        {usuarioData?.is_active ? (
                            <Button
                                variant="outlineDestructive"
                                type="button"
                                className="text-center rounded-md text-[14px] font-[700]"
                                onClick={() => setOpenModal(true)}
                                disabled={loading}
                            >
                                <UserBlock className="mr-2" />
                                Inativar perfil
                            </Button>
                        ) : (
                            <Button
                                variant="customOutline"
                                type="button"
                                className="text-center rounded-md text-[14px] font-[700]"
                            >
                                Reativar perfil
                            </Button>
                        )}
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
            {edit && handleInactivate && (
                <ModalInativacao
                    open={openModal}
                    onOpenChange={setOpenModal}
                    onConfirm={handleInactivate}
                    isLoading={loading}
                />
            )}
        </>
    );
};

export default PageHeader;
