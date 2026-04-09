// Dados mockados para o Dashboard Analítico de Intercorrências
// Substitua por chamadas reais ao backend no futuro

export const resumoCards = {
    totalIntercorrencias: 500,
    intercorrenciasPatrimoniais: 260,
    intercorrenciasInterpessoais: 240,
    mediaMensal: 42,
};

export const DRE_CORES: Record<string, string> = {
    "DRE Butantã": "#3d4eb0",
    "DRE Campo Limpo": "#e06c2e",
    "DRE Capela do Socorro": "#3aaa5a",
    "DRE Freguesia/Brasilândia": "#8a3db0",
    "DRE Guaianases": "#3daab0",
    "DRE Ipiranga": "#e0b820",
    "DRE Itaquera": "#6ab04c",
    "DRE Jaçanã/Tremembé": "#7d5a3c",
    "DRE Penha": "#b0526e",
    "DRE Pirituba/Jaraguá": "#7a8a9a",
    "DRE Santo Amaro": "#c8a42a",
    "DRE São Mateus": "#2aa48a",
    "DRE São Miguel": "#9a5ab0",
};

export interface DreDado {
    nome: string;
    total: number;
    patrimonial: number;
    interpessoal: number;
    cor: string;
}

export const dreData: DreDado[] = [
    {
        nome: "DRE Butantã",
        total: 50,
        patrimonial: 23,
        interpessoal: 27,
        cor: "#3d4eb0",
    },
    {
        nome: "DRE Campo Limpo",
        total: 10,
        patrimonial: 9,
        interpessoal: 1,
        cor: "#e06c2e",
    },
    {
        nome: "DRE Capela do Socorro",
        total: 10,
        patrimonial: 10,
        interpessoal: 0,
        cor: "#3aaa5a",
    },
    {
        nome: "DRE Freguesia/Brasilândia",
        total: 50,
        patrimonial: 41,
        interpessoal: 9,
        cor: "#8a3db0",
    },
    {
        nome: "DRE Guaianases",
        total: 10,
        patrimonial: 10,
        interpessoal: 0,
        cor: "#3daab0",
    },
    {
        nome: "DRE Ipiranga",
        total: 20,
        patrimonial: 16,
        interpessoal: 4,
        cor: "#e0b820",
    },
    {
        nome: "DRE Itaquera",
        total: 50,
        patrimonial: 32,
        interpessoal: 18,
        cor: "#6ab04c",
    },
    {
        nome: "DRE Jaçanã/Tremembé",
        total: 5,
        patrimonial: 5,
        interpessoal: 0,
        cor: "#7d5a3c",
    },
    {
        nome: "DRE Penha",
        total: 10,
        patrimonial: 8,
        interpessoal: 2,
        cor: "#b0526e",
    },
    {
        nome: "DRE Pirituba/Jaraguá",
        total: 10,
        patrimonial: 9,
        interpessoal: 1,
        cor: "#7a8a9a",
    },
    {
        nome: "DRE Santo Amaro",
        total: 50,
        patrimonial: 26,
        interpessoal: 24,
        cor: "#c8a42a",
    },
    {
        nome: "DRE São Mateus",
        total: 20,
        patrimonial: 13,
        interpessoal: 7,
        cor: "#2aa48a",
    },
    {
        nome: "DRE São Miguel",
        total: 0,
        patrimonial: 0,
        interpessoal: 0,
        cor: "#9a5ab0",
    },
];

export interface StatusUEDado {
    label: string;
    sublabel: string;
    total: number;
    patrimonial: number;
    interpessoal: number;
    cor: string;
}

export const statusUEData: StatusUEDado[] = [
    {
        label: "Intercorrências em andamento",
        sublabel: "em andamento",
        total: 35,
        patrimonial: 15,
        interpessoal: 20,
        cor: "#3d4eb0",
    },
    {
        label: "Intercorrências incompletas",
        sublabel: "incompletas",
        total: 2,
        patrimonial: 2,
        interpessoal: 0,
        cor: "#e06c2e",
    },
    {
        label: "Intercorrências finalizadas",
        sublabel: "finalizadas",
        total: 15,
        patrimonial: 12,
        interpessoal: 3,
        cor: "#3aaa5a",
    },
    {
        label: "Intercorrências migradas",
        sublabel: "migradas",
        total: 102,
        patrimonial: 85,
        interpessoal: 17,
        cor: "#7a8a9a",
    },
];

export interface EvolucaoMensalDado {
    mes: string;
    mesLabel: string;
    total: number;
    patrimonial: number;
    interpessoal: number;
}

export const evolucaoMensalData: EvolucaoMensalDado[] = [
    {
        mes: "Jan",
        mesLabel: "Janeiro",
        total: 0,
        patrimonial: 0,
        interpessoal: 0,
    },
    {
        mes: "Fev",
        mesLabel: "Fevereiro",
        total: 1,
        patrimonial: 1,
        interpessoal: 0,
    },
    {
        mes: "Mar",
        mesLabel: "Março",
        total: 15,
        patrimonial: 8,
        interpessoal: 7,
    },
    {
        mes: "Abr",
        mesLabel: "Abril",
        total: 25,
        patrimonial: 19,
        interpessoal: 6,
    },
    {
        mes: "Mai",
        mesLabel: "Maio",
        total: 10,
        patrimonial: 8,
        interpessoal: 2,
    },
    {
        mes: "Jun",
        mesLabel: "Junho",
        total: 0,
        patrimonial: 0,
        interpessoal: 0,
    },
    {
        mes: "Jul",
        mesLabel: "Julho",
        total: 0,
        patrimonial: 0,
        interpessoal: 0,
    },
    {
        mes: "Ago",
        mesLabel: "Agosto",
        total: 10,
        patrimonial: 9,
        interpessoal: 1,
    },
    {
        mes: "Set",
        mesLabel: "Setembro",
        total: 20,
        patrimonial: 18,
        interpessoal: 2,
    },
    {
        mes: "Out",
        mesLabel: "Outubro",
        total: 45,
        patrimonial: 25,
        interpessoal: 18,
    },
    {
        mes: "Nov",
        mesLabel: "Novembro",
        total: 20,
        patrimonial: 6,
        interpessoal: 14,
    },
    {
        mes: "Dez",
        mesLabel: "Dezembro",
        total: 2,
        patrimonial: 1,
        interpessoal: 1,
    },
];

export interface TipoIntercorrenciaDado {
    tipo: string;
    count: number;
}

export const tiposPatrimonialData: TipoIntercorrenciaDado[] = [
    { tipo: "Furto no\nestabelecimento", count: 99 },
    { tipo: "Depredação ou\nvandalismo", count: 29 },
    { tipo: "Roubo", count: 58 },
    { tipo: "Furto", count: 22 },
    { tipo: "Invasão", count: 86 },
    { tipo: "Ocorrências\ncom veículos", count: 6 },
    { tipo: "Desaparecimento\ncom objeto\nsem ameaça", count: 1 },
    { tipo: "Ocorrência\ncom câmera\nsmart campus", count: 2 },
    { tipo: "Outras", count: 7 },
];

export const tiposInterpessoalData: TipoIntercorrenciaDado[] = [
    { tipo: "Agressão física", count: 9 },
    { tipo: "Ameaça interna", count: 29 },
    { tipo: "Ameaça externa", count: 4 },
    { tipo: "Ataque violento", count: 23 },
    { tipo: "Deserte-\nncimento", count: 6 },
    { tipo: "Ocorrência\ncom objeto\nsem ameaça", count: 1 },
    { tipo: "Suicídio ou\nhomicídio", count: 2 },
    { tipo: "Outras", count: 7 },
];

export interface MotivacaoData {
    motivacao: string;
    count: number;
}

export const motivacoesData: MotivacaoData[] = [
    { motivacao: "Bullying", count: 22 },
    { motivacao: "Cyberbullying", count: 28 },
    { motivacao: "Envolvimento com atividades ilícitas", count: 4 },
    { motivacao: "Bullying/Homofobia", count: 6 },
    {
        motivacao:
            "Ideologias extremistas (fascismo, racismo, discurso de ódio)",
        count: 2,
    },
    { motivacao: "Bullying/Misoginia", count: 1 },
    { motivacao: "Bullying/Machismo", count: 43 },
    { motivacao: "Bullying/Racismo", count: 35 },
    { motivacao: "Violência de Gênero", count: 24 },
    { motivacao: "Bullying/Capacitismo", count: 14 },
    { motivacao: "Relações afetivas", count: 50 },
    { motivacao: "Uso de drogas", count: 5 },
    { motivacao: "Uso de álcool", count: 38 },
    { motivacao: "Vingança", count: 3 },
    { motivacao: "Bullying/Xenofobia", count: 8 },
    { motivacao: "Outros", count: 1 },
];
