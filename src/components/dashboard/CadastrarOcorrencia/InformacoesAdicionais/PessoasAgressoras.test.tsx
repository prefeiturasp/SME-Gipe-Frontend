import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import PessoasAgressoras from "./PessoasAgressoras";
import { formSchema, InformacoesAdicionaisData } from "./schema";

const queryClient = new QueryClient();

function Wrapper({
    defaultValues,
    disabled,
}: Readonly<{
    defaultValues?: InformacoesAdicionaisData["pessoasAgressoras"];
    disabled?: boolean;
}>) {
    const form = useForm<InformacoesAdicionaisData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            pessoasAgressoras: defaultValues ?? [{ nome: "", idade: "" }],
            motivoOcorrencia: [],
            genero: "",
            grupoEtnicoRacial: "",
            etapaEscolar: "",
            frequenciaEscolar: "",
            interacaoAmbienteEscolar: "",
            redesProtecao: "",
            notificadoConselhoTutelar: undefined,
            acompanhadoNAAPA: undefined,
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <FormProvider {...form}>
                <form>
                    <PessoasAgressoras
                        control={form.control}
                        disabled={disabled}
                    />
                </form>
            </FormProvider>
        </QueryClientProvider>
    );
}

describe("PessoasAgressoras", () => {
    it("deve renderizar um par de campos nome/idade por padrão", () => {
        render(<Wrapper />);

        expect(
            screen.getAllByLabelText(/nome da pessoa agressora/i),
        ).toHaveLength(1);
        expect(
            screen.getAllByLabelText(/idade da pessoa agressora/i),
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
            screen.getAllByLabelText(/nome da pessoa agressora/i),
        ).toHaveLength(2);
        expect(
            screen.getAllByLabelText(/idade da pessoa agressora/i),
        ).toHaveLength(2);
    });

    it("deve remover campos ao clicar no botão de remover", async () => {
        const user = userEvent.setup();
        render(
            <Wrapper
                defaultValues={[
                    { nome: "João", idade: "25" },
                    { nome: "Maria", idade: "30" },
                ]}
            />,
        );

        expect(
            screen.getAllByLabelText(/nome da pessoa agressora/i),
        ).toHaveLength(2);

        const removeButtons = screen.getAllByRole("button", {
            name: /Remover pessoa/i,
        });
        await user.click(removeButtons[0]);

        expect(
            screen.getAllByLabelText(/nome da pessoa agressora/i),
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
            /nome da pessoa agressora/i,
        )[0];
        const idadeInput = screen.getAllByLabelText(
            /idade da pessoa agressora/i,
        )[0];
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
                    { nome: "Gabriel Araujo de Almeida", idade: "14" },
                ]}
            />,
        );

        const nomeInput = screen.getAllByLabelText(
            /nome da pessoa agressora/i,
        )[0];
        const idadeInput = screen.getAllByLabelText(
            /idade da pessoa agressora/i,
        )[0];

        expect(nomeInput).toHaveValue("Gabriel Araujo de Almeida");
        expect(idadeInput).toHaveValue(14);
    });
});
