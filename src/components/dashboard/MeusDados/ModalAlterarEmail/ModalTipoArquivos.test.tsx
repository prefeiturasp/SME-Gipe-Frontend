import { render, screen, fireEvent } from "@testing-library/react";
import ModalTipoArquivos from "./ModalTipoArquivos";
import "@testing-library/jest-dom";

vi.mock("@/components/login/FormCadastro/Aviso", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="aviso">{children}</div>
  ),
}));

describe("ModalTipoArquivos", () => {
  const onOpenChange = vi.fn();

  it("renderiza corretamente com o modal aberto", () => {
    render(<ModalTipoArquivos open={true} onOpenChange={onOpenChange} />);

    // Título e descrição
    expect(
      screen.getByText("Formatos e tamanhos suportados")
    ).toBeInTheDocument();
    expect(screen.getByText("Confira os formatos permitidos")).toBeInTheDocument();

    // Verifica se os 4 tipos de cards renderizaram
    expect(screen.getByText("Imagens")).toBeInTheDocument();
    expect(screen.getByText("Vídeos")).toBeInTheDocument();
    expect(screen.getByText("Arquivos fechados")).toBeInTheDocument();
    expect(screen.getByText("Arquivos abertos")).toBeInTheDocument();

    // Verifica se o aviso aparece
    expect(screen.getByTestId("aviso")).toBeInTheDocument();
  });

  it("chama onOpenChange(false) ao clicar no botão Fechar", () => {
    render(<ModalTipoArquivos open={true} onOpenChange={onOpenChange} />);

    const closeButton = screen.getByRole("button", { name: /fechar/i });
    fireEvent.click(closeButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("não renderiza conteúdo quando open=false", () => {
    render(<ModalTipoArquivos open={false} onOpenChange={onOpenChange} />);
    expect(
      screen.queryByText("Formatos e tamanhos suportados")
    ).not.toBeInTheDocument();
  });
});
