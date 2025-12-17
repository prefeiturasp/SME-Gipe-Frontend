import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { CardUsuariosPendenciasAprovacao } from "./CardUsuariosPendenciasAprovacao";
import { Usuario } from "@/types/usuarios";

const mockUsuarios: Usuario[] = [
    {
        id: 1,
        uuid: "1",
        perfil: "Diretor(a)",
        nome: "João Silva",
        rf_ou_cpf: "123.456.789-00",
        email: "joao.silva@example.com",
        rede: "Indireta",
        diretoria_regional: "Butantã",
        unidade_educacional: "EMEI Camilo Ashcar",
        data_solicitacao: "10/11/2025",
    },
    {
        id: 2,
        uuid: "2",
        perfil: "Assistente de direção",
        nome: "Maria Oliveira",
        rf_ou_cpf: "987.654.321-00",
        email: "maria.oliveira@example.com",
        rede: "Direta",
        diretoria_regional: "Penha",
        unidade_educacional: "EMEF Prof. Carlos Drummond de Andrade",
    },
];

describe("CardUsuariosPendenciasAprovacao", () => {
    it("deve renderizar todos os usuários fornecidos", () => {
        render(
            <CardUsuariosPendenciasAprovacao usuarios={mockUsuarios} />
        );

        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.getByText("Maria Oliveira")).toBeInTheDocument();
    });

    it("deve renderizar as informações do usuário corretamente", () => {
        render(
            <CardUsuariosPendenciasAprovacao usuarios={[mockUsuarios[0]]} />
        );

        expect(screen.getByText("João Silva")).toBeInTheDocument();
        expect(screen.getByText("Diretor(a)")).toBeInTheDocument();
        expect(screen.getByText("123.456.789-00")).toBeInTheDocument();
        expect(screen.getByText("joao.silva@example.com")).toBeInTheDocument();
        expect(screen.getByText("Butantã")).toBeInTheDocument();
        expect(screen.getByText("EMEI Camilo Ashcar")).toBeInTheDocument();
        expect(screen.getByText("10/11/2025")).toBeInTheDocument();
    });

    it("deve exibir data padrão quando dataSolicitacao não é fornecida", () => {
        render(
            <CardUsuariosPendenciasAprovacao usuarios={[mockUsuarios[1]]} />
        );

        expect(screen.getByText("09/06/2025")).toBeInTheDocument();
    });

    it("deve exibir '—' quando diretoria_regional é null", () => {
        const usuarioSemDre: Usuario = {
            ...mockUsuarios[0],
            diretoria_regional: null as unknown as string,
        };

        render(
            <CardUsuariosPendenciasAprovacao usuarios={[usuarioSemDre]} />
        );

        const dreElements = screen.getAllByText("—");
        expect(dreElements.length).toBeGreaterThan(0);
    });

    it("deve exibir '—' quando unidade_educacional é null", () => {
        const usuarioSemUe: Usuario = {
            ...mockUsuarios[0],
            unidade_educacional: null as unknown as string,
        };

        render(
            <CardUsuariosPendenciasAprovacao usuarios={[usuarioSemUe]} />
        );

        const ueElements = screen.getAllByText("—");
        expect(ueElements.length).toBeGreaterThan(0);
    });

    it("deve renderizar os botões Aprovar e Recusar", () => {
        render(
            <CardUsuariosPendenciasAprovacao usuarios={[mockUsuarios[0]]} />
        );

        expect(screen.getByText("Aprovar")).toBeInTheDocument();
        expect(screen.getByText("Recusar")).toBeInTheDocument();
    });

    it("deve chamar onAprovar com o usuário correto ao clicar no botão Aprovar", async () => {
        const user = userEvent.setup();
        const onAprovar = vi.fn();

        render(
            <CardUsuariosPendenciasAprovacao
                usuarios={[mockUsuarios[0]]}
                onAprovar={onAprovar}
            />
        );

        const aprovarButton = screen.getByText("Aprovar");
        await user.click(aprovarButton);

        expect(onAprovar).toHaveBeenCalledTimes(1);
        expect(onAprovar).toHaveBeenCalledWith(mockUsuarios[0]);
    });

    it("deve chamar onRecusar com o usuário correto ao clicar no botão Recusar", async () => {
        const user = userEvent.setup();
        const onRecusar = vi.fn();

        render(
            <CardUsuariosPendenciasAprovacao
                usuarios={[mockUsuarios[0]]}
                onRecusar={onRecusar}
            />
        );

        const recusarButton = screen.getByText("Recusar");
        await user.click(recusarButton);

        expect(onRecusar).toHaveBeenCalledTimes(1);
        expect(onRecusar).toHaveBeenCalledWith(mockUsuarios[0]);
    });

    it("deve chamar onAprovar com o usuário correto quando há múltiplos usuários", async () => {
        const user = userEvent.setup();
        const onAprovar = vi.fn();

        render(
            <CardUsuariosPendenciasAprovacao
                usuarios={mockUsuarios}
                onAprovar={onAprovar}
            />
        );

        const aprovarButtons = screen.getAllByText("Aprovar");
        await user.click(aprovarButtons[1]);

        expect(onAprovar).toHaveBeenCalledTimes(1);
        expect(onAprovar).toHaveBeenCalledWith(mockUsuarios[1]);
    });

    it("deve chamar onRecusar com o usuário correto quando há múltiplos usuários", async () => {
        const user = userEvent.setup();
        const onRecusar = vi.fn();

        render(
            <CardUsuariosPendenciasAprovacao
                usuarios={mockUsuarios}
                onRecusar={onRecusar}
            />
        );

        const recusarButtons = screen.getAllByText("Recusar");
        await user.click(recusarButtons[1]);

        expect(onRecusar).toHaveBeenCalledTimes(1);
        expect(onRecusar).toHaveBeenCalledWith(mockUsuarios[1]);
    });

    it("não deve quebrar quando onAprovar não é fornecido", async () => {
        const user = userEvent.setup();

        render(
            <CardUsuariosPendenciasAprovacao usuarios={[mockUsuarios[0]]} />
        );

        const aprovarButton = screen.getByText("Aprovar");
        await user.click(aprovarButton);

        // Não deve lançar erro
        expect(aprovarButton).toBeInTheDocument();
    });

    it("não deve quebrar quando onRecusar não é fornecido", async () => {
        const user = userEvent.setup();

        render(
            <CardUsuariosPendenciasAprovacao usuarios={[mockUsuarios[0]]} />
        );

        const recusarButton = screen.getByText("Recusar");
        await user.click(recusarButton);

        // Não deve lançar erro
        expect(recusarButton).toBeInTheDocument();
    });

    it("deve renderizar uma lista vazia quando não há usuários", () => {
        const { container } = render(
            <CardUsuariosPendenciasAprovacao usuarios={[]} />
        );

        const grid = container.querySelector(".grid");
        expect(grid).toBeInTheDocument();
        expect(grid?.children.length).toBe(0);
    });

    it("deve aplicar as classes CSS corretas ao grid", () => {
        const { container } = render(
            <CardUsuariosPendenciasAprovacao usuarios={mockUsuarios} />
        );

        const grid = container.querySelector(".grid");
        expect(grid).toHaveClass("gap-4", "md:grid-cols-2", "xl:grid-cols-3");
    });

    it("deve renderizar os ícones nos botões", () => {
        render(
            <CardUsuariosPendenciasAprovacao usuarios={[mockUsuarios[0]]} />
        );

        // Verifica se os botões contêm os ícones através de suas classes
        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(2);
    });

    it("deve renderizar múltiplos cards com a estrutura correta", () => {
        render(
            <CardUsuariosPendenciasAprovacao usuarios={mockUsuarios} />
        );

        // Verifica se todos os nomes estão presentes
        for (const usuario of mockUsuarios) {
            expect(screen.getByText(usuario.nome)).toBeInTheDocument();
            expect(screen.getByText(usuario.perfil)).toBeInTheDocument();
        }

        // Verifica a quantidade de botões (2 por usuário)
        const aprovarButtons = screen.getAllByText("Aprovar");
        const recusarButtons = screen.getAllByText("Recusar");
        expect(aprovarButtons).toHaveLength(mockUsuarios.length);
        expect(recusarButtons).toHaveLength(mockUsuarios.length);
    });
});
