"use client";

import React, {useEffect, useState} from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFetchDREs, useFetchUEs } from "@/hooks/useUnidades";
import { Combobox } from "@/components/ui/Combobox";


type FiltrosUsuariosProps = {
    readonly onFilterChange?: (filters: { dreUuid?: string; ueUuid?: string }) => void;
};

export default function FiltrosUsuarios({
    onFilterChange,
}: Readonly<FiltrosUsuariosProps>) {

    const [dreUuid, setDreUuid] = useState<string | undefined>();
    const [ueUuid, setUeUuid] = useState<string | undefined>();

    // Busca DREs
    const {data: dresData, isLoading: isLoadingDres, isError: isErrorDres,} = useFetchDREs();

    // Busca UEs da DRE selecionada
    const {data: uesData, isLoading: isLoadingUes, isError: isErrorUes,} = useFetchUEs(dreUuid ?? "", "TODAS");

    // Sempre que mudar algum filtro, avisa o componente pai
    useEffect(() => {
        onFilterChange?.({ dreUuid, ueUuid });
    }, [dreUuid, ueUuid, onFilterChange]);

    const dresOptions =
        dresData?.map((dre: {uuid: string; nome: string;}) => ({
            value: dre.uuid,
            label: dre.nome,
        })) ?? [];

    const uesOptions =
        uesData?.map((ue: {uuid: string; nome: string;}) => ({
            value: ue.uuid,
            label: ue.nome,
        })) ?? [];

    const handleChangeDre = (value: string) => {
        setDreUuid(value);
        setUeUuid(undefined); // ao trocar DRE, limpa UE selecionada
    };

    const handleChangeUe = (value: string) => {
        setUeUuid(value);
    };

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
            <p className="text-sm md:text-base text-muted-foreground">
                Você pode filtrar as pessoas que possuem acesso ao GIPE por
                Diretorias Regionais (DREs) e Unidades Educacionais (UEs)
            </p>

            {/* Linha com os dois selects */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Diretoria Regional */}
                <div className="space-y-2">
                    <p className="text-base font-semibold text-foreground">
                        Diretoria Regional
                    </p>

                    <Select value={dreUuid} onValueChange={handleChangeDre}>
                        <SelectTrigger className="w-full h-12 rounded-lg text-base justify-between">
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
                                dresOptions.map((dre: { value: string; label: string }) => (
                                    <SelectItem
                                        key={dre.value}
                                        value={dre.value}
                                    >
                                        {dre.label}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Unidade Educacional */}
                <div className="space-y-2">
                    <p className="text-base font-semibold text-foreground">
                        Unidade Educacional
                    </p>

                    <Combobox
                        data-testid="select-ue"
                        className="w-full h-12 rounded-lg text-base justify-between border border-gray-300"
                        options={uesOptions.map((ue: { value: string; label: string }) => ({
                                label: ue.label,
                                value: ue.value,
                            })
                        )}
                        value={ueUuid ?? ""}
                        onChange={handleChangeUe}
                        placeholder={getUePlaceholder()}
                        disabled={!dreUuid}
                    />
                </div>
            </div>
        </section>
    );
}
