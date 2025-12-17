
import { UnidadeEducacional } from "@/types/unidades";
export const mockUnidades: UnidadeEducacional[] = [
    {
        id: 1,
        nome: "Unidade 1",
        tipo: "Tipo A",
        rede: "Rede Pública",
        codigo_eol: "EOL001",
        dre: "DR 1",
        sigla_dre: "DRE1",
        uuid: "uuid-1",
        status: 'Ativa',
    },
    {
        id: 2,
        nome: "Unidade 2",
        tipo: "Tipo B",
        rede: "Rede Privada",
        codigo_eol: "EOL002",
        dre: "DR 2",
        sigla_dre: "DRE2",
        uuid: "uuid-2",
        status: 'Inativa',
    },
];
