import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CadastroOcorrencia from "./index";
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

        const radioSim = screen.getByLabelText<HTMLInputElement>(/Sim/);
        fireEvent.click(radioSim);
        await waitFor(() => expect(radioSim.checked).toBe(true));

        await waitFor(() => expect(nextButton).toBeEnabled());
    });
});
