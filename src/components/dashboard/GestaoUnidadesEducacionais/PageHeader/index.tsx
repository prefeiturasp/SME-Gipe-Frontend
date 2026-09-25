"use client";

import ArrowLeft from "@/assets/icons/ArrowLeft";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/headless-toast";
import { useInativarUnidadeGestao } from "@/hooks/useInativarUnidadeGestao";
import { useObterUnidadeGestao } from "@/hooks/useObterUnidadeGestao";
import { useReativarUnidadeGestao } from "@/hooks/useReativarUnidadeGestao";
import { useQueryClient } from "@tanstack/react-query";
import { Ban } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ModalConfirmacao from "../FormularioCadastroUnidadeEducacional/ModalConfirmacao";

interface PageHeaderProps {
    title: string;
    edit?: boolean;
    onClickBack?: () => void;
    unidadeUuid?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    edit = false,
    onClickBack,
    unidadeUuid,
}) => {
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState<"inativar" | "reativar">(
        "inativar",
    );
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data: unidadeData } = useObterUnidadeGestao({
        uuid: unidadeUuid ?? "",
    });

    const { mutateAsync: inativarUnidade, isPending: isInativando } =
        useInativarUnidadeGestao();

    const { mutateAsync: reativarUnidade, isPending: isReativando } =
        useReativarUnidadeGestao();

    const handleInativarUnidadeEducacional = async (
        motivoInativacao: string,
    ) => {
        if (!unidadeUuid) return;

        const response = await inativarUnidade({
            uuid: unidadeUuid,
            motivo_inativacao: motivoInativacao,
        });

        if (response.success) {
            toast({
                title: "Tudo certo por aqui!",
                description: "A unidade educacional foi inativada com sucesso.",
                variant: "success",
            });
            setOpenModal(false);
            queryClient.invalidateQueries({
                queryKey: ["unidade-gestao", unidadeUuid],
            });
            router.push("/dashboard/gestao-unidades-educacionais?tab=inativas");
        } else {
            toast({
                title: "Não conseguimos concluir a ação!",
                description: response.error,
                variant: "error",
            });
        }
    };

    const handleReativarUnidadeEducacional = async (
        motivoReativacao: string,
    ) => {
        if (!unidadeUuid) return;

        const response = await reativarUnidade({
            uuid: unidadeUuid,
            motivo_reativacao: motivoReativacao,
        });

        if (response.success) {
            toast({
                title: "Tudo certo por aqui!",
                description: "A Unidade Educacional foi reativada com sucesso.",
                variant: "success",
            });
            setOpenModal(false);
            queryClient.invalidateQueries({
                queryKey: ["unidade-gestao", unidadeUuid],
            });
            router.push("/dashboard/gestao-unidades-educacionais?tab=ativas");
        } else {
            toast({
                title: "Não conseguimos concluir a ação!",
                description: response.error,
                variant: "error",
            });
        }
    };

    return (
        <div className="flex items-center justify-between w-full px-4">
            <h1 className="text-[#42474a] text-[20px] font-bold m-0">
                {title}
            </h1>
            {edit && unidadeData?.rede !== "DIRETA" ? (
                <div className="flex gap-2">
                    <Button asChild variant="customOutline" size="icon">
                        <Link
                            href="/dashboard/gestao-unidades-educacionais"
                            onClick={onClickBack}
                        >
                            <ArrowLeft />
                        </Link>
                    </Button>

                    {unidadeData?.ativa ? (
                        <Button
                            variant="outlineDestructive"
                            type="button"
                            className="text-center rounded-md text-[14px] font-[700]"
                            onClick={() => {
                                setModalMode("inativar");
                                setOpenModal(true);
                            }}
                            disabled={isInativando}
                        >
                            <Ban className="mr-2" width="20" />
                            Inativar Unidade Educacional
                        </Button>
                    ) : (
                        <Button
                            variant="submit"
                            type="button"
                            className="text-center rounded-md text-[14px] font-[700]"
                            onClick={() => {
                                setModalMode("reativar");
                                setOpenModal(true);
                            }}
                            disabled={isReativando}
                        >
                            Reativar Unidade Educacional
                        </Button>
                    )}
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

            {edit && (
                <ModalConfirmacao
                    open={openModal}
                    onOpenChange={setOpenModal}
                    onConfirm={
                        modalMode === "inativar"
                            ? handleInativarUnidadeEducacional
                            : handleReativarUnidadeEducacional
                    }
                    isLoading={isInativando || isReativando}
                    mode={modalMode}
                />
            )}
        </div>
    );
};

export default PageHeader;
