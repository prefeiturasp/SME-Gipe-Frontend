"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCategoriasDisponiveis } from "@/hooks/useCategoriasDisponiveis";
import { useGetUnidades } from "@/hooks/useGetUnidades";
import { cn } from "@/lib/utils";
import type { UnidadeEducacional } from "@/types/unidades";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export interface FilterState {
    ano: string;
    meses: string[];
    bimestre: string[];
    dres: string[];
    ues: string[];
    genero: string;
    etapas: string[];
    idade: string;
    menosDeUmAno: boolean;
}

const ANO_ATUAL = new Date().getFullYear().toString();
const ANO_INICIO = 2024;
const ANO_FIM = Math.max(new Date().getFullYear(), ANO_INICIO);

const ANOS = Array.from({ length: ANO_FIM - ANO_INICIO + 1 }, (_, i) =>
    (ANO_INICIO + i).toString(),
);

export const MESES = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
];

export const BIMESTRES = [
    { value: "1", label: "1º Bimestre" },
    { value: "2", label: "2º Bimestre" },
    { value: "3", label: "3º Bimestre" },
    { value: "4", label: "4º Bimestre" },
];

export const GENEROS = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
];

function FilterSection({
    title,
    children,
}: Readonly<{
    title: string;
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-[#F5F6F8] rounded-[4px] p-3 flex flex-col gap-3">
            <p className="text-[#42474a] text-[14px] font-bold tracking-wide">
                {title}
            </p>
            {children}
        </div>
    );
}

function FilterField({
    label,
    children,
}: Readonly<{
    label: string;
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col gap-1">
            <Label className="text-[#42474A] text-[14px] font-bold">
                {label}
            </Label>
            {children}
        </div>
    );
}

function FilterMultiSelect({
    options,
    selected,
    onChange,
    placeholder,
    selectAllLabel,
}: Readonly<{
    options: { value: string; label: string }[];
    selected: string[];
    onChange: (values: string[]) => void;
    placeholder: string;
    selectAllLabel?: string;
}>) {
    const [open, setOpen] = useState(false);
    const allSelected =
        selected.length === options.length && options.length > 0;

    function toggleAll() {
        onChange(allSelected ? [] : options.map((o) => o.value));
    }

    function toggleItem(value: string) {
        onChange(
            selected.includes(value)
                ? selected.filter((v) => v !== value)
                : [...selected, value],
        );
    }

    let triggerLabel: string;
    if (selected.length === 0) {
        triggerLabel = placeholder;
    } else if (selected.length === 1) {
        triggerLabel = options.find((o) => o.value === selected[0])!.label;
    } else {
        triggerLabel = `${selected.length} selecionados`;
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        "flex w-full items-center justify-between rounded-[4px] border border-[#d9d9d9] bg-white px-3 py-2 text-[14px]",
                        "focus:outline-none focus:ring-1 focus:ring-[#5B78C7]",
                        selected.length === 0
                            ? "text-[#a0a0a0]"
                            : "text-[#595959]",
                    )}
                    aria-label={placeholder}
                >
                    <span className="truncate">{triggerLabel}</span>
                    <ChevronDown className="ml-1 h-3.5 w-3.5 shrink-0 text-[#595959]" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[210px] p-0" align="start">
                <Command>
                    <CommandList>
                        {selectAllLabel && (
                            <CommandItem
                                onSelect={toggleAll}
                                className="gap-2 text-[14px] px-3 py-1.5 cursor-pointer"
                            >
                                <div
                                    className={cn(
                                        "h-4 w-4 rounded-[2px] border border-[#d9d9d9] flex items-center justify-center",
                                        allSelected &&
                                            "bg-[#5B78C7] border-[#5B78C7]",
                                    )}
                                >
                                    {allSelected && (
                                        <Check className="h-3 w-3 text-white" />
                                    )}
                                </div>
                                {selectAllLabel}
                            </CommandItem>
                        )}
                        {options.map((option) => {
                            const isSelected = selected.includes(option.value);
                            return (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => toggleItem(option.value)}
                                    className="gap-2 text-[14px] px-3 py-1.5 cursor-pointer"
                                >
                                    <div
                                        className={cn(
                                            "h-4 w-4 rounded-[2px] border border-[#d9d9d9] flex items-center justify-center",
                                            isSelected &&
                                                "bg-[#5B78C7] border-[#5B78C7]",
                                        )}
                                    >
                                        {isSelected && (
                                            <Check className="h-3 w-3 text-white" />
                                        )}
                                    </div>
                                    {option.label}
                                </CommandItem>
                            );
                        })}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export const filterStateInitial: FilterState = {
    ano: ANO_ATUAL,
    meses: [],
    bimestre: [],
    dres: [],
    ues: [],
    genero: "",
    etapas: [],
    idade: "",
    menosDeUmAno: false,
};

export default function FilterPanel({
    onStateChange,
}: Readonly<{ onStateChange?: (state: FilterState) => void }>) {
    const [ano, setAno] = useState(ANO_ATUAL);
    const [meses, setMeses] = useState<string[]>([]);
    const [bimestre, setBimestre] = useState<string[]>([]);
    const [dres, setDres] = useState<string[]>([]);
    const [ues, setUes] = useState<string[]>([]);
    const [genero, setGenero] = useState("");

    const { data: categoriasDisponiveis } = useCategoriasDisponiveis();
    const etapasOptions = categoriasDisponiveis?.etapa_escolar ?? [];

    const { data: dreData = [] } = useGetUnidades(true, undefined, "DRE");

    const dreUuid =
        dres.length === 1
            ? dreData.find((d: UnidadeEducacional) => d.codigo_eol === dres[0])
                  ?.uuid
            : undefined;

    const { data: ueData = [] } = useGetUnidades(true, dreUuid);

    const dreOptions = dreData.map((d: UnidadeEducacional) => ({
        value: d.codigo_eol,
        label: d.nome,
    }));
    const ueOptions = ueData.map((u: UnidadeEducacional) => ({
        value: u.codigo_eol,
        label: u.nome,
    }));
    const [etapas, setEtapas] = useState<string[]>([]);
    const [idade, setIdade] = useState("");
    const [menosDeUmAno, setMenosDeUmAno] = useState(false);

    const temFiltroAtivo =
        meses.length > 0 ||
        bimestre.length > 0 ||
        dres.length > 0 ||
        ues.length > 0 ||
        genero !== "" ||
        etapas.length > 0 ||
        idade !== "" ||
        menosDeUmAno;

    useEffect(() => {
        onStateChange?.({
            ano,
            meses,
            bimestre,
            dres,
            ues,
            genero,
            etapas,
            idade,
            menosDeUmAno,
        });
    }, [
        ano,
        meses,
        bimestre,
        dres,
        ues,
        genero,
        etapas,
        idade,
        menosDeUmAno,
        onStateChange,
    ]);

    function handleLimpar() {
        setMeses([]);
        setBimestre([]);
        setDres([]);
        setUes([]);
        setGenero("");
        setEtapas([]);
        setIdade("");
        setMenosDeUmAno(false);
    }

    function handleMenosDeUmAno(checked: boolean) {
        setMenosDeUmAno(checked);
        setIdade("");
    }

    const selectTriggerClass =
        "text-[14px] text-[#595959] border-[#d9d9d9] focus:ring-1 focus:ring-[#5B78C7]";

    return (
        <aside
            className={cn(
                "w-[316px] shrink-0",
                "bg-white rounded-[4px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.12)]",
                "flex flex-col gap-0 m-4",
                "overflow-y-auto max-h-[calc(100vh-80px)]",
            )}
        >
            <div className="px-5 pt-5 pb-3">
                <h1 className="text-[#42474a] text-[20px] font-bold">
                    Filtros
                </h1>
                <p className="text-[#42474a] text-[14px] mt-1 leading-tight line-clamp-2">
                    Selecione os critérios para refinar a análise
                </p>
            </div>

            <div className="flex flex-col gap-3 px-5 py-4">
                <FilterSection title="Período">
                    <FilterField label="Ano">
                        <Select value={ano} onValueChange={setAno}>
                            <SelectTrigger
                                className={selectTriggerClass}
                                aria-label="Ano"
                            >
                                <SelectValue placeholder="Ano" />
                            </SelectTrigger>
                            <SelectContent>
                                {ANOS.map((a) => (
                                    <SelectItem key={a} value={a}>
                                        {a}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FilterField>

                    <FilterField label="Mês">
                        <FilterMultiSelect
                            options={MESES}
                            selected={meses}
                            onChange={setMeses}
                            placeholder="Selecione"
                            selectAllLabel="Selecionar todos"
                        />
                    </FilterField>

                    <FilterField label="Bimestre">
                        <FilterMultiSelect
                            options={BIMESTRES}
                            selected={bimestre}
                            onChange={setBimestre}
                            placeholder="Selecione"
                        />
                    </FilterField>
                </FilterSection>

                <FilterSection title="Local">
                    <FilterField label="Diretoria Regional de Educação (DRE)">
                        <FilterMultiSelect
                            options={dreOptions}
                            selected={dres}
                            onChange={(values) => {
                                setDres(values);
                                setUes([]);
                            }}
                            placeholder="Selecione"
                            selectAllLabel="Selecionar todas"
                        />
                    </FilterField>

                    <FilterField label="Unidade Educacional (UE)">
                        <FilterMultiSelect
                            options={ueOptions}
                            selected={ues}
                            onChange={setUes}
                            placeholder="Selecione"
                            selectAllLabel="Selecionar todas"
                        />
                    </FilterField>
                </FilterSection>

                <FilterSection title="Perfil">
                    <FilterField label="Gênero">
                        <Select value={genero} onValueChange={setGenero}>
                            <SelectTrigger
                                className={selectTriggerClass}
                                aria-label="Gênero"
                            >
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                {GENEROS.map((g) => (
                                    <SelectItem key={g.value} value={g.value}>
                                        {g.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FilterField>

                    <hr className="border-t border-[#DADADA] m-0 mt-2" />

                    <FilterField label="Etapa escolar">
                        <FilterMultiSelect
                            options={etapasOptions}
                            selected={etapas}
                            onChange={setEtapas}
                            placeholder="Selecione"
                            selectAllLabel="Selecionar todas"
                        />
                    </FilterField>

                    <hr className="border-t border-[#DADADA] m-0 mt-2" />

                    <FilterField label="Idade">
                        <input
                            type="number"
                            value={idade}
                            min={1}
                            max={menosDeUmAno ? 12 : undefined}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === "") {
                                    setIdade("");
                                    return;
                                }
                                const num = Number(val);
                                if (num < 1) return;
                                if (menosDeUmAno && num > 12) return;
                                setIdade(val);
                            }}
                            placeholder={
                                menosDeUmAno
                                    ? "Digite quantos meses..."
                                    : "Digite quantos anos..."
                            }
                            className="w-full rounded-[4px] border border-[#d9d9d9] bg-white px-3 py-2 text-[14px] text-[#595959] placeholder:text-[#a0a0a0] focus:outline-none focus:ring-1 focus:ring-[#5B78C7]"
                        />
                    </FilterField>

                    <div className="flex items-center gap-2">
                        <Switch
                            id="menos-de-um-ano"
                            checked={menosDeUmAno}
                            onCheckedChange={handleMenosDeUmAno}
                        />
                        <Label
                            htmlFor="menos-de-um-ano"
                            className="text-[#42474A] text-[14px] font-bold cursor-pointer"
                        >
                            Menos de 01 (um) ano
                            <p className="text-[#42474A] text-[12px] font-normal">
                                Ao ativar, a idade será informada em meses.
                            </p>
                        </Label>
                    </div>
                </FilterSection>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-[#f0f0f0] mt-auto">
                <Button
                    variant="customOutline"
                    className="w-full text-[14px] border-[#5B78C7] text-[#5B78C7] hover:bg-blue-50"
                    onClick={handleLimpar}
                    disabled={!temFiltroAtivo}
                >
                    Limpar tudo
                </Button>
            </div>
        </aside>
    );
}
