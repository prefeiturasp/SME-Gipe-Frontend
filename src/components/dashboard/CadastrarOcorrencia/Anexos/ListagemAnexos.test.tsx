import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { ListagemAnexos } from "./ListagemAnexos";
import { AnexoAPI } from "@/types/anexo";

describe("ListagemAnexos", () => {
    const mockOnRemoverAnexoLocal = vi.fn();
    const mockOnRemoverAnexoAPI = vi.fn();

    const anexoLocalMock = {
        id: "local-1",
        arquivo: new File(["conteúdo"], "documento.pdf", {
            type: "application/pdf",
        }),
        tipoDocumento: "boletim_ocorrencia",
        tipoDocumentoLabel: "Boletim de ocorrência",
        anexadoPor: "João Silva",
        dataHora: "17/11/2025 14:30",
        enviando: false,
    };

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

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("não deve renderizar nada quando não há anexos", () => {
        const { container } = render(
            <ListagemAnexos
                anexosLocais={[]}
                anexosAPI={[]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it("deve renderizar descrição quando há anexos", () => {
        render(
            <ListagemAnexos
                anexosLocais={[anexoLocalMock]}
                anexosAPI={[]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        expect(
            screen.getByText(
                "Estes são os documentos já anexados na ocorrência."
            )
        ).toBeInTheDocument();
    });

    it("deve renderizar anexo local corretamente", () => {
        render(
            <ListagemAnexos
                anexosLocais={[anexoLocalMock]}
                anexosAPI={[]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        expect(screen.getByText("documento.pdf")).toBeInTheDocument();
        expect(screen.getByText("Boletim de ocorrência")).toBeInTheDocument();
        expect(screen.getByText("Anexado por: João Silva")).toBeInTheDocument();
        expect(screen.getByText("17/11/2025 14:30")).toBeInTheDocument();
    });

    it("deve renderizar anexo da API corretamente", () => {
        render(
            <ListagemAnexos
                anexosLocais={[]}
                anexosAPI={[anexoAPIMock]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

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

        render(
            <ListagemAnexos
                anexosLocais={[]}
                anexosAPI={[anexoComDataDiferente]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        expect(screen.getByText(/25\/12\/2025/)).toBeInTheDocument();
    });

    it("deve renderizar múltiplos anexos locais", () => {
        const anexo2 = {
            ...anexoLocalMock,
            id: "local-2",
            arquivo: new File(["conteúdo2"], "foto.jpg", {
                type: "image/jpeg",
            }),
            tipoDocumentoLabel: "Relatório do CEFAI",
        };

        render(
            <ListagemAnexos
                anexosLocais={[anexoLocalMock, anexo2]}
                anexosAPI={[]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        expect(screen.getByText("documento.pdf")).toBeInTheDocument();
        expect(screen.getByText("foto.jpg")).toBeInTheDocument();
        expect(screen.getByText("Boletim de ocorrência")).toBeInTheDocument();
        expect(screen.getByText("Relatório do CEFAI")).toBeInTheDocument();
    });

    it("deve renderizar múltiplos anexos da API", () => {
        const anexo2: AnexoAPI = {
            ...anexoAPIMock,
            uuid: "api-uuid-2",
            nome_original: "documento2.pdf",
            categoria_display: "Boletim de ocorrência",
        };

        render(
            <ListagemAnexos
                anexosLocais={[]}
                anexosAPI={[anexoAPIMock, anexo2]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        expect(screen.getByText("relatorio.pdf")).toBeInTheDocument();
        expect(screen.getByText("documento2.pdf")).toBeInTheDocument();
        expect(screen.getByText("Relatório do NAAPA")).toBeInTheDocument();
        expect(screen.getByText("Boletim de ocorrência")).toBeInTheDocument();
    });

    it("deve renderizar anexos locais e da API juntos", () => {
        render(
            <ListagemAnexos
                anexosLocais={[anexoLocalMock]}
                anexosAPI={[anexoAPIMock]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        expect(screen.getByText("documento.pdf")).toBeInTheDocument();
        expect(screen.getByText("relatorio.pdf")).toBeInTheDocument();
        expect(
            screen.getAllByRole("button", { name: /Excluir arquivo/i })
        ).toHaveLength(2);
    });

    it("deve chamar onRemoverAnexoLocal ao clicar em excluir anexo local", async () => {
        const user = userEvent.setup();

        render(
            <ListagemAnexos
                anexosLocais={[anexoLocalMock]}
                anexosAPI={[]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        const excluirButton = screen.getByRole("button", {
            name: /Excluir arquivo/i,
        });
        await user.click(excluirButton);

        expect(mockOnRemoverAnexoLocal).toHaveBeenCalledWith("local-1");
        expect(mockOnRemoverAnexoLocal).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onRemoverAnexoAPI ao clicar em excluir anexo da API", async () => {
        const user = userEvent.setup();

        render(
            <ListagemAnexos
                anexosLocais={[]}
                anexosAPI={[anexoAPIMock]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        const excluirButton = screen.getByRole("button", {
            name: /Excluir arquivo/i,
        });
        await user.click(excluirButton);

        expect(mockOnRemoverAnexoAPI).toHaveBeenCalledWith("api-uuid-1");
        expect(mockOnRemoverAnexoAPI).toHaveBeenCalledTimes(1);
    });

    it("deve exibir indicador 'Enviando...' quando anexo está sendo enviado", () => {
        const anexoEnviando = {
            ...anexoLocalMock,
            enviando: true,
        };

        render(
            <ListagemAnexos
                anexosLocais={[anexoEnviando]}
                anexosAPI={[]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        expect(screen.getByText("Enviando...")).toBeInTheDocument();
    });

    it("não deve exibir indicador 'Enviando...' quando anexo não está sendo enviado", () => {
        render(
            <ListagemAnexos
                anexosLocais={[anexoLocalMock]}
                anexosAPI={[]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        expect(screen.queryByText("Enviando...")).not.toBeInTheDocument();
    });

    it("deve desabilitar botão de excluir quando anexo está sendo enviado", () => {
        const anexoEnviando = {
            ...anexoLocalMock,
            enviando: true,
        };

        render(
            <ListagemAnexos
                anexosLocais={[anexoEnviando]}
                anexosAPI={[]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        const excluirButton = screen.getByRole("button", {
            name: /Excluir arquivo/i,
        });
        expect(excluirButton).toBeDisabled();
    });

    it("não deve desabilitar botão de excluir quando anexo não está sendo enviado", () => {
        render(
            <ListagemAnexos
                anexosLocais={[anexoLocalMock]}
                anexosAPI={[]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        const excluirButton = screen.getByRole("button", {
            name: /Excluir arquivo/i,
        });
        expect(excluirButton).not.toBeDisabled();
    });

    it("deve renderizar ícone de anexo (Paperclip) para cada item", () => {
        render(
            <ListagemAnexos
                anexosLocais={[anexoLocalMock]}
                anexosAPI={[anexoAPIMock]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        const iconContainers = screen
            .getAllByRole("generic")
            .filter((el) => el.className.includes("bg-[#E8F0FE]"));

        expect(iconContainers.length).toBeGreaterThanOrEqual(2);
    });

    it("deve renderizar ícone de lixeira (Trash2) em cada botão de excluir", () => {
        render(
            <ListagemAnexos
                anexosLocais={[anexoLocalMock]}
                anexosAPI={[anexoAPIMock]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        const excluirButtons = screen.getAllByRole("button", {
            name: /Excluir arquivo/i,
        });

        expect(excluirButtons).toHaveLength(2);
    });

    it("deve aplicar estilos corretos nos cards de anexo", () => {
        render(
            <ListagemAnexos
                anexosLocais={[anexoLocalMock]}
                anexosAPI={[]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        const cards = screen
            .getAllByRole("generic")
            .filter((el) =>
                el.className.includes("border border-[#DADADA] rounded-md p-6")
            );

        expect(cards.length).toBeGreaterThan(0);
    });

    it("deve truncar nomes de arquivo longos", () => {
        const anexoComNomeLongo = {
            ...anexoLocalMock,
            arquivo: new File(
                ["conteúdo"],
                "nome_muito_longo_para_o_arquivo_que_deveria_ser_truncado.pdf",
                { type: "application/pdf" }
            ),
        };

        render(
            <ListagemAnexos
                anexosLocais={[anexoComNomeLongo]}
                anexosAPI={[]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        const nomeArquivo = screen.getByText(
            "nome_muito_longo_para_o_arquivo_que_deveria_ser_truncado.pdf"
        );
        expect(nomeArquivo.className).toContain("truncate");
    });

    it("deve usar anexosAPI vazio quando não fornecido", () => {
        render(
            <ListagemAnexos
                anexosLocais={[anexoLocalMock]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
            />
        );

        expect(screen.getByText("documento.pdf")).toBeInTheDocument();
        const excluirButtons = screen.getAllByRole("button", {
            name: /Excluir arquivo/i,
        });
        expect(excluirButtons).toHaveLength(1);
    });

    it("não deve chamar onRemoverAnexoAPI quando não fornecido", async () => {
        const user = userEvent.setup();

        render(
            <ListagemAnexos
                anexosLocais={[]}
                anexosAPI={[anexoAPIMock]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
            />
        );

        const excluirButton = screen.getByRole("button", {
            name: /Excluir arquivo/i,
        });
        await user.click(excluirButton);

        expect(mockOnRemoverAnexoAPI).not.toHaveBeenCalled();
    });

    it("deve renderizar grid responsivo com classes corretas", () => {
        const { container } = render(
            <ListagemAnexos
                anexosLocais={[anexoLocalMock]}
                anexosAPI={[]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
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

        render(
            <ListagemAnexos
                anexosLocais={[]}
                anexosAPI={[anexoComDataSimples]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        expect(screen.getByText(/05\/01\/2025/)).toBeInTheDocument();
    });

    it("deve exibir informações completas de anexo da API", () => {
        render(
            <ListagemAnexos
                anexosLocais={[]}
                anexosAPI={[anexoAPIMock]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

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

    it("deve exibir informações completas de anexo local", () => {
        render(
            <ListagemAnexos
                anexosLocais={[anexoLocalMock]}
                anexosAPI={[]}
                onRemoverAnexoLocal={mockOnRemoverAnexoLocal}
                onRemoverAnexoAPI={mockOnRemoverAnexoAPI}
            />
        );

        expect(screen.getByText("documento.pdf")).toBeInTheDocument();
        expect(screen.getByText("Boletim de ocorrência")).toBeInTheDocument();
        expect(screen.getByText("Anexado por: João Silva")).toBeInTheDocument();
        expect(screen.getByText("17/11/2025 14:30")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Excluir arquivo/i })
        ).toBeInTheDocument();
    });
});
