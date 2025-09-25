import { Ocorrencia } from "./useOcorrenciasColumns";

const tipos = [
    "Ocorrência com objeto sem ameaça (arma de fogo, arma branca, etc)",
];

const statuses = ["Incompleta", "Finalizada", "Em andamento"] as const;

function randomFrom<T>(arr: readonly T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export async function getData(): Promise<Ocorrencia[]> {
    const items: Ocorrencia[] = [];
    for (let i = 1; i <= 50; i++) {
        const id = Math.random().toString(36).slice(2, 10);
        const protocolo = `PRT-${String(i).padStart(3, "0")}-2025`;
        const day = String(30 - (i % 30)).padStart(2, "0");
        const month = String(10).padStart(2, "0");
        const year = "2025";
        const hour = String(8 + (i % 10)).padStart(2, "0");
        const minutes = "00";
        const dataHora = `${day}/${month}/${year} - ${hour}:${minutes}`;
        const codigoEol = String(10000 + i);
        const tipoViolencia = randomFrom(tipos);
        const status = randomFrom(statuses);
        const dre = `DRE-${String.fromCharCode(65 + (i % 10))}`;
        const nomeUe = `ESCOLA MUNICIPAL ${i}`;

        items.push({
            id,
            protocolo,
            dataHora,
            codigoEol,
            dre,
            nomeUe,
            tipoViolencia,
            status,
        });
    }

    return items;
}
