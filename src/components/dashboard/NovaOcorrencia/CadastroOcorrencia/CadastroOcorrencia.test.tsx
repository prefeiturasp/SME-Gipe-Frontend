import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CadastroOcorrencia from "../index";
import { vi } from "vitest";

const fakeUser = {
    nome: "Usuário Teste",
    identificador: "user-1",
    perfil_acesso: { nome: "DRE Teste", codigo: 123 },
    unidade: [
        {
            nomeUnidade: "EMEF Teste",
            codigo: "ue-1",
        },
    ],
    email: "a@b.com",
    cpf: "12345678900",
};

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
}));

type UseUserSelector = (state: { user: typeof fakeUser }) => unknown;

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: (selector: UseUserSelector) => selector({ user: fakeUser }),
}));

describe("CadastroOcorrencia", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve renderizar os campos corretamente com os valores do usuário", () => {
        render(<CadastroOcorrencia />);

        expect(
            screen.getByLabelText(/Quando a ocorrência aconteceu\?\*/i)
        ).toBeInTheDocument();

        expect(screen.getAllByText(/DRE Teste/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/EMEF Teste/i).length).toBeGreaterThan(0);

        expect(screen.getByLabelText(/Sim/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Não/)).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /Anterior/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Próximo/i })
        ).toBeInTheDocument();
    });

    it("deve validar o preenchimento e habilitar o botão Próximo apenas quando o formulário estiver válido", async () => {
        render(<CadastroOcorrencia />);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        expect(nextButton).toBeDisabled();

        const dateInput = screen.getByLabelText<HTMLInputElement>(
            /Quando a ocorrência aconteceu\?\*/i
        );

        fireEvent.change(dateInput, { target: { value: "2025-10-02" } });
        expect(dateInput.value).toBe("2025-10-02");
        expect(nextButton).toBeDisabled();

        const radioSim = screen.getByRole("radio", { name: /Sim/ });
        fireEvent.click(radioSim);
        await waitFor(() =>
            expect(radioSim).toHaveAttribute("aria-checked", "true")
        );

        await waitFor(() => expect(nextButton).toBeEnabled());
    });

    it("não permite data futura e exibe erro", async () => {
        render(<CadastroOcorrencia />);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        expect(nextButton).toBeDisabled();

        const dateInput = screen.getByLabelText<HTMLInputElement>(
            /Quando a ocorrência aconteceu\?\*/i
        );

        // data futura: amanhã
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const dd = String(tomorrow.getDate()).padStart(2, "0");
        const futureDate = `${yyyy}-${mm}-${dd}`;

        fireEvent.change(dateInput, { target: { value: futureDate } });
        expect(dateInput.value).toBe(futureDate);

        // Mensagem de validação do schema
        const error = await screen.findByText(
            /A data da ocorrência não pode ser no futuro\./i
        );
        expect(error).toBeInTheDocument();

        // Botão continua desabilitado
        expect(nextButton).toBeDisabled();
    });

    it("exibe erro quando a data é inválida (NaN)", async () => {
        const { container } = render(<CadastroOcorrencia />);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        expect(nextButton).toBeDisabled();

        const dateInput = screen.getByLabelText<HTMLInputElement>(
            /Quando a ocorrência aconteceu\?\*/i
        );

        // valor que gera Date invalid (NaN)
        fireEvent.change(dateInput, { target: { value: "invalid-date" } });
        expect(dateInput.value).toBe("");

        const formEl = container.querySelector("form") as HTMLFormElement;
        fireEvent.submit(formEl);

        const error = await screen.findByText(
            /A data da ocorrência é obrigatória\.|A data da ocorrência não pode ser no futuro\./i
        );
        expect(error).toBeInTheDocument();

        expect(nextButton).toBeDisabled();
    });

    it("schema rejeita data inválida (NaN) via safeParse", async () => {
        const mod = await import("./schema");
        const formSchema = mod.formSchema;

        const result = formSchema.safeParse({
            dataOcorrencia: "invalid-date",
            dre: "DRE Teste",
            unidadeEducacional: "EMEF Teste",
            tipoOcorrencia: "Sim",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(
                (i: { message: string }) => i.message
            );
            expect(messages).toContain(
                "A data da ocorrência não pode ser no futuro."
            );
        }
    });
});
