/* eslint-disable jsx-a11y/alt-text */
import {
    Circle,
    Document,
    Image,
    Line,
    Page,
    Path,
    Rect,
    Svg,
    Text,
    View,
} from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { BIMESTRES, GENEROS, MESES, type FilterState } from "./FilterPanel";
import { resumoCards } from "./mockData";

const GRAY_DARK = "#42474A";
const GRAY_MID = "#595959";
const GRAY_LIGHT = "#E0E0E0";
const ICON_COLOR = "#5B78C7";
const PAGE_PADDING = 28;
const CONTENT_WIDTH = 595 - PAGE_PADDING * 2; // A4 width - padding

const SVG_SIZE = { width: 16, height: 16, viewBox: "0 0 24 24" };

const STROKE_PROPS = {
    fill: "none",
    stroke: ICON_COLOR,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

function PencilIcon() {
    return (
        <Svg {...SVG_SIZE}>
            <Path
                {...STROKE_PROPS}
                d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
            />
            <Path {...STROKE_PROPS} d="M15 5l4 4" />
        </Svg>
    );
}

function AlertCircleIcon() {
    return (
        <Svg {...SVG_SIZE}>
            <Circle {...STROKE_PROPS} cx="12" cy="12" r="10" />
            <Line {...STROKE_PROPS} x1="12" x2="12" y1="8" y2="12" />
            <Line {...STROKE_PROPS} x1="12" x2="12.01" y1="16" y2="16" />
        </Svg>
    );
}

function UsersIcon() {
    return (
        <Svg {...SVG_SIZE}>
            <Path
                {...STROKE_PROPS}
                d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
            />
            <Circle {...STROKE_PROPS} cx="9" cy="7" r="4" />
            <Path {...STROKE_PROPS} d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <Path {...STROKE_PROPS} d="M16 3.13a4 4 0 0 1 0 7.75" />
        </Svg>
    );
}

function CalendarIcon() {
    return (
        <Svg {...SVG_SIZE}>
            <Path {...STROKE_PROPS} d="M8 2v4" />
            <Path {...STROKE_PROPS} d="M16 2v4" />
            <Rect {...STROKE_PROPS} width="18" height="18" x="3" y="4" rx="2" />
            <Path {...STROKE_PROPS} d="M3 10h18" />
        </Svg>
    );
}

export interface CapturedImages {
    dre: string;
    statusUE: string;
    evolucaoMensal: string;
    tiposPatrimonial: string;
    tiposInterpessoal: string;
    motivacoes: string;
}

function displayList(
    values: string[],
    options: { value: string; label: string }[],
    plural: string,
): string {
    if (values.length === 0) return "Todos";
    if (values.length === 1) {
        return options.find((o) => o.value === values[0])?.label ?? values[0];
    }
    return `${values.length} ${plural}`;
}

function displayDres(dres: string[]): string {
    if (dres.length === 0) return "Todas";
    if (dres.length === 1) return "1 DRE selecionada";
    return `${dres.length} DREs selecionadas`;
}

function displayUes(ues: string[]): string {
    if (ues.length === 0) return "Todas";
    if (ues.length === 1) return "1 UE selecionada";
    return `${ues.length} UEs selecionadas`;
}

function buildEtapaLabel(etapas: string[]): string {
    if (etapas.length === 0) return "Todas";
    if (etapas.length === 1) return etapas[0];
    return `${etapas.length} selecionadas`;
}

function buildIdadeLabel(idade: string, menosDeUmAno: boolean): string {
    if (idade === "") return "Todas";
    if (menosDeUmAno) {
        return `${idade} ${idade === "1" ? "mês" : "meses"}`;
    }
    return `${idade} ${idade === "1" ? "ano" : "anos"}`;
}

function buildFiltrosDisplay(state: FilterState) {
    return {
        anoLetivo: state.ano,
        mes: displayList(state.meses, MESES, "meses"),
        bimestre: displayList(state.bimestre, BIMESTRES, "bimestres"),
        dre: displayDres(state.dres),
        ue: displayUes(state.ues),
        genero:
            state.genero === ""
                ? "Todos"
                : (GENEROS.find((g) => g.value === state.genero)?.label ??
                  "Todos"),
        etapaEscolar: buildEtapaLabel(state.etapas),
        idade: buildIdadeLabel(state.idade, state.menosDeUmAno),
    };
}

function SectionTitle({ children }: Readonly<{ children: string }>) {
    return (
        <Text
            style={{
                fontSize: 13,
                fontWeight: "bold",
                color: GRAY_DARK,
                marginBottom: 4,
            }}
        >
            {children}
        </Text>
    );
}

function SectionSubtitle({ children }: Readonly<{ children: string }>) {
    return (
        <Text style={{ fontSize: 9, color: GRAY_MID, marginBottom: 8 }}>
            {children}
        </Text>
    );
}

function FiltroCell({
    label,
    value,
}: Readonly<{ label: string; value: string }>) {
    return (
        <View style={{ flex: 1, paddingVertical: 4, paddingHorizontal: 4 }}>
            <Text style={{ fontSize: 8, color: GRAY_MID, marginBottom: 1 }}>
                {label}
            </Text>
            <Text style={{ fontSize: 9, color: GRAY_DARK, fontWeight: "bold" }}>
                {value}
            </Text>
        </View>
    );
}

function VDivider() {
    return <View style={{ width: 1, backgroundColor: "#fff" }} />;
}

function PageNumber({
    total,
    current,
}: Readonly<{ total: number; current: number }>) {
    return (
        <Text
            style={{
                position: "absolute",
                bottom: 16,
                right: PAGE_PADDING,
                fontSize: 8,
                color: GRAY_MID,
            }}
        >
            {current}/{total}
        </Text>
    );
}

const PAGE_STYLE = {
    paddingHorizontal: PAGE_PADDING,
    paddingVertical: 24,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
} as const;

// --- Página 1: Filtros + Cards + DRE ---

function Pagina1({
    filtros,
    images,
}: Readonly<{
    filtros: ReturnType<typeof buildFiltrosDisplay>;
    images: CapturedImages;
}>) {
    return (
        <Page size="A4" style={PAGE_STYLE}>
            {/* Cabeçalho */}
            <View style={{ marginBottom: 10 }}>
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: GRAY_DARK,
                    }}
                >
                    Extração de dados
                </Text>
                <Text style={{ fontSize: 9, color: GRAY_MID, marginTop: 2 }}>
                    Confira todas as intercorrências registradas no sistema e
                    exporte os dados em PDF de forma rápida e prática.
                </Text>
            </View>

            {/* Filtros aplicados */}
            <View
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 4,
                    padding: 12,
                    marginBottom: 8,
                    border: `1px solid ${GRAY_LIGHT}`,
                }}
            >
                <Text
                    style={{
                        fontSize: 11,
                        fontWeight: "bold",
                        color: GRAY_DARK,
                        marginBottom: 8,
                    }}
                >
                    Filtros aplicados:
                </Text>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: GRAY_LIGHT,
                        borderRadius: 2,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            borderBottomWidth: 1,
                            borderColor: GRAY_LIGHT,
                        }}
                    >
                        <FiltroCell
                            label="Ano letivo:"
                            value={filtros.anoLetivo}
                        />
                        <VDivider />
                        <FiltroCell label="Mês:" value={filtros.mes} />
                        <VDivider />
                        <FiltroCell
                            label="Bimestre:"
                            value={filtros.bimestre}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            borderBottomWidth: 1,
                            borderColor: GRAY_LIGHT,
                        }}
                    >
                        <FiltroCell label="DRE:" value={filtros.dre} />
                        <VDivider />
                        <FiltroCell
                            label="Unidade Educacional:"
                            value={filtros.ue}
                        />
                        <VDivider />
                        <FiltroCell label="Gênero:" value={filtros.genero} />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <FiltroCell
                            label="Etapa escolar:"
                            value={filtros.etapaEscolar}
                        />
                        <VDivider />
                        <FiltroCell label="Idade:" value={filtros.idade} />
                    </View>
                </View>
            </View>

            {/* Dashboard analítico — cards */}
            <View
                style={{
                    backgroundColor: "#fff",
                    borderRadius: 4,
                    padding: 12,
                    marginBottom: 8,
                    border: `1px solid ${GRAY_LIGHT}`,
                }}
            >
                <SectionTitle>
                    Dashboard analítico de intercorrências
                </SectionTitle>
                <SectionSubtitle>
                    Tenha um resumo rápido de alguns indicadores do sistema,
                    facilitando o acompanhamento e a análise.
                </SectionSubtitle>
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 8,
                    }}
                >
                    {(
                        [
                            {
                                label: "Total de intercorrências:",
                                value: resumoCards.totalIntercorrencias,
                                icon: <PencilIcon />,
                            },
                            {
                                label: "Intercorrências patrimoniais:",
                                value: resumoCards.intercorrenciasPatrimoniais,
                                icon: <AlertCircleIcon />,
                            },
                            {
                                label: "Intercorrências interpessoais:",
                                value: resumoCards.intercorrenciasInterpessoais,
                                icon: <UsersIcon />,
                            },
                            {
                                label: "Média de registros por mês:",
                                value: resumoCards.mediaMensal,
                                icon: <CalendarIcon />,
                            },
                        ] as { label: string; value: number; icon: ReactNode }[]
                    ).map(({ label, value, icon }) => (
                        <View
                            key={label}
                            style={{
                                width: "48.5%",
                                height: 32,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                                borderWidth: 1,
                                borderColor: GRAY_LIGHT,
                                borderRadius: 4,
                                paddingHorizontal: 8,
                                backgroundColor: "#fff",
                            }}
                        >
                            {icon}
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: GRAY_MID,
                                }}
                            >
                                {label}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: "bold",
                                    color: GRAY_DARK,
                                }}
                            >
                                {value}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Gráfico DRE — imagem capturada do recharts */}
            <View
                style={{
                    width: CONTENT_WIDTH,
                    borderWidth: 1,
                    borderColor: GRAY_LIGHT,
                    borderRadius: 4,
                }}
            >
                <Image src={images.dre} />
            </View>

            <PageNumber total={4} current={1} />
        </Page>
    );
}

// --- Página 2: StatusUE + Evolução Mensal ---

function Pagina2({ images }: Readonly<{ images: CapturedImages }>) {
    return (
        <Page size="A4" style={PAGE_STYLE}>
            <View
                style={{
                    width: CONTENT_WIDTH,
                    borderWidth: 1,
                    borderColor: GRAY_LIGHT,
                    borderRadius: 4,
                    marginBottom: 8,
                }}
            >
                <Image src={images.statusUE} />
            </View>
            <View
                style={{
                    width: CONTENT_WIDTH,
                    borderWidth: 1,
                    borderColor: GRAY_LIGHT,
                    borderRadius: 4,
                }}
            >
                <Image src={images.evolucaoMensal} />
            </View>
            <PageNumber total={4} current={2} />
        </Page>
    );
}

// --- Página 3: Tipos de Intercorrências ---

function Pagina3({ images }: Readonly<{ images: CapturedImages }>) {
    return (
        <Page size="A4" style={PAGE_STYLE}>
            <View style={{ marginBottom: 10 }}>
                <SectionTitle>Gráfico por tipo de intercorrências</SectionTitle>
                <SectionSubtitle>
                    Confira a quantidade de registros por tipo de
                    intercorrência, patrimonial ou interpessoal.
                </SectionSubtitle>
            </View>

            <View
                style={{
                    width: CONTENT_WIDTH,
                    borderWidth: 1,
                    borderColor: GRAY_LIGHT,
                    borderRadius: 4,
                    marginBottom: 8,
                }}
            >
                <Image src={images.tiposPatrimonial} />
            </View>
            <View
                style={{
                    width: CONTENT_WIDTH,
                    borderWidth: 1,
                    borderColor: GRAY_LIGHT,
                    borderRadius: 4,
                }}
            >
                <Image src={images.tiposInterpessoal} />
            </View>

            <PageNumber total={4} current={3} />
        </Page>
    );
}

// --- Página 4: Motivações ---

function Pagina4({ images }: Readonly<{ images: CapturedImages }>) {
    return (
        <Page size="A4" style={PAGE_STYLE}>
            <View
                style={{
                    width: CONTENT_WIDTH,
                    borderWidth: 1,
                    borderColor: GRAY_LIGHT,
                    borderRadius: 4,
                }}
            >
                <Image src={images.motivacoes} />
            </View>

            <PageNumber total={4} current={4} />
        </Page>
    );
}

export default function ExportacaoPDF({
    filterState,
    images,
}: Readonly<{ filterState: FilterState; images: CapturedImages }>) {
    const filtros = buildFiltrosDisplay(filterState);

    return (
        <Document>
            <Pagina1 filtros={filtros} images={images} />
            <Pagina2 images={images} />
            <Pagina3 images={images} />
            <Pagina4 images={images} />
        </Document>
    );
}
