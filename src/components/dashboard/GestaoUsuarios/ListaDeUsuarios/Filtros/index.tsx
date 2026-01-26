"use client";

import { Combobox } from "@/components/ui/Combobox";
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

type FiltrosUsuariosProps = {
    readonly onFilterChange?: (filters: {
        dreUuid?: string;
        ueUuid?: string;
    }) => void;
};

export default function FiltrosUsuarios({
    onFilterChange,
}: Readonly<FiltrosUsuariosProps>) {
    const user = useUserStore((state) => state.user);

    const [dreUuid, setDreUuid] = useState<string>("");
    const [ueUuid, setUeUuid] = useState<string>("");
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

    // Busca DREs
    const {
        data: dresData,
        isLoading: isLoadingDres,
        isError: isErrorDres,
    } = useGetUnidades(true, undefined, "DRE");

    // Busca UEs da DRE selecionada
    const {
        data: uesData,
        isLoading: isLoadingUes,
        isError: isErrorUes,
    } = useGetUnidades(true, dreUuid);

    // Sempre que mudar algum filtro, avisa o componente pai
    useEffect(() => {
        onFilterChange?.({
            dreUuid: dreUuid || undefined,
            ueUuid: ueUuid || undefined,
        });
    }, [dreUuid, ueUuid, onFilterChange]);

    const dresOptions =
        dresData?.map((dre: { uuid: string; nome: string }) => ({
            value: dre.uuid,
            label: dre.nome,
        })) ?? [];

    const uesOptions =
        uesData?.map((ue: { uuid: string; nome: string }) => ({
            value: ue.uuid,
            label: ue.nome,
        })) ?? [];

    const handleChangeDre = (value: string) => {
        setDreUuid(value);
        setUeUuid(""); // ao trocar DRE, limpa UE selecionada
    };

    const handleChangeUe = (value: string) => {
        setUeUuid(value);
    };

    const handleLimparFiltros = () => {
        if (!isPontoFocalDre) {
            setDreUuid("");
        }
        setUeUuid("");
    };

    const temFiltrosAplicados = isPontoFocalDre
        ? !!ueUuid
        : !!dreUuid || !!ueUuid;

    const getDrePlaceholder = () => {
        if (isLoadingDres) return "Carregando...";
        if (isErrorDres) return "Erro ao carregar DREs";
        return "Selecione";
    };

    const getUePlaceholder = () => {
        if (!dreUuid) return "Selecione primeiro uma DRE";
        if (isLoadingUes) return "Carregando...";
        if (isErrorUes) return "Erro ao carregar UEs";
        return "Selecione";
    };

    return (
        <section className="w-full space-y-6 my-5">
            {/* Texto explicativo */}
            <p className="text-sm text-[#42474A]">
                Você pode filtrar as pessoas que possuem acesso ao GIPE por
                Diretorias Regionais (DREs) e Unidades Educacionais (UEs)
            </p>

            {/* Linha com os dois selects e botão */}
            <div className="flex flex-col md:flex-row gap-6 items-end">
                {/* Container dos selects */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Diretoria Regional */}
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

                    {/* Unidade Educacional */}
                    <div className="space-y-2">
                        <p className="text-sm text-[#42474A] font-bold">
                            Unidade Educacional
                        </p>

                        <Combobox
                            data-testid="select-ue"
                            className="w-full h-10 rounded-lg text-base justify-between border border-gray-300"
                            options={uesOptions.map(
                                (ue: { value: string; label: string }) => ({
                                    label: ue.label,
                                    value: ue.value,
                                })
                            )}
                            value={ueUuid}
                            onChange={handleChangeUe}
                            placeholder={getUePlaceholder()}
                            disabled={!dreUuid}
                        />
                    </div>
                </div>

                <Button
                    variant="customOutline"
                    onClick={handleLimparFiltros}
                    disabled={!temFiltrosAplicados}
                    className="w-full md:w-[117px] h-10"
                >
                    Limpar filtros
                </Button>
            </div>
        </section>
    );
}
