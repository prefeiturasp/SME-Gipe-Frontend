import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { ListagemAnexos } from "./ListagemAnexos";
import { AnexoAPI } from "@/types/anexo";
import { ModalExcluir } from "./ModalExcluir/ModalExcluir";

vi.mock(
    "@/components/dashboard/CadastrarOcorrencia/Anexos/ModalExcluir/ModalExcluir",
    () => ({
        ModalExcluir: vi.fn(({ open, onOpenChange, uuid }) => (
            <div data-testid="modal-excluir">
                {open && (
                    <>
                        <p>Modal Aberto</p>
                        <p>UUID: {uuid}</p>
                        <button onClick={() => onOpenChange(false)}>
                            Fechar Modal
                        </button>
                    </>
                )}
            </div>
        )),
    })
);

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

const baixarMock = vi.fn();

vi.mock("@/hooks/useBaixarAnexo", () => ({
    useBaixarAnexo: () => ({
        mutate: baixarMock,
        isPending: false,
    }),
}));

const mockToast = vi.fn();
vi.mock("@/components/ui/headless-toast", () => ({
    toast: (params: unknown) => mockToast(params),
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
        usuario_nome: "Maria Silva",
    };

    beforeEach(() => {
        baixarMock.mockClear();
    });

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
            screen.getByText("Anexado por: Maria Silva")
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

        expect(
            screen.queryByRole("button", { name: /Baixar arquivo/i })
        ).not.toBeInTheDocument();
    });

    it("deve renderizar botão de excluir para cada anexo", () => {
        render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

        const excluirButton = screen.getByRole("button", {
            name: /Excluir arquivo/i,
        });
        expect(excluirButton).toBeInTheDocument();
        expect(screen.getByText("Excluir arquivo")).toBeInTheDocument();
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

        expect(excluirButtons[0]).toHaveTextContent("Excluir arquivo");
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
            screen.getByText("Anexado por: Maria Silva")
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
        const anexo1: AnexoAPI = {
            ...anexoAPIMock,
            usuario_username: "user1",
            usuario_nome: "user1",
        };
        const anexo2: AnexoAPI = {
            ...anexoAPIMock,
            uuid: "api-uuid-2",
            nome_original: "doc2.pdf",
            usuario_username: "user2",
            usuario_nome: "user2",
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

        excluirButtons.forEach((button) => {
            expect(button).toHaveTextContent(/Excluir arquivo/);
        });
    });

    it("abre o modal ao clicar em Excluir arquivo e envia o UUID correto", () => {
        render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

        const button = screen.getByRole("button", { name: /Excluir arquivo/i });
        fireEvent.click(button);

        expect(ModalExcluir).toHaveBeenCalledWith(
            expect.objectContaining({
                open: true,
                uuid: "api-uuid-1",
            }),
            {}
        );

        expect(screen.getByText("Modal Aberto")).toBeInTheDocument();
        expect(screen.getByText("UUID: api-uuid-1")).toBeInTheDocument();
    });

    it("fecha o modal quando onOpenChange é acionado pelo modal", () => {
        render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

        const button = screen.getByRole("button", { name: /Excluir arquivo/i });
        fireEvent.click(button);

        const fechar = screen.getByRole("button", { name: /Fechar Modal/i });
        fireEvent.click(fechar);

        expect(ModalExcluir).toHaveBeenLastCalledWith(
            expect.objectContaining({
                open: false,
            }),
            {}
        );
    });

    it("não renderiza o conteúdo do modal quando open=false", () => {
        render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

        expect(screen.queryByText("Modal Aberto")).not.toBeInTheDocument();
    });

    describe("ListagemAnexos - modoVisualizacao", () => {
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
            usuario_nome: "Maria Silva",
        };

        it("deve renderizar botão de baixar e excluir quando modoVisualizacao=true", () => {
            const { container } = render(
                <ListagemAnexos
                    anexosAPI={[anexoAPIMock]}
                    modoVisualizacao={true}
                />
            );

            expect(
                screen.getByRole("button", { name: /Baixar arquivo/i })
            ).toBeInTheDocument();

            const excluirButtons = container.querySelectorAll(
                "button.border-\\[\\#B40C02\\].w-10"
            );
            expect(excluirButtons.length).toBeGreaterThan(0);
        });
        it("deve renderizar apenas botão de excluir quando modoVisualizacao=false", () => {
            render(
                <ListagemAnexos
                    anexosAPI={[anexoAPIMock]}
                    modoVisualizacao={false}
                />
            );

            expect(
                screen.queryByRole("button", { name: /Baixar arquivo/i })
            ).not.toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /Excluir arquivo/i })
            ).toBeInTheDocument();
        });

        it("deve renderizar apenas botão de excluir quando modoVisualizacao=undefined (padrão)", () => {
            render(<ListagemAnexos anexosAPI={[anexoAPIMock]} />);

            expect(
                screen.queryByRole("button", { name: /Baixar arquivo/i })
            ).not.toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /Excluir arquivo/i })
            ).toBeInTheDocument();
        });

        it("deve aplicar estilos corretos no botão de excluir no modo visualização", () => {
            const { container } = render(
                <ListagemAnexos
                    anexosAPI={[anexoAPIMock]}
                    modoVisualizacao={true}
                />
            );

            const excluirButton = container.querySelector(
                "button.border-\\[\\#B40C02\\].w-10"
            ) as HTMLButtonElement;
            expect(excluirButton).toBeInTheDocument();
            expect(excluirButton).toHaveClass(
                "border-[#B40C02]",
                "text-[#B40C02]"
            );
        });

        it("deve aplicar estilos corretos no botão de excluir quando não está no modo visualização", () => {
            render(
                <ListagemAnexos
                    anexosAPI={[anexoAPIMock]}
                    modoVisualizacao={false}
                />
            );

            const excluirButton = screen.getByRole("button", {
                name: /Excluir arquivo/i,
            });
            expect(excluirButton).toHaveClass(
                "border-[#B40C02]",
                "text-[#B40C02]"
            );
        });

        it("deve manter funcionalidade de abrir modal no modo visualização", () => {
            const { container } = render(
                <ListagemAnexos
                    anexosAPI={[anexoAPIMock]}
                    modoVisualizacao={true}
                />
            );

            const excluirButton = container.querySelector(
                "button.border-\\[\\#B40C02\\].w-10"
            ) as HTMLButtonElement;
            expect(excluirButton).toBeInTheDocument();

            fireEvent.click(excluirButton);

            expect(screen.getByText("Modal Aberto")).toBeInTheDocument();
            expect(screen.getByText("UUID: api-uuid-1")).toBeInTheDocument();
        });

        it("deve manter funcionalidade de abrir modal quando não está no modo visualização", () => {
            render(
                <ListagemAnexos
                    anexosAPI={[anexoAPIMock]}
                    modoVisualizacao={false}
                />
            );

            const excluirButton = screen.getByRole("button", {
                name: /Excluir arquivo/i,
            });
            fireEvent.click(excluirButton);

            expect(screen.getByText("Modal Aberto")).toBeInTheDocument();
            expect(screen.getByText("UUID: api-uuid-1")).toBeInTheDocument();
        });

        it("deve renderizar múltiplos anexos corretamente no modo visualização", () => {
            const anexo2: AnexoAPI = {
                ...anexoAPIMock,
                uuid: "api-uuid-2",
                nome_original: "documento2.pdf",
            };

            render(
                <ListagemAnexos
                    anexosAPI={[anexoAPIMock, anexo2]}
                    modoVisualizacao={true}
                />
            );

            const baixarButtons = screen.getAllByRole("button", {
                name: /Baixar arquivo/i,
            });

            const excluirButtons = screen
                .getAllByRole("button")
                .filter(
                    (button) =>
                        button.innerHTML.includes("Trash2") ||
                        button.className.includes("border-[#B40C02]")
                );

            expect(baixarButtons).toHaveLength(2);
            expect(excluirButtons).toHaveLength(2);
        });
    });

    it("deve chamar a função de baixar arquivo quando o botão é clicado", () => {
        render(
            <ListagemAnexos
                anexosAPI={[anexoAPIMock]}
                modoVisualizacao={true}
            />
        );

        const baixarButton = screen.getByRole("button", {
            name: /Baixar arquivo/i,
        });
        fireEvent.click(baixarButton);

        expect(baixarMock).toHaveBeenCalledTimes(1);
        expect(baixarMock).toHaveBeenCalledWith(
            {
                uuid: "api-uuid-1",
                nomeArquivo: "relatorio.pdf",
            },
            {
                onError: expect.any(Function),
            }
        );
    });

    it("deve passar os parâmetros corretos para o hook de download", () => {
        render(
            <ListagemAnexos
                anexosAPI={[anexoAPIMock]}
                modoVisualizacao={true}
            />
        );

        const baixarButton = screen.getByRole("button", {
            name: /Baixar arquivo/i,
        });
        fireEvent.click(baixarButton);

        expect(baixarMock).toHaveBeenCalledWith(
            expect.objectContaining({
                uuid: anexoAPIMock.uuid,
                nomeArquivo: anexoAPIMock.nome_original,
            }),
            expect.objectContaining({
                onError: expect.any(Function),
            })
        );
    });

    it("deve mostrar toast de erro quando o download falhar", () => {
        const toastMock = vi.mocked(mockToast);

        render(
            <ListagemAnexos
                anexosAPI={[anexoAPIMock]}
                modoVisualizacao={true}
            />
        );

        const baixarButton = screen.getByRole("button", {
            name: /Baixar arquivo/i,
        });
        fireEvent.click(baixarButton);

        const onErrorCallback = baixarMock.mock.calls[0][1].onError;
        onErrorCallback();

        expect(toastMock).toHaveBeenCalledWith({
            variant: "error",
            title: "Não conseguimos baixar o arquivo",
            description: "Erro inesperado ao baixar o arquivo.",
        });
    });

    it("não deve desabilitar o botão de baixar quando isPending é false", () => {
        render(
            <ListagemAnexos
                anexosAPI={[anexoAPIMock]}
                modoVisualizacao={true}
            />
        );

        const baixarButton = screen.getByRole("button", {
            name: /Baixar arquivo/i,
        });
        expect(baixarButton).not.toBeDisabled();
    });

    it("deve funcionar corretamente para múltiplos anexos", () => {
        const anexo2: AnexoAPI = {
            ...anexoAPIMock,
            uuid: "api-uuid-2",
            nome_original: "documento2.pdf",
        };

        render(
            <ListagemAnexos
                anexosAPI={[anexoAPIMock, anexo2]}
                modoVisualizacao={true}
            />
        );

        const baixarButtons = screen.getAllByRole("button", {
            name: /Baixar arquivo/i,
        });

        fireEvent.click(baixarButtons[0]);
        expect(baixarMock).toHaveBeenCalledWith(
            expect.objectContaining({
                uuid: "api-uuid-1",
                nomeArquivo: "relatorio.pdf",
            }),
            expect.any(Object)
        );

        fireEvent.click(baixarButtons[1]);
        expect(baixarMock).toHaveBeenCalledWith(
            expect.objectContaining({
                uuid: "api-uuid-2",
                nomeArquivo: "documento2.pdf",
            }),
            expect.any(Object)
        );

        expect(baixarMock).toHaveBeenCalledTimes(2);
    });
});
