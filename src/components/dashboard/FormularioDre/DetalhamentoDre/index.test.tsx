import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { DetalhamentoDre } from "./index";

const mockRouterBack = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: mockRouterBack,
        push: vi.fn(),
    }),
}));

vi.mock("../../QuadroBranco/QuadroBranco", () => ({
    default: vi.fn(({ children }) => <div>{children}</div>),
}));

vi.mock("../../CadastrarOcorrencia/Anexos", () => ({
    default: vi.fn(() => <div data-testid="mock-anexos">Mock Anexos</div>),
}));

describe("DetalhamentoDre", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve renderizar o título 'Continuação da ocorrência'", () => {
        render(<DetalhamentoDre />);

        expect(
            screen.getByRole("heading", { name: /continuação da ocorrência/i })
        ).toBeInTheDocument();
    });

    it("deve renderizar todos os campos de radio button", () => {
        render(<DetalhamentoDre />);

        expect(
            screen.getByText(
                /houve acionamento da secretaria de seguranças pública ou forças de segurança/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /houve interlocução com a supervisão técnica de saúde \(sts\)/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /houve interlocução com a coordenação de políticas para criança e adolescente \(cpca\)/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(/houve interlocução com a supervisão escolar/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /houve interlocução com o núcleo de apoio e acompanhamento para a aprendizagem \(naapa\)/i
            )
        ).toBeInTheDocument();
    });

    it("deve renderizar todos os campos de textarea", () => {
        render(<DetalhamentoDre />);

        expect(
            screen.getByText(
                /existe alguma informação complementar da atuação conjunta entre a dre e o sts/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /existe alguma informação complementar da atuação conjunta entre a dre e o cpca/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /existe alguma informação complementar da atuação conjunta entre a dre e o supervisão escolar/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /existe alguma informação complementar da atuação conjunta entre a dre e o naapa/i
            )
        ).toBeInTheDocument();
    });

    it("deve renderizar o componente Anexos", () => {
        render(<DetalhamentoDre />);

        expect(screen.getByTestId("mock-anexos")).toBeInTheDocument();
    });

    it("deve renderizar os botões Anterior e Salvar informações", () => {
        render(<DetalhamentoDre />);

        expect(
            screen.getByRole("button", { name: /anterior/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /salvar informações/i })
        ).toBeInTheDocument();
    });

    it("deve ter o botão Salvar informações desabilitado inicialmente", () => {
        render(<DetalhamentoDre />);

        const botaoSalvar = screen.getByRole("button", {
            name: /salvar informações/i,
        });
        expect(botaoSalvar).toBeDisabled();
    });

    it("deve chamar onPrevious ao clicar no botão Anterior", async () => {
        const user = userEvent.setup();
        const mockOnPrevious = vi.fn();
        render(<DetalhamentoDre onPrevious={mockOnPrevious} />);

        const botaoAnterior = screen.getByRole("button", { name: /anterior/i });
        await user.click(botaoAnterior);

        expect(mockOnPrevious).toHaveBeenCalledTimes(1);
    });

    it("deve habilitar o botão Salvar quando todos os campos obrigatórios forem preenchidos com 'Não'", async () => {
        const user = userEvent.setup();
        render(<DetalhamentoDre />);

        const botaoSalvar = screen.getByRole("button", {
            name: /salvar informações/i,
        });

        expect(botaoSalvar).toBeDisabled();

        const radiosSeguranca = screen.getAllByRole("radio");

        await user.click(radiosSeguranca[1]);
        await user.click(radiosSeguranca[3]);
        await user.click(radiosSeguranca[5]);
        await user.click(radiosSeguranca[7]);
        await user.click(radiosSeguranca[9]);

        await waitFor(() => {
            expect(botaoSalvar).not.toBeDisabled();
        });
    });

    it("deve ter 5 grupos de radio buttons (cada um com Sim/Não)", () => {
        render(<DetalhamentoDre />);

        const radios = screen.getAllByRole("radio");
        expect(radios).toHaveLength(10);
    });

    it("deve ter 4 campos de textarea", () => {
        render(<DetalhamentoDre />);

        const textareas = screen.getAllByRole("textbox");
        expect(textareas).toHaveLength(4);
    });

    it("deve renderizar o formulário dentro de um componente Form", () => {
        const { container } = render(<DetalhamentoDre />);

        const form = container.querySelector("form");
        expect(form).toBeInTheDocument();
    });

    it("deve ter o título com estilo correto", () => {
        render(<DetalhamentoDre />);

        const titulo = screen.getByRole("heading", {
            name: /continuação da ocorrência/i,
        });

        expect(titulo).toHaveClass(
            "text-[20px]",
            "font-bold",
            "text-[#42474a]",
            "mb-2"
        );
    });

    it("deve organizar os campos em 3 QuadroBranco distintos", () => {
        render(<DetalhamentoDre />);

        expect(
            screen.getByText(/acionamento da secretaria de seguranças pública/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/interlocução com a supervisão escolar/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/interlocução com o núcleo de apoio/i)
        ).toBeInTheDocument();
    });

    it("deve manter a estrutura de validação condicional dos textareas", async () => {
        const user = userEvent.setup();
        render(<DetalhamentoDre />);

        const radios = screen.getAllByRole("radio");

        await user.click(radios[1]);
        await user.click(radios[3]);
        await user.click(radios[5]);
        await user.click(radios[7]);
        await user.click(radios[9]);

        await waitFor(() => {
            const botaoSalvar = screen.getByRole("button", {
                name: /salvar informações/i,
            });
            expect(botaoSalvar).not.toBeDisabled();
        });
    });

    it("deve exigir preenchimento de textarea quando radio é 'Sim'", async () => {
        const user = userEvent.setup();
        render(<DetalhamentoDre />);

        const radios = screen.getAllByRole("radio");

        await user.click(radios[1]);
        await user.click(radios[2]);
        await user.click(radios[5]);
        await user.click(radios[7]);
        await user.click(radios[9]);

        const botaoSalvar = screen.getByRole("button", {
            name: /salvar informações/i,
        });

        await waitFor(() => {
            expect(botaoSalvar).toBeDisabled();
        });

        const textareas = screen.getAllByRole("textbox");
        const textareaSTS = textareas[0];
        await user.type(textareaSTS, "Informações complementares STS");

        await waitFor(() => {
            expect(botaoSalvar).not.toBeDisabled();
        });
    });
});
