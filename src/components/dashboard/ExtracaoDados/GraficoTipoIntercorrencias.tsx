"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    motivacoesData,
    tiposInterpessoalData,
    tiposPatrimonialData,
} from "./mockData";

const TIPO_COR_PALETTE = [
    "#3d4eb0",
    "#e06c2e",
    "#6ab04c",
    "#8a3db0",
    "#3daab0",
    "#e0b820",
    "#b0526e",
    "#7a8a9a",
    "#c8a42a",
    "#2aa48a",
];

interface BarLabelProps {
    readonly x?: number;
    readonly y?: number;
    readonly width?: number;
    readonly value?: number;
}

function BarLabel({ x = 0, y = 0, width = 0, value = 0 }: BarLabelProps) {
    if (value === 0) return null;
    return (
        <text
            x={x + width / 2}
            y={y - 4}
            textAnchor="middle"
            fontSize={11}
            fill="#595959"
        >
            {String(value).padStart(2, "0")}
        </text>
    );
}

interface CustomXAxisTickProps {
    readonly x?: number;
    readonly y?: number;
    readonly payload?: { value: string };
}

const MAX_CHARS_PER_LINE = 12;

function CustomXAxisTick({ x = 0, y = 0, payload }: CustomXAxisTickProps) {
    if (!payload) return null;
    const words = payload.value.replaceAll("\n", " ").split(" ");
    const lines: string[] = [];
    let current = "";

    for (const word of words) {
        const test = current ? `${current} ${word}` : word;
        if (test.length > MAX_CHARS_PER_LINE && current) {
            lines.push(current);
            current = word;
        } else {
            current = test;
        }
    }
    if (current) lines.push(current);

    return (
        <text x={x} y={y + 10} textAnchor="middle" fontSize={14} fill="#595959">
            {lines.map((line, i) => (
                <tspan key={`${x}-${i}`} x={x} dy={i === 0 ? 0 : 14}>
                    {line}
                </tspan>
            ))}
        </text>
    );
}

interface TooltipColunasProps {
    readonly active?: boolean;
    readonly payload?: { value: number }[];
    readonly label?: string;
}

function TooltipColunas({ active, payload, label }: TooltipColunasProps) {
    if (!active || !payload?.length) return null;
    const tipo = String(label ?? "").replaceAll("\n", " ");
    const count = payload[0].value;
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: "4px",
                padding: "8px",
            }}
        >
            <p
                style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#42474A",
                    margin: 0,
                }}
            >
                {tipo}:
            </p>
            <p
                style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#42474A",
                    margin: 0,
                }}
            >
                {String(count).padStart(2, "0")} intercorrências
            </p>
        </div>
    );
}

function GraficoColunasVertical({
    data,
}: Readonly<{
    data: { tipo: string; count: number }[];
}>) {
    return (
        <div className="flex flex-col gap-3">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 8, left: 0, bottom: 10 }}
                    barCategoryGap="10%"
                    barSize={90}
                >
                    <XAxis
                        dataKey="tipo"
                        tick={<CustomXAxisTick />}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        height={70}
                        label={{
                            value: "Tipo de intercorrências",
                            position: "insideBottom",
                            offset: -5,
                            style: {
                                fontSize: 14,
                                fill: "#595959",
                                textAnchor: "middle",
                                fontWeight: "bold",
                            },
                        }}
                    />
                    <YAxis
                        tick={{ fontSize: 14, fill: "#595959" }}
                        axisLine={{ stroke: "#DADADA" }}
                        tickLine={false}
                        allowDecimals={false}
                        width={90}
                        label={{
                            value: "Quantidade de intercorrências",
                            angle: -90,
                            position: "insideLeft",
                            style: {
                                fontSize: 14,
                                fill: "#595959",
                                textAnchor: "middle",
                                fontWeight: "bold",
                            },
                        }}
                    />
                    <CartesianGrid
                        horizontal={true}
                        vertical={false}
                        stroke="#EBEBEB"
                        strokeDasharray=""
                    />
                    <Tooltip
                        content={<TooltipColunas />}
                        cursor={{ fill: "rgba(0,0,0,0.04)" }}
                    />
                    <Bar
                        dataKey="count"
                        radius={[2, 2, 0, 0]}
                        label={<BarLabel />}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${entry.tipo}`}
                                fill={
                                    TIPO_COR_PALETTE[
                                        index % TIPO_COR_PALETTE.length
                                    ]
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function GraficoMotivacoes() {
    const maxCount = Math.max(...motivacoesData.map((d) => d.count));

    return (
        <div className="flex flex-col gap-3 mt-4">
            <div>
                <h3 className="text-[#42474a] text-[16px] font-bold">
                    Gráfico por motivação
                </h3>
                <p className="text-[#42474a] text-[14px] mt-1">
                    Confira a quantidade de registros cadastrados por motivo de
                    intercorrências.
                </p>
            </div>
            <ResponsiveContainer
                width="100%"
                height={motivacoesData.length * 48}
            >
                <BarChart
                    layout="vertical"
                    data={motivacoesData}
                    margin={{ top: 0, right: 60, left: 8, bottom: 0 }}
                    barCategoryGap="10%"
                    barSize={36}
                >
                    <XAxis
                        type="number"
                        domain={[0, maxCount + 5]}
                        tick={{ fontSize: 14, fill: "#595959" }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="motivacao"
                        tick={{ fontSize: 14, fill: "#595959" }}
                        axisLine={false}
                        tickLine={false}
                        width={280}
                    />
                    <CartesianGrid
                        horizontal={false}
                        vertical={true}
                        stroke="#DADADA"
                        strokeDasharray="4 4"
                    />
                    <Tooltip
                        content={<TooltipColunas />}
                        cursor={{ fill: "rgba(0,0,0,0.04)" }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {motivacoesData.map((entry, index) => (
                            <Cell
                                key={`cell-mot-${entry.motivacao}`}
                                fill={
                                    TIPO_COR_PALETTE[
                                        index % TIPO_COR_PALETTE.length
                                    ]
                                }
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function GraficoTipoIntercorrencias() {
    return (
        <div className="bg-white rounded-[4px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.12)] p-6 flex flex-col gap-4">
            <div>
                <h2 className="text-[#42474a] text-[20px] font-bold">
                    Gráfico por tipo de intercorrências
                </h2>
                <p className="text-[#42474a] text-[14px] mt-1">
                    Confira a quantidade de registros por tipo de
                    intercorrência, patrimonial ou interpessoal.
                </p>
            </div>

            <Tabs defaultValue="patrimonial">
                <TabsList className="bg-transparent border-b border-[#DADADA] rounded-none h-auto p-0 w-full justify-start gap-0">
                    <TabsTrigger
                        value="patrimonial"
                        className={cn(
                            "rounded-tl-[4px] rounded-tr-[4px] rounded-bl-none rounded-br-none shadow-none px-4 text-[14px] relative -mb-px h-[48px]",
                            "data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-b-0 data-[state=active]:border-[#DADADA] data-[state=active]:text-[#717FC7] data-[state=active]:font-bold data-[state=active]:shadow-none",
                            "data-[state=inactive]:bg-[#FAFAFA] data-[state=inactive]:border data-[state=inactive]:border-[#DADADA] data-[state=inactive]:text-[#42474A] data-[state=inactive]:font-normal",
                        )}
                    >
                        Intercorrências patrimoniais
                    </TabsTrigger>
                    <TabsTrigger
                        value="interpessoal"
                        className={cn(
                            "rounded-tl-[4px] rounded-tr-[4px] rounded-bl-none rounded-br-none shadow-none px-4 text-[14px] relative -mb-px ml-[2px] h-[48px]",
                            "data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-b-0 data-[state=active]:border-[#DADADA] data-[state=active]:text-[#717FC7] data-[state=active]:font-bold data-[state=active]:shadow-none",
                            "data-[state=inactive]:bg-[#FAFAFA] data-[state=inactive]:border data-[state=inactive]:border-[#DADADA] data-[state=inactive]:text-[#42474A] data-[state=inactive]:font-normal",
                        )}
                    >
                        Intercorrências interpessoais
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="patrimonial" className="mt-4">
                    <GraficoColunasVertical data={tiposPatrimonialData} />
                </TabsContent>

                <TabsContent
                    value="interpessoal"
                    className="mt-4 flex flex-col gap-6"
                >
                    <GraficoColunasVertical data={tiposInterpessoalData} />
                    <GraficoMotivacoes />
                </TabsContent>
            </Tabs>
        </div>
    );
}
