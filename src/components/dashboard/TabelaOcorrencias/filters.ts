import { normalizeText } from "@/lib/utils";
import { FiltrosValues } from "./Filtros";

export function parseDataHora(dataHora: string) {
    const [datePart] = dataHora.split(" - ");
    const [dd, mm, yyyy] = datePart.split("/");
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

export function mapStatusFilter(value: string) {
    if (!value) return "";
    const map: Record<string, string> = {
        incompleta: "Incompleta",
        "em-andamento": "Em andamento",
        finalizada: "Finalizada",
    };
    return map[value] ?? value;
}

export function matchPeriodo(
    itemDataHora: string,
    periodoInicial?: string,
    periodoFinal?: string
) {
    if (!periodoInicial && !periodoFinal) return true;
    const itemDate = parseDataHora(itemDataHora);
    const toLocalDateFromYMD = (ymd: string) => {
        const [yyyy, mm, dd] = ymd.split("-").map(Number);
        return new Date(yyyy, (mm || 1) - 1, dd || 1);
    };
    if (periodoInicial) {
        const start = toLocalDateFromYMD(periodoInicial);
        if (itemDate < start) return false;
    }
    if (periodoFinal) {
        const end = toLocalDateFromYMD(periodoFinal);
        end.setHours(23, 59, 59, 999);
        if (itemDate > end) return false;
    }
    return true;
}

export function matchCodigo(itemCodigo: string, codigoEol: string) {
    if (!codigoEol) return true;
    return itemCodigo.includes(codigoEol);
}

export function matchTipo(itemTipo: string, tipoViolencia: string) {
    if (!tipoViolencia) return true;
    return normalizeText(itemTipo).includes(normalizeText(tipoViolencia));
}

export function matchStatus(itemStatus: string, status: string) {
    const statusMapped = mapStatusFilter(status);
    if (!statusMapped) return true;
    return String(itemStatus) === statusMapped;
}

export function matchDre(itemDre: string, dre: string) {
    if (!dre) return true;
    return normalizeText(itemDre).includes(normalizeText(dre));
}

export function matchNomeUe(itemNomeUe: string, nomeUe: string) {
    if (!nomeUe) return true;
    return normalizeText(itemNomeUe).includes(normalizeText(nomeUe));
}

export function hasAnyFilter(filtros: FiltrosValues) {
    return Object.values(filtros).some(Boolean);
}
