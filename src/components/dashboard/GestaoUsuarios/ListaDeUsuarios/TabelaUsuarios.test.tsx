import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import TabelaUsuarios from "./TabelaUsuarios";
import type { Usuario } from "@/types/usuarios";

function createUsuarios(count: number): Usuario[] {
    return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        uuid: `user-${index + 1}`,
        perfil: `Perfil ${index + 1}`,
        nome: `Usuário ${index + 1}`,
        rf_ou_cpf: `000${index + 1}`,
        email: `usuario${index + 1}@example.com`,
        rede: "Direta",
        diretoria_regional: "Butantã",
        unidade_educacional: "EMEF Teste",
    }));
}

describe("TabelaUsuarios", () => {
    it("renderiza mensagem quando não há usuários", () => {
        render(<TabelaUsuarios dataUsuarios={[]} />);

        expect(
            screen.getByText("Nenhum usuário encontrado.")
        ).toBeInTheDocument();
    });

    it("renderiza as colunas e os dados da página atual", () => {
        const usuarios = createUsuarios(5);
        render(<TabelaUsuarios dataUsuarios={usuarios} />);

        expect(screen.getByText("Perfil")).toBeInTheDocument();
        expect(screen.getByText("Nome")).toBeInTheDocument();
        expect(screen.getByText("RF ou CPF")).toBeInTheDocument();

        usuarios.forEach((usuario) => {
            expect(screen.getByText(usuario.nome)).toBeInTheDocument();
            expect(screen.getByText(usuario.email)).toBeInTheDocument();
        });
    });

    it("avança e retrocede entre páginas usando os botões de navegação", async () => {
        const usuarios = createUsuarios(25);
        const user = userEvent.setup();

        render(<TabelaUsuarios dataUsuarios={usuarios} />);

        expect(screen.getByText("Usuário 1")).toBeInTheDocument();
        expect(screen.queryByText("Usuário 11")).not.toBeInTheDocument();

        const nextButton = screen.getByTestId("next-page-button");
        await user.click(nextButton);

        expect(screen.getByText("Usuário 11")).toBeInTheDocument();
        expect(screen.queryByText("Usuário 1")).not.toBeInTheDocument();

        const page3Button = screen.getByRole("button", { name: "3" });
        await user.click(page3Button);
        expect(screen.getByText("Usuário 21")).toBeInTheDocument();

        const prevButton = screen.getByTestId("prev-page-button");
        await user.click(prevButton);
        expect(screen.getByText("Usuário 11")).toBeInTheDocument();
    });

    it("desativa botões de navegação quando não há páginas anteriores ou seguintes", () => {
        const usuarios = createUsuarios(10);

        render(<TabelaUsuarios dataUsuarios={usuarios} />);

        const prevButton = screen.getByTestId("prev-page-button");
        const nextButton = screen.getByTestId("next-page-button");

        expect(prevButton).toBeDisabled();
        expect(nextButton).toBeDisabled();
    });

    it("reinicia para a primeira página quando os dados mudam", async () => {
        const usuarios = createUsuarios(20);
        const user = userEvent.setup();
        const { rerender } = render(<TabelaUsuarios dataUsuarios={usuarios} />);

        const nextButton = screen.getByTestId("next-page-button");
        await user.click(nextButton);
        expect(screen.getByText("Usuário 11")).toBeInTheDocument();

        rerender(<TabelaUsuarios dataUsuarios={usuarios.slice(0, 5)} />);
        expect(screen.getByText("Usuário 1")).toBeInTheDocument();
        expect(screen.queryByText("Usuário 11")).not.toBeInTheDocument();
    });

    it("usa id ou índice como chave quando uuid não está disponível", () => {
        const usuarios = createUsuarios(1);
        const usuarioSemUuid = {
            ...usuarios[0],
            uuid: undefined,
            id: 123,
        } as unknown as Usuario;

        render(<TabelaUsuarios dataUsuarios={[usuarioSemUuid]} />);

        expect(screen.getByText("Usuário 1")).toBeInTheDocument();
    });

    it("usa índice como chave quando uuid e id não estão disponíveis", () => {
        const usuarios = createUsuarios(2);
        const usuariosSemUuidEId = usuarios.map((usuario) => ({
            ...usuario,
            uuid: undefined,
            id: undefined,
        })) as unknown as Usuario[];

        render(<TabelaUsuarios dataUsuarios={usuariosSemUuidEId} />);

        expect(screen.getByText("Usuário 1")).toBeInTheDocument();
        expect(screen.getByText("Usuário 2")).toBeInTheDocument();
    });
});
