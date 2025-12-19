
import { UnidadeEducacional } from "@/types/unidades";
export const mockUnidades: UnidadeEducacional[] = [
    {
        id: 1,
        nome: "Unidade 1",
        tipo_unidade: "Tipo A",
        rede_label: "Rede Pública",
        codigo_eol: "EOL001",
        dre_nome: "DR 1",
        sigla: "DRE1",
        uuid: "uuid-1",
        status: 'Ativa',
    },
    {
        id: 2,
        nome: "Unidade 2",
        tipo_unidade: "Tipo B",
        rede_label: "Rede Privada",
        codigo_eol: "EOL002",
        dre_nome: "DR 2",
        sigla: "DRE2",
        uuid: "uuid-2",
        status: 'Inativa',
    },
];
