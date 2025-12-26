import { render, screen, fireEvent } from "@testing-library/react";
import ModalRecusarUsuario from "./ModalRecusarUsuario";

describe("ModalRecusarUsuario", () => {
    const setup = (props = {}) => {
        const onOpenChange = vi.fn();
        const onRecusar = vi.fn();
        render(
            <ModalRecusarUsuario
                open={true}
                onOpenChange={onOpenChange}
                onRecusar={onRecusar}
                isLoading={false}
                {...props}
            />
        );
        return { onOpenChange, onRecusar };
    };

    it("deve exibir o modal e os textos principais", () => {
        setup();
        expect(screen.getByText("Recusar solicitação")).toBeInTheDocument();
        expect(
            screen.getByText(/a ação não poderá ser desfeita/i)
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/Motivo da recusa/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Cancelar/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Recusar perfil/i })
        ).toBeInTheDocument();
    });

    it("deve chamar onOpenChange(false) ao clicar em Cancelar", () => {
        const { onOpenChange } = setup();
        fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("deve desabilitar o botão Recusar perfil se motivo estiver vazio", () => {
        setup();
        const btn = screen.getByRole("button", { name: /Recusar perfil/i });
        expect(btn).toBeDisabled();
    });

    it("deve habilitar o botão Recusar perfil se motivo preenchido e chamar onRecusar", () => {
        const { onRecusar } = setup();
        const textarea = screen.getByLabelText(/Motivo da recusa/i);
        fireEvent.change(textarea, { target: { value: "Motivo qualquer" } });
        const btn = screen.getByRole("button", { name: /Recusar perfil/i });
        expect(btn).not.toBeDisabled();
        fireEvent.click(btn);
        expect(onRecusar).toHaveBeenCalledWith("Motivo qualquer");
    });

    it("deve mostrar loading e desabilitar botões quando isLoading for true", () => {
        setup({ isLoading: true });
        const botoes = screen.getAllByRole("button");
        const btnCancelar = botoes[0];
        const btnRecusar = botoes[1];
        expect(btnRecusar).toBeDisabled();
        expect(btnCancelar).toBeDisabled();
    });
});
