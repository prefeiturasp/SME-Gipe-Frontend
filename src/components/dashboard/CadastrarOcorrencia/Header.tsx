"use client";

import { Button } from "@/components/ui/button";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useOcorrenciaFormStore } from "@/stores/useOcorrenciaFormStore";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ModalSemUnidade from "./ModalSemUnidade";

export default function Header() {
    const user = useUserStore((state) => state.user);
    const reset = useOcorrenciaFormStore((state) => state.reset);
    const { isAssistenteOuDiretor } = useUserPermissions();

    const hasUnidades = !!(user?.unidades && user.unidades.length > 0);
    const [openModal, setOpenModal] = useState(false);
    const router = useRouter();

    const handleNovaOcorrencia = () => {
        const needsUnidadeValidation = isAssistenteOuDiretor && !hasUnidades;

        if (needsUnidadeValidation) {
            setOpenModal(true);
        } else {
            reset();
            router.push("/dashboard/cadastrar-ocorrencia");
        }
    };

    return (
        <>
            <div className="flex flex-row space-x-4 items-center justify-between">
                <span className="text-[14px] text-[#42474a]">
                    Para registrar uma nova intercorrência institucional, clique
                    no botão &quot;nova ocorrência&quot;
                </span>

                <Button
                    variant="submit"
                    size="sm"
                    className="font-normal"
                    onClick={handleNovaOcorrencia}
                >
                    + Nova ocorrência
                </Button>
            </div>

            <ModalSemUnidade open={openModal} onOpenChange={setOpenModal} />
        </>
    );
}
