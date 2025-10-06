import React from "react";
import {
    render,
    screen,
    fireEvent,
    waitFor,
    within,
} from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import Filtros, { FiltrosValues } from "./filtros";

interface MockUser {
    username: string;
    nome: string;
    perfil_acesso: { nome: string; codigo: number };
}

let mockUser: MockUser = {
    username: "12345",
    nome: "JOÃO DA SILVA",
    perfil_acesso: { nome: "GIPE", codigo: 0 },
};

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: (selector: (state: { user: MockUser }) => unknown) =>
        selector({ user: mockUser }),
}));

describe("Filtros component", () => {
    beforeEach(() => {
        mockUser = {
            username: "12345",
            nome: "JOÃO DA SILVA",
            perfil_acesso: { nome: "GIPE", codigo: 0 },
        };
    });

    it("deve chamar onApply com initialValues quando Filtrar for clicado", () => {
        const onApply = vi.fn();
        const initialValues: Partial<FiltrosValues> = {
            codigoEol: "10005",
            nomeUe: "ue-1",
            dre: "dre-1",
            periodoInicial: "2023-10-01",
            periodoFinal: "2023-10-31",
            tipoViolencia: "fisica",
            status: "incompleta",
        };

        render(<Filtros onApply={onApply} initialValues={initialValues} />);

        const filtrar = screen.getByRole("button", { name: /Filtrar/i });
        fireEvent.click(filtrar);

        expect(onApply).toHaveBeenCalledTimes(1);
        const calledWith: FiltrosValues = onApply.mock.calls[0][0];
        expect(calledWith.codigoEol).toBe(initialValues.codigoEol);
        expect(calledWith.nomeUe).toBe(initialValues.nomeUe);
        expect(calledWith.dre).toBe(initialValues.dre);
        expect(calledWith.periodoInicial).toBe(initialValues.periodoInicial);
        expect(calledWith.periodoFinal).toBe(initialValues.periodoFinal);
        expect(calledWith.tipoViolencia).toBe(initialValues.tipoViolencia);
        expect(calledWith.status).toBe(initialValues.status);
    });

    it("deve chamar onClear e limpar os campos", async () => {
        const onClear = vi.fn();
        render(<Filtros onClear={onClear} />);

        const codigoInput = screen.getByLabelText(/Código EOL/i);
        fireEvent.change(codigoInput, { target: { value: "10005" } });

        const limpar = screen.getByRole("button", { name: /Limpar/i });
        fireEvent.click(limpar);

        expect(onClear).toHaveBeenCalledTimes(1);
        expect((codigoInput as HTMLInputElement).value).toBe("");
    });

    it("deve atualizar valores via interação e onApply deve receber valores atualizados", async () => {
        const onApply = vi.fn();
        const user = userEvent.setup();
        const initialValues: Partial<FiltrosValues> = {
            tipoViolencia: "psicologica",
            status: "em-andamento",
        };

        render(<Filtros onApply={onApply} initialValues={initialValues} />);

        const codigoInput = screen.getByLabelText(/Código EOL/i);
        await user.type(codigoInput, "20010");

        await user.click(screen.getByRole("combobox", { name: /Nome da UE/i }));
        const ueListbox = await screen.findByRole("listbox");
        const ueOption = await within(ueListbox).findByRole("option", {
            name: /UE 2/i,
        });
        await user.click(ueOption);

        await user.click(screen.getByRole("combobox", { name: /DRE/i }));
        const dreListbox = await screen.findByRole("listbox");
        const dreOption = await within(dreListbox).findByRole("option", {
            name: /DRE 3/i,
        });
        await user.click(dreOption);

        await user.click(
            screen.getByRole("combobox", { name: /Tipo de violência/i })
        );
        const tvListbox = await screen.findByRole("listbox");
        const tvOption = await within(tvListbox).findByRole("option", {
            name: /Física/i,
        });
        await user.click(tvOption);

        await user.click(screen.getByRole("combobox", { name: /Status/i }));
        const statusListbox = await screen.findByRole("listbox");
        const statusOption = await within(statusListbox).findByRole("option", {
            name: /Finalizada/i,
        });
        await user.click(statusOption);

        const periodoFieldset = screen
            .getByText(/Período/i)
            .closest("fieldset") as HTMLElement | null;
        const inicio = periodoFieldset?.querySelector(
            "#periodo-inicial"
        ) as HTMLInputElement;
        const fim = periodoFieldset?.querySelector(
            "#periodo-final"
        ) as HTMLInputElement;
        if (inicio && fim) {
            fireEvent.change(inicio, { target: { value: "2023-09-01" } });
            fireEvent.change(fim, { target: { value: "2023-09-15" } });
        }

        const filtrar = screen.getByRole("button", { name: /Filtrar/i });
        fireEvent.click(filtrar);

        expect(onApply).toHaveBeenCalledTimes(1);
        const calledWith: FiltrosValues = onApply.mock.calls[0][0];
        expect(calledWith.codigoEol).toBe("20010");
        expect(calledWith.nomeUe).toBe("ue-2");
        expect(calledWith.dre).toBe("dre-3");
        expect(calledWith.periodoInicial).toBe("2023-09-01");
        expect(calledWith.periodoFinal).toBe("2023-09-15");
        expect(calledWith.tipoViolencia).toBe("fisica");
        expect(calledWith.status).toBe("finalizada");
    });

    it("deve habilitar/desabilitar botões com base na seleção de filtros", async () => {
        render(<Filtros />);
        const user = userEvent.setup();

        const filtrarButton = screen.getByRole("button", { name: /Filtrar/i });
        const limparButton = screen.getByRole("button", { name: /Limpar/i });

        expect(filtrarButton).toBeDisabled();
        expect(limparButton).toBeDisabled();

        const codigoInput = screen.getByLabelText(/Código EOL/i);
        await user.type(codigoInput, "123");
        await waitFor(() => {
            expect(filtrarButton).not.toBeDisabled();
            expect(limparButton).not.toBeDisabled();
        });

        await user.click(limparButton);
        await waitFor(() => {
            expect(filtrarButton).toBeDisabled();
            expect(limparButton).toBeDisabled();
        });
    });

    it("não deve quebrar se onApply e onClear não forem fornecidos", async () => {
        render(<Filtros />);
        const user = userEvent.setup();

        const codigoInput = screen.getByLabelText(/Código EOL/i);
        await user.type(codigoInput, "123");

        const filtrarButton = screen.getByRole("button", { name: /Filtrar/i });
        const limparButton = screen.getByRole("button", { name: /Limpar/i });

        expect(() => fireEvent.click(filtrarButton)).not.toThrow();
        expect(() => fireEvent.click(limparButton)).not.toThrow();
    });

    it("deve exibir os campos corretos para o perfil Ponto Focal", () => {
        mockUser = {
            username: "12345",
            nome: "Ponto Focal",
            perfil_acesso: { nome: "Ponto Focal", codigo: 1 },
        };

        render(<Filtros />);

        expect(screen.getByLabelText(/Código EOL/i)).toBeInTheDocument();
        expect(
            screen.getByRole("combobox", { name: /Nome da UE/i })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("combobox", { name: /DRE/i })
        ).not.toBeInTheDocument();
        expect(screen.getByText(/Período/i)).toBeInTheDocument();
        expect(
            screen.getByRole("combobox", { name: /Tipo de violência/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("combobox", { name: /Status/i })
        ).toBeInTheDocument();
    });

    it("deve exibir os campos corretos para o perfil Assistente/Diretor", () => {
        mockUser = {
            username: "12345",
            nome: "Assistente",
            perfil_acesso: { nome: "Assistente", codigo: 3085 },
        };

        render(<Filtros />);

        expect(screen.queryByLabelText(/Código EOL/i)).not.toBeInTheDocument();
        expect(
            screen.queryByRole("combobox", { name: /Nome da UE/i })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("combobox", { name: /DRE/i })
        ).not.toBeInTheDocument();
        expect(screen.getByText(/Período/i)).toBeInTheDocument();
        expect(
            screen.getByRole("combobox", { name: /Tipo de violência/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("combobox", { name: /Status/i })
        ).toBeInTheDocument();
    });
});
