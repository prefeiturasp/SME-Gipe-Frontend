"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetUnidades } from "@/hooks/useGetUnidades";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useState } from "react";

type FiltrosUnidadesEducacionaisProps = {
    readonly onFilterChange?: (filters: { dreUuid?: string }) => void;
};

export default function FiltrosUnidadesEducacionais({
    onFilterChange,
}: Readonly<FiltrosUnidadesEducacionaisProps>) {
    const user = useUserStore((state) => state.user);

    const [dreUuid, setDreUuid] = useState<string>("");
    const [isPontoFocalDre, setIsPontoFocalDre] = useState<boolean>(false);

    useEffect(() => {
        if (dreUuid) return;

        const isPontoFocalDre = user?.perfil_acesso?.codigo === 1;
        const dreFromUser = user?.unidades?.[0]?.dre?.dre_uuid;

        if (isPontoFocalDre && dreFromUser) {
            setDreUuid(dreFromUser);
            setIsPontoFocalDre(true);
        }
    }, [user, dreUuid]);

    const {
        data: dresData,
        isLoading: isLoadingDres,
        isError: isErrorDres,
    } = useGetUnidades(true, undefined, "DRE");

    useEffect(() => {
        onFilterChange?.({
            dreUuid: dreUuid || undefined,
        });
    }, [dreUuid, onFilterChange]);

    const dresOptions =
        dresData?.map((dre: { uuid: string; nome: string }) => ({
            value: dre.uuid,
            label: dre.nome,
        })) ?? [];

    const handleChangeDre = (value: string) => {
        setDreUuid(value);
    };

    const handleLimparFiltros = () => {
        if (!isPontoFocalDre) {
            setDreUuid("");
        }
    };

    const temFiltrosAplicados = !!dreUuid;

    const getDrePlaceholder = () => {
        if (isLoadingDres) return "Carregando...";
        if (isErrorDres) return "Erro ao carregar DREs";
        return "Selecione";
    };

    return (
        <section className="w-full space-y-6 my-5">
            <p className="text-sm text-[#42474A]">
                Você pode filtrar as UEs por Diretorias Regionais (DREs).
            </p>

            <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1">
                    <div className="space-y-2">
                        <p className="text-sm text-[#42474A] font-bold">
                            Diretoria Regional
                        </p>

                        <Select
                            value={dreUuid}
                            onValueChange={handleChangeDre}
                            disabled={isPontoFocalDre}
                        >
                            <SelectTrigger className="w-full h-10 rounded-lg text-base justify-between">
                                <SelectValue
                                    placeholder={getDrePlaceholder()}
                                />
                            </SelectTrigger>

                            <SelectContent>
                                {isLoadingDres && (
                                    <SelectItem value="loading" disabled>
                                        Carregando...
                                    </SelectItem>
                                )}

                                {isErrorDres && (
                                    <SelectItem value="error" disabled>
                                        Erro ao carregar DREs
                                    </SelectItem>
                                )}

                                {!isLoadingDres &&
                                    !isErrorDres &&
                                    dresOptions.map(
                                        (dre: {
                                            value: string;
                                            label: string;
                                        }) => (
                                            <SelectItem
                                                key={dre.value}
                                                value={dre.value}
                                            >
                                                {dre.label}
                                            </SelectItem>
                                        )
                                    )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {!isPontoFocalDre && (
                    <Button
                        variant="customOutline"
                        onClick={handleLimparFiltros}
                        disabled={!temFiltrosAplicados}
                        className="w-full md:w-[117px] h-10"
                    >
                        Limpar filtros
                    </Button>
                )}
            </div>
        </section>
    );
}
