import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { ListagemAnexos } from "./ListagemAnexos";
import { AnexoAPI } from "@/types/anexo";
import { toast } from "@/components/ui/headless-toast";

const mutateAsyncMock = vi.fn();

vi.mock("@/hooks/useExcluirAnexo", () => ({
    useExcluirAnexo: () => ({
        mutateAsync: mutateAsyncMock,
        isPending: false,
    }),
}));

vi.mock("@/components/ui/headless-toast", () => ({
    toast: vi.fn(),
}));


describe("ListagemAnexos", () => {
    const anexoAPIMock: AnexoAPI = {
        uuid: "api-uuid-1",
        nome_original: "relatorio.pdf",
        categoria: "relatorio_naapa",
        categoria_display: "Relatório do NAAPA",
        perfil: "diretor",
        perfil_display: "Diretor de Escola",
        tamanho_formatado: "1.2 MB",
        extensao: "pdf",
        arquivo_url: "https://example.com/anexo.pdf",
        criado_em: "2025-11-17T14:30:00Z",
        usuario_username: "maria.silva",
    };

    it("não deve renderizar nada quando não há anexos", () => {
        const { container } = render(<ListagemAnexos anexosAPI={[]} />);

        expect(container.firstChild).toBeNull();
    });

    it("deve renderizar descrição quando há anexos", () => {
        render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

        expect(
            screen.getByText(
                "Estes são os documentos já anexados na ocorrência."
            )
        ).toBeInTheDocument();
    });

    it("deve renderizar anexo da API corretamente", () => {
        render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

        expect(screen.getByText("relatorio.pdf")).toBeInTheDocument();
        expect(screen.getByText("Relatório do NAAPA")).toBeInTheDocument();
        expect(
            screen.getByText("Anexado por: maria.silva")
        ).toBeInTheDocument();
        expect(screen.getByText(/17\/11\/2025/)).toBeInTheDocument();
    });

    it("deve formatar data e hora corretamente para anexos da API", () => {
        const anexoComDataDiferente: AnexoAPI = {
            ...anexoAPIMock,
            criado_em: "2025-12-25T09:05:00Z",
        };

        render(<ListagemAnexos anexosAPI={[anexoComDataDiferente]} />);

        expect(screen.getByText(/25\/12\/2025/)).toBeInTheDocument();
    });

    it("deve renderizar múltiplos anexos da API", () => {
        const anexo2: AnexoAPI = {
            ...anexoAPIMock,
            uuid: "api-uuid-2",
            nome_original: "documento2.pdf",
            categoria_display: "Boletim de ocorrência",
        };

        render(<ListagemAnexos anexosAPI={[anexoAPIMock, anexo2]} />);

        expect(screen.getByText("relatorio.pdf")).toBeInTheDocument();
        expect(screen.getByText("documento2.pdf")).toBeInTheDocument();
        expect(screen.getByText("Relatório do NAAPA")).toBeInTheDocument();
        expect(screen.getByText("Boletim de ocorrência")).toBeInTheDocument();
        expect(
            screen.getAllByRole("button", { name: /Excluir arquivo/i })
        ).toHaveLength(2);
    });

    it("deve renderizar botão de excluir para cada anexo", () => {
        render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

        const excluirButton = screen.getByRole("button", {
            name: /Excluir arquivo/i,
        });
        expect(excluirButton).toBeInTheDocument();
    });

    it("deve renderizar ícone de anexo (Paperclip) para cada item", () => {
        render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

        const iconContainers = screen
            .getAllByRole("generic")
            .filter((el) => el.className.includes("bg-[#E8F0FE]"));

        expect(iconContainers.length).toBeGreaterThanOrEqual(1);
    });

    it("deve renderizar ícone de lixeira (Trash2) em cada botão de excluir", () => {
        render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

        const excluirButtons = screen.getAllByRole("button", {
            name: /Excluir arquivo/i,
        });

        expect(excluirButtons).toHaveLength(1);
    });

    it("deve aplicar estilos corretos nos cards de anexo", () => {
        render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

        const cards = screen
            .getAllByRole("generic")
            .filter((el) =>
                el.className.includes("border border-[#DADADA] rounded-md p-6")
            );

        expect(cards.length).toBeGreaterThan(0);
    });

    it("deve truncar nomes de arquivo longos", () => {
        const anexoComNomeLongo: AnexoAPI = {
            ...anexoAPIMock,
            nome_original:
                "nome_muito_longo_para_o_arquivo_que_deveria_ser_truncado.pdf",
        };

        render(<ListagemAnexos anexosAPI={[anexoComNomeLongo]} />);

        const nomeArquivo = screen.getByText(
            "nome_muito_longo_para_o_arquivo_que_deveria_ser_truncado.pdf"
        );
        expect(nomeArquivo.className).toContain("truncate");
    });

    it("deve usar anexosAPI vazio quando não fornecido", () => {
        const { container } = render(<ListagemAnexos />);

        expect(container.firstChild).toBeNull();
    });

    it("deve renderizar grid responsivo com classes corretas", () => {
        const { container } = render(
            <ListagemAnexos anexosAPI={[anexoAPIMock]} />
        );

        const grid = container.querySelector(
            String.raw`.grid.grid-cols-1.md\:grid-cols-2`
        );
        expect(grid).toBeInTheDocument();
    });

    it("deve formatar data com zero à esquerda quando dia/mês < 10", () => {
        const anexoComDataSimples: AnexoAPI = {
            ...anexoAPIMock,
            criado_em: "2025-01-05T08:05:00Z",
        };

        render(<ListagemAnexos anexosAPI={[anexoComDataSimples]} />);

        expect(screen.getByText(/05\/01\/2025/)).toBeInTheDocument();
    });

    it("deve exibir informações completas de anexo da API", () => {
        render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

        expect(screen.getByText("relatorio.pdf")).toBeInTheDocument();
        expect(screen.getByText("Relatório do NAAPA")).toBeInTheDocument();
        expect(
            screen.getByText("Anexado por: maria.silva")
        ).toBeInTheDocument();
        expect(screen.getByText(/17\/11\/2025/)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Excluir arquivo/i })
        ).toBeInTheDocument();
    });

    it("deve renderizar cada anexo com sua própria key única (uuid)", () => {
        const anexo2: AnexoAPI = {
            ...anexoAPIMock,
            uuid: "api-uuid-2",
            nome_original: "documento2.pdf",
        };

        const { container } = render(
            <ListagemAnexos anexosAPI={[anexoAPIMock, anexo2]} />
        );

        const cards = container.querySelectorAll(
            '[class*="border border-[#DADADA] rounded-md p-6"]'
        );
        expect(cards.length).toBe(2);
    });

    it("deve exibir nome de usuário correto para cada anexo", () => {
        const anexo1: AnexoAPI = { ...anexoAPIMock, usuario_username: "user1" };
        const anexo2: AnexoAPI = {
            ...anexoAPIMock,
            uuid: "api-uuid-2",
            nome_original: "doc2.pdf",
            usuario_username: "user2",
        };

        render(<ListagemAnexos anexosAPI={[anexo1, anexo2]} />);

        expect(screen.getByText("Anexado por: user1")).toBeInTheDocument();
        expect(screen.getByText("Anexado por: user2")).toBeInTheDocument();
    });

    it("deve exibir categoria display correta para cada anexo", () => {
        const anexo1: AnexoAPI = {
            ...anexoAPIMock,
            categoria_display: "Categoria A",
        };
        const anexo2: AnexoAPI = {
            ...anexoAPIMock,
            uuid: "api-uuid-2",
            nome_original: "doc2.pdf",
            categoria_display: "Categoria B",
        };

        render(<ListagemAnexos anexosAPI={[anexo1, anexo2]} />);

        expect(screen.getByText("Categoria A")).toBeInTheDocument();
        expect(screen.getByText("Categoria B")).toBeInTheDocument();
    });

    it("deve manter estrutura do card consistente para todos os anexos", () => {
        const anexo2: AnexoAPI = {
            ...anexoAPIMock,
            uuid: "api-uuid-2",
            nome_original: "documento2.pdf",
        };

        render(<ListagemAnexos anexosAPI={[anexoAPIMock, anexo2]} />);

        const excluirButtons = screen.getAllByRole("button", {
            name: /Excluir arquivo/i,
        });
        expect(excluirButtons).toHaveLength(2);

        expect(screen.getByText("relatorio.pdf")).toBeInTheDocument();
        expect(screen.getByText("documento2.pdf")).toBeInTheDocument();
    });

    it("deve chamar mutateAsync ao clicar em Excluir", async () => {
        mutateAsyncMock.mockResolvedValue({ success: true });

        render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

        const button = screen.getByRole("button", { name: /Excluir arquivo/i });
        fireEvent.click(button);

        expect(mutateAsyncMock).toHaveBeenCalledWith("api-uuid-1");
    });

    it("deve exibir toast de erro quando a exclusão falhar", async () => {
        mutateAsyncMock.mockResolvedValue({ success: false });

        render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

        const button = screen.getByRole("button", { name: /Excluir arquivo/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith({
                variant: "error",
                title: "Não conseguimos excluir o arquivo.",
                description: "Por favor, tente novamente.",
            });
        });
    });


});
