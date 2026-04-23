import { CategoriasDisponiveisAPI } from "@/actions/categorias-disponiveis";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import Envolvidos from "./Envolvidos";
import { formSchema, InformacoesAdicionaisData } from "./schema";

const queryClient = new QueryClient();

const mockCategorias: CategoriasDisponiveisAPI = {
    motivo_ocorrencia: [{ label: "Bullying", value: "bullying" }],
    genero: [
        { label: "Masculino", value: "masculino" },
        { label: "Feminino", value: "feminino" },
    ],
    grupo_etnico_racial: [
        { label: "Branco", value: "branco" },
        { label: "Pardo", value: "pardo" },
    ],
    etapa_escolar: [
        { label: "Ensino Fundamental II", value: "ensino_fundamental_2" },
        { label: "Interdisciplinar", value: "interdisciplinar" },
    ],
    frequencia_escolar: [
        { label: "Regular", value: "regular" },
        { label: "Inferior a 50%", value: "inferior_50" },
    ],
};

const EMPTY_PESSOA = {
    nome: "",
    idade: "",
    genero: "",
    grupoEtnicoRacial: "",
    etapaEscolar: "",
    frequenciaEscolar: "",
    interacaoAmbienteEscolar: "",
    nacionalidade: "",
    pessoaComDeficiencia: "",
};

function Wrapper({
    defaultValues,
    disabled,
    startingQuestionNumber,
}: Readonly<{
    defaultValues?: InformacoesAdicionaisData["pessoasAgressoras"];
    disabled?: boolean;
    startingQuestionNumber?: number;
}>) {
    const form = useForm<InformacoesAdicionaisData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            pessoasAgressoras: defaultValues ?? [EMPTY_PESSOA],
            motivoOcorrencia: [],
            notificadoConselhoTutelar: undefined,
            acompanhadoNAAPA: undefined,
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <FormProvider {...form}>
                <form>
                    <Envolvidos
                        control={form.control}
                        disabled={disabled}
                        categoriasDisponiveis={mockCategorias}
                        startingQuestionNumber={startingQuestionNumber}
                    />
                </form>
            </FormProvider>
        </QueryClientProvider>
    );
}

describe("Envolvidos", () => {
    it("deve renderizar os campos de uma pessoa envolvida por padrão", () => {
        render(<Wrapper />);

        expect(
            screen.getAllByLabelText(/Qual o nome da pessoa\?/i),
        ).toHaveLength(1);
        expect(screen.getAllByLabelText(/Qual a idade\?/i)).toHaveLength(1);
        expect(screen.getAllByText(/Qual o gênero\?/i)).toHaveLength(1);
        expect(screen.getAllByText(/Raça\/cor auto declarada/i)).toHaveLength(
            1,
        );
        expect(screen.getAllByText(/Qual a etapa escolar\?/i)).toHaveLength(1);
        expect(
            screen.getAllByText(/Qual a frequência escolar\?/i),
        ).toHaveLength(1);
        expect(
            screen.getAllByText(/Como é a interação da pessoa no ambiente/i),
        ).toHaveLength(1);
    });

    it("deve renderizar o botão 'Adicionar pessoa'", () => {
        render(<Wrapper />);

        expect(
            screen.getByRole("button", { name: /Adicionar pessoa/i }),
        ).toBeInTheDocument();
    });

    it("deve adicionar novos campos ao clicar em 'Adicionar pessoa'", async () => {
        const user = userEvent.setup();
        render(<Wrapper />);

        const addButton = screen.getByRole("button", {
            name: /Adicionar pessoa/i,
        });
        await user.click(addButton);

        expect(
            screen.getAllByLabelText(/Qual o nome da pessoa\?/i),
        ).toHaveLength(2);
        expect(screen.getAllByLabelText(/Qual a idade\?/i)).toHaveLength(2);
    });

    it("deve remover campos ao clicar no botão de remover", async () => {
        const user = userEvent.setup();
        render(
            <Wrapper
                defaultValues={[
                    {
                        ...EMPTY_PESSOA,
                        nome: "João",
                        idade: "25",
                    },
                    {
                        ...EMPTY_PESSOA,
                        nome: "Maria",
                        idade: "30",
                    },
                ]}
            />,
        );

        expect(
            screen.getAllByLabelText(/Qual o nome da pessoa\?/i),
        ).toHaveLength(2);

        const removeButtons = screen.getAllByRole("button", {
            name: /Remover pessoa/i,
        });
        await user.click(removeButtons[0]);

        expect(
            screen.getAllByLabelText(/Qual o nome da pessoa\?/i),
        ).toHaveLength(1);
    });

    it("não deve exibir botão de remover quando há apenas uma pessoa", () => {
        render(<Wrapper />);

        expect(
            screen.queryByRole("button", { name: /Remover pessoa/i }),
        ).not.toBeInTheDocument();
    });

    it("deve desabilitar campos quando disabled=true", () => {
        render(<Wrapper disabled={true} />);

        const nomeInput = screen.getAllByLabelText(
            /Qual o nome da pessoa\?/i,
        )[0];
        const idadeInput = screen.getAllByLabelText(/Qual a idade\?/i)[0];
        const addButton = screen.getByRole("button", {
            name: /Adicionar pessoa/i,
        });

        expect(nomeInput).toBeDisabled();
        expect(idadeInput).toBeDisabled();
        expect(addButton).toBeDisabled();
    });

    it("deve preencher campos com valores iniciais do defaultValues", () => {
        render(
            <Wrapper
                defaultValues={[
                    {
                        nome: "Gabriel Araujo de Almeida",
                        idade: "14",
                        genero: "masculino",
                        grupoEtnicoRacial: "branco",
                        etapaEscolar: "ensino_fundamental_2",
                        frequenciaEscolar: "regular",
                        interacaoAmbienteEscolar:
                            "Boa interação com todos os colegas",
                    },
                ]}
            />,
        );

        const nomeInput = screen.getAllByLabelText(
            /Qual o nome da pessoa\?/i,
        )[0];
        const idadeInput = screen.getAllByLabelText(/Qual a idade\?/i)[0];

        expect(nomeInput).toHaveValue("Gabriel Araujo de Almeida");
        expect(idadeInput).toHaveValue(14);
    });

    it("deve definir min=0 e max=12 no input de idade ao ativar o switch de meses", async () => {
        const user = userEvent.setup();
        render(<Wrapper />);

        const idadeInput = screen.getAllByLabelText(/Qual a idade\?/i)[0];
        expect(idadeInput).toHaveAttribute("min", "1");
        expect(idadeInput).not.toHaveAttribute("max");

        const switchIdade = screen.getByRole("switch");
        await user.click(switchIdade);

        expect(idadeInput).toHaveAttribute("min", "0");
        expect(idadeInput).toHaveAttribute("max", "12");
    });

    describe("numeração de perguntas", () => {
        it("deve exibir prefixo '9.' no campo nome quando startingQuestionNumber=9", () => {
            render(<Wrapper startingQuestionNumber={9} />);

            expect(
                screen.getByText(/^9\. Qual o nome da pessoa\?\*/),
            ).toBeInTheDocument();
        });

        it("deve exibir prefixo '10.' no campo idade quando startingQuestionNumber=9", () => {
            render(<Wrapper startingQuestionNumber={9} />);

            expect(
                screen.getByText(/^10\. Qual a idade\?\*/),
            ).toBeInTheDocument();
        });

        it("deve exibir prefixo '17.' para campos da segunda pessoa (startingQuestionNumber=9, 2 pessoas)", async () => {
            const user = userEvent.setup();
            render(<Wrapper startingQuestionNumber={9} />);

            await user.click(
                screen.getByRole("button", { name: /Adicionar pessoa/i }),
            );

            const nomeLabels = screen.getAllByText(
                /\. Qual o nome da pessoa\?\*/,
            );
            expect(nomeLabels).toHaveLength(2);
            expect(nomeLabels[1]).toHaveTextContent(
                "18. Qual o nome da pessoa?*",
            );
        });

        it("não deve exibir prefixos quando startingQuestionNumber não é fornecido", () => {
            render(<Wrapper />);

            expect(
                screen.queryByText(/^\d+\. Qual o nome da pessoa/),
            ).not.toBeInTheDocument();
        });
    });
});
