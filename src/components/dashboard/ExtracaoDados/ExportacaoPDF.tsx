import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { BIMESTRES, GENEROS, MESES, type FilterState } from "./FilterPanel";
import { resumoCards } from "./mockData";

// â”€â”€â”€ Paleta / constantes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const GRAY_DARK = "#42474A";
const GRAY_MID = "#595959";
const GRAY_LIGHT = "#E0E0E0";
const PAGE_PADDING = 28;
const CONTENT_WIDTH = 595 - PAGE_PADDING * 2; // A4 width - padding

// â”€â”€â”€ Tipo das imagens capturadas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface CapturedImages {
    dre: string;
    statusUE: string;
    evolucaoMensal: string;
    tiposPatrimonial: string;
    tiposInterpessoal: string;
    motivacoes: string;
}

// â”€â”€â”€ Helpers de display dos filtros â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
        return `${idade} ${idade === "1" ? "mÃªs" : "meses"}`;
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

// â”€â”€â”€ Componentes primitivos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    return <View style={{ width: 1, backgroundColor: GRAY_LIGHT }} />;
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
    backgroundColor: "#F5F6F8",
} as const;

// â”€â”€â”€ PÃ¡gina 1: Filtros + Cards + DRE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Pagina1({
    filtros,
    images,
}: Readonly<{
    filtros: ReturnType<typeof buildFiltrosDisplay>;
    images: CapturedImages;
}>) {
    return (
        <Page size="A4" style={PAGE_STYLE}>
            {/* CabeÃ§alho */}
            <View style={{ marginBottom: 10 }}>
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: GRAY_DARK,
                    }}
                >
                    ExtraÃ§Ã£o de dados
                </Text>
                <Text style={{ fontSize: 9, color: GRAY_MID, marginTop: 2 }}>
                    Confira todas as intercorrÃªncias registradas no sistema e
                    exporte os dados em PDF de forma rÃ¡pida e prÃ¡tica.
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
                        <FiltroCell label="MÃªs:" value={filtros.mes} />
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
                        <FiltroCell label="GÃªnero:" value={filtros.genero} />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <FiltroCell
                            label="Etapa escolar:"
                            value={filtros.etapaEscolar}
                        />
                        <VDivider />
                        <FiltroCell label="Idade:" value={filtros.idade} />
                        <View style={{ flex: 1 }} />
                    </View>
                </View>
            </View>

            {/* Dashboard analÃ­tico â€” cards */}
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
                    Dashboard analÃ­tico de intercorrÃªncias
                </SectionTitle>
                <SectionSubtitle>
                    Tenha um resumo rÃ¡pido de alguns indicadores do sistema,
                    facilitando o acompanhamento e a anÃ¡lise.
                </SectionSubtitle>
                <View style={{ flexDirection: "row", gap: 8 }}>
                    {[
                        {
                            label: "Total de intercorrÃªncias:",
                            value: resumoCards.totalIntercorrencias,
                        },
                        {
                            label: "IntercorrÃªncias patrimoniais:",
                            value: resumoCards.intercorrenciasPatrimoniais,
                        },
                        {
                            label: "IntercorrÃªncias interpessoais:",
                            value: resumoCards.intercorrenciasInterpessoais,
                        },
                        {
                            label: "MÃ©dia de registros por mÃªs:",
                            value: resumoCards.mediaMensal,
                        },
                    ].map(({ label, value }) => (
                        <View
                            key={label}
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: GRAY_LIGHT,
                                borderRadius: 4,
                                padding: 8,
                                backgroundColor: "#fff",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 8,
                                    color: GRAY_MID,
                                    marginBottom: 6,
                                }}
                            >
                                {label}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
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

            {/* GrÃ¡fico DRE â€” imagem capturada do recharts */}
            <Image src={images.dre} style={{ width: CONTENT_WIDTH }} />

            <PageNumber total={4} current={1} />
        </Page>
    );
}

// â”€â”€â”€ PÃ¡gina 2: StatusUE + EvoluÃ§Ã£o Mensal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Pagina2({ images }: Readonly<{ images: CapturedImages }>) {
    return (
        <Page size="A4" style={PAGE_STYLE}>
            <Image
                src={images.statusUE}
                style={{ width: CONTENT_WIDTH, marginBottom: 8 }}
            />
            <Image
                src={images.evolucaoMensal}
                style={{ width: CONTENT_WIDTH }}
            />
            <PageNumber total={4} current={2} />
        </Page>
    );
}

// â”€â”€â”€ PÃ¡gina 3: Tipos de IntercorrÃªncias â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Pagina3({ images }: Readonly<{ images: CapturedImages }>) {
    return (
        <Page size="A4" style={PAGE_STYLE}>
            <View style={{ marginBottom: 10 }}>
                <SectionTitle>
                    GrÃ¡fico por tipo de intercorrÃªncias
                </SectionTitle>
                <SectionSubtitle>
                    Confira a quantidade de registros por tipo de
                    intercorrÃªncia, patrimonial ou interpessoal.
                </SectionSubtitle>
            </View>

            <Image
                src={images.tiposPatrimonial}
                style={{ width: CONTENT_WIDTH, marginBottom: 8 }}
            />
            <Image
                src={images.tiposInterpessoal}
                style={{ width: CONTENT_WIDTH }}
            />

            <PageNumber total={4} current={3} />
        </Page>
    );
}

// â”€â”€â”€ PÃ¡gina 4: MotivaÃ§Ãµes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Pagina4({ images }: Readonly<{ images: CapturedImages }>) {
    return (
        <Page size="A4" style={PAGE_STYLE}>
            <View style={{ marginBottom: 10 }}>
                <SectionTitle>GrÃ¡fico por motivaÃ§Ã£o</SectionTitle>
                <SectionSubtitle>
                    Confira a quantidade de registros cadastrados por motivo de
                    intercorrÃªncias.
                </SectionSubtitle>
            </View>

            <Image src={images.motivacoes} style={{ width: CONTENT_WIDTH }} />

            <Text
                style={{
                    fontSize: 7,
                    color: GRAY_MID,
                    marginTop: 8,
                    fontStyle: "italic",
                }}
            >
                *(facista, nazista, discurso de Ã³dio)
            </Text>

            <PageNumber total={4} current={4} />
        </Page>
    );
}

// â”€â”€â”€ Documento principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
