import { Ocorrencia } from "./columns";

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
        const protocolo = `PRT-${String(i).padStart(3, "0")}-2023`;
        const dataHora = `2023-10-${String(30 - (i % 30)).padStart(
            2,
            "0"
        )} ${String(8 + (i % 10)).padStart(2, "0")}:00`;
        const codigoEol = String(10000 + i);
        const tipoViolencia = randomFrom(tipos);
        const status = randomFrom(statuses) as Ocorrencia["status"];

        items.push({
            id,
            protocolo,
            dataHora,
            codigoEol,
            tipoViolencia,
            status,
        });
    }

    return items;
}
