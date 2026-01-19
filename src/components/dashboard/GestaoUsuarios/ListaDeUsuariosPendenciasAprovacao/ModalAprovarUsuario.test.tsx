import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalAprovarUsuario from "./ModalAprovarUsuario";

describe("ModalAprovarUsuario", () => {
    it("renderiza quando open=true e mostra título e descrição", () => {
        const onOpenChange = vi.fn();
        const onAprovar = vi.fn();

        render(
            <ModalAprovarUsuario
                open={true}
                onOpenChange={onOpenChange}
                onAprovar={onAprovar}
            />
        );

        expect(screen.getByText("Aprovação de perfil")).toBeInTheDocument();
        expect(
            screen.getByText(/Ao aprovar, o perfil será registrado no CoreSSO/i)
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /Cancelar/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Aprovar perfil/i })
        ).toBeInTheDocument();
    });

    it("chama onOpenChange(false) ao clicar em Cancelar", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        const onAprovar = vi.fn();

        render(
            <ModalAprovarUsuario
                open={true}
                onOpenChange={onOpenChange}
                onAprovar={onAprovar}
            />
        );

        const cancelar = screen.getByRole("button", { name: /Cancelar/i });
        await user.click(cancelar);

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("chama onAprovar ao clicar em Aprovar perfil", async () => {
        const user = userEvent.setup();
        const onOpenChange = vi.fn();
        const onAprovar = vi.fn();

        render(
            <ModalAprovarUsuario
                open={true}
                onOpenChange={onOpenChange}
                onAprovar={onAprovar}
            />
        );

        const aprovar = screen.getByRole("button", { name: /Aprovar perfil/i });
        await user.click(aprovar);

        expect(onAprovar).toHaveBeenCalled();
    });

    it("desabilita/mostra loading quando isLoading=true", () => {
        const onOpenChange = vi.fn();
        const onAprovar = vi.fn();

        render(
            <ModalAprovarUsuario
                open={true}
                onOpenChange={onOpenChange}
                onAprovar={onAprovar}
                isLoading={true}
            />
        );

        const dialog = screen.getByRole("dialog", {
            name: /Aprovação de perfil/i,
        });
        const buttons = within(dialog).getAllByRole("button");

        const cancelar = buttons[0];
        const aprovar = buttons[1];

        expect(cancelar).toBeDisabled();
        expect(aprovar).toBeDisabled();
    });
});
