"use client";

import ArrowLeft from "@/assets/icons/ArrowLeft";
import UserBlock from "@/assets/icons/UserBlock";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/headless-toast";
import { useInativarGestaoUsuario } from "@/hooks/useInativarGestaoUsuario";
import { useObterUsuarioGestao } from "@/hooks/useObterUsuarioGestao";
import { useReativarGestaoUsuario } from "@/hooks/useReativarGestaoUsuario";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ModalConfirmacaoPerfil from "./ModalConfirmacaoPerfil";

interface PageHeaderProps {
    title: string;
    edit?: boolean;
    onClickBack?: () => void;
    usuarioUuid?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    edit = true,
    onClickBack,
    usuarioUuid,
}) => {
    const [openModal, setOpenModal] = useState(false);
    const [isReativacao, setIsReativacao] = useState(false);
    const [motivoInativacao, setMotivoInativacao] = useState<string>("");
    const router = useRouter();
    const { mutateAsync: inativarUsuario, isPending: isPendingInativar } =
        useInativarGestaoUsuario();
    const { mutateAsync: reativarUsuario, isPending: isPendingReativar } =
        useReativarGestaoUsuario();
    const queryClient = useQueryClient();

    const handleInactivateInternal = async () => {
        if (!usuarioUuid) return;

        const result = await inativarUsuario({
            uuid: usuarioUuid,
            motivo_inativacao: motivoInativacao,
        });

        if (result.success) {
            toast({
                title: "Tudo certo por aqui!",
                description: "O perfil foi inativado com sucesso.",
                variant: "success",
            });
            queryClient.invalidateQueries({
                queryKey: ["usuario-gestao", usuarioUuid],
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

    const handleReativarInternal = async () => {
        if (!usuarioUuid) return;

        const result = await reativarUsuario(usuarioUuid);

        if (result.success) {
            toast({
                title: "Tudo certo por aqui!",
                description: "O perfil foi reativado com sucesso.",
                variant: "success",
            });
            queryClient.invalidateQueries({
                queryKey: ["usuario-gestao", usuarioUuid],
            });
            router.push("/dashboard/gestao-usuarios?tab=ativos");
        } else {
            toast({
                title: "Não conseguimos concluir a ação!",
                description: result.error || "Erro ao reativar usuário.",
                variant: "error",
            });
        }
    };

    const loading = isReativacao ? isPendingReativar : isPendingInativar;
    const { data: usuarioData } = useObterUsuarioGestao({
        uuid: usuarioUuid ?? "",
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
                                onClick={() => {
                                    setIsReativacao(false);
                                    setOpenModal(true);
                                }}
                                disabled={loading}
                            >
                                <UserBlock className="mr-2" />
                                Inativar perfil
                            </Button>
                        ) : (
                            <Button
                                variant="submit"
                                type="button"
                                className="text-center rounded-md text-[14px] font-[700]"
                                onClick={() => {
                                    setIsReativacao(true);
                                    setOpenModal(true);
                                }}
                                disabled={
                                    loading ||
                                    (usuarioData?.inativado_via_unidade ??
                                        false)
                                }
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
            {edit && (
                <ModalConfirmacaoPerfil
                    open={openModal}
                    onOpenChange={setOpenModal}
                    onConfirm={
                        isReativacao
                            ? handleReativarInternal
                            : handleInactivateInternal
                    }
                    isLoading={loading}
                    isReativacao={isReativacao}
                    motivoInativacao={motivoInativacao}
                    setMotivoInativacao={setMotivoInativacao}
                />
            )}
        </>
    );
};

export default PageHeader;
