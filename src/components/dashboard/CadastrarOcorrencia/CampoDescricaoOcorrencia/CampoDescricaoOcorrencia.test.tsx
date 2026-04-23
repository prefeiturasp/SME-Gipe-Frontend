import { Form } from "@/components/ui/form";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { CampoDescricaoOcorrencia } from ".";

type FormTeste = {
    descricao: string;
};

function Wrapper({
    disabled = false,
    defaultValues = { descricao: "" },
    questionNumber,
}: Readonly<{
    disabled?: boolean;
    defaultValues?: FormTeste;
    questionNumber?: number;
}>) {
    const form = useForm<FormTeste>({ defaultValues });
    return (
        <Form {...form}>
            <CampoDescricaoOcorrencia
                control={form.control}
                name="descricao"
                disabled={disabled}
                questionNumber={questionNumber}
            />
        </Form>
    );
}

describe("CampoDescricaoOcorrencia", () => {
    it("deve renderizar o label e a dica de preenchimento", () => {
        render(<Wrapper />);

        expect(screen.getByText("Descreva a ocorrência*")).toBeInTheDocument();
        expect(screen.getByText(/Descreva o que ocorreu/)).toBeInTheDocument();
    });

    it("deve renderizar o textarea com placeholder", () => {
        render(<Wrapper />);

        expect(
            screen.getByPlaceholderText("Descreva aqui..."),
        ).toBeInTheDocument();
    });

    it("deve renderizar o alerta informativo", () => {
        render(<Wrapper />);

        expect(screen.getByText("Importante:")).toBeInTheDocument();
        expect(
            screen.getByText(/lavratura do boletim de ocorrência/),
        ).toBeInTheDocument();
    });

    it("deve desabilitar o textarea quando disabled=true", () => {
        render(<Wrapper disabled />);

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        expect(textarea).toBeDisabled();
    });

    it("deve permitir digitação quando habilitado", async () => {
        const user = userEvent.setup();
        render(<Wrapper />);

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        await user.type(textarea, "Teste de ocorrência");
        expect(textarea).toHaveValue("Teste de ocorrência");
    });

    it("deve aplicar cor de texto desabilitado na dica quando disabled", () => {
        render(<Wrapper disabled />);

        const hint = screen.getByText(/Descreva o que ocorreu/);
        expect(hint).toHaveClass("text-[#B0B0B0]");
    });

    it("deve aplicar cor de texto normal na dica quando habilitado", () => {
        render(<Wrapper />);

        const hint = screen.getByText(/Descreva o que ocorreu/);
        expect(hint).toHaveClass("text-[#42474a]");
    });

    it("deve renderizar valor inicial quando fornecido", () => {
        render(<Wrapper defaultValues={{ descricao: "Valor inicial" }} />);

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        expect(textarea).toHaveValue("Valor inicial");
    });

    describe("numeração de perguntas", () => {
        it("deve exibir prefixo numérico no label quando questionNumber é fornecido", () => {
            render(<Wrapper questionNumber={5} />);

            expect(
                screen.getByText("5. Descreva a ocorrência*"),
            ).toBeInTheDocument();
        });

        it("deve exibir label sem prefixo quando questionNumber não é fornecido", () => {
            render(<Wrapper />);

            expect(
                screen.getByText("Descreva a ocorrência*"),
            ).toBeInTheDocument();
        });

        it("deve exibir prefixo correto para número 1", () => {
            render(<Wrapper questionNumber={1} />);

            expect(
                screen.getByText("1. Descreva a ocorrência*"),
            ).toBeInTheDocument();
        });
    });
});
