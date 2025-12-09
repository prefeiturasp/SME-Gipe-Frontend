import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalExcluir } from "./ModalExcluir";
import "@testing-library/jest-dom";
import { vi } from "vitest";

const mutateAsyncMock = vi.fn();

vi.mock("@/hooks/useExcluirAnexo", () => ({
  useExcluirAnexo: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
  }),
}));

const toastMock = vi.fn();
vi.mock("@/components/ui/headless-toast", () => ({
  toast: (args: unknown) => toastMock(args),
}));

describe("ModalExcluir", () => {
  const onOpenChange = vi.fn();
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza corretamente quando open=true", () => {
    render(
      <ModalExcluir
        open={true}
        onOpenChange={onOpenChange}
        uuid="123"
      />
    );

    expect(
    screen.getByRole("heading", { name: /excluir documento/i })
    ).toBeInTheDocument();    
    
    expect(
      screen.getByText("Tem certeza que deseja excluir o documento em anexo?")
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /excluir documento/i })
    ).toBeInTheDocument();
  });

  it("não renderiza conteúdo quando open=false", () => {
    render(
      <ModalExcluir open={false} onOpenChange={onOpenChange} uuid="123" />
    );

    expect(
      screen.queryByText("Excluir Documento")
    ).not.toBeInTheDocument();
  });

  it("chama onOpenChange(false) ao clicar em Cancelar", () => {
    render(
      <ModalExcluir open={true} onOpenChange={onOpenChange} uuid="123" />
    );

    const cancelarBtn = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelarBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  // -------------------------------------------------------
  it("chama mutateAsync com o uuid ao clicar em Excluir Documento", async () => {
    mutateAsyncMock.mockResolvedValueOnce({ success: true });

    render(
      <ModalExcluir
        open={true}
        onOpenChange={onOpenChange}
        uuid="abc-123"
        onSuccess={onSuccess}
      />
    );

    const excluirBtn = screen.getByRole("button", { name: /excluir documento/i });
    fireEvent.click(excluirBtn);

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith("abc-123");
    });
  });

  // -------------------------------------------------------
  it("exibe toast de erro quando success=false", async () => {
    mutateAsyncMock.mockResolvedValueOnce({ success: false });

    render(
      <ModalExcluir
        open={true}
        onOpenChange={onOpenChange}
        uuid="123"
      />
    );

    const excluirBtn = screen.getByRole("button", { name: /excluir documento/i });
    fireEvent.click(excluirBtn);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "error" })
      );
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("ao success=true → chama onSuccess, fecha modal e mostra toast", async () => {
    mutateAsyncMock.mockResolvedValueOnce({ success: true });

    render(
      <ModalExcluir
        open={true}
        onOpenChange={onOpenChange}
        uuid="123"
        onSuccess={onSuccess}
      />
    );

    const excluirBtn = screen.getByRole("button", { name: /excluir documento/i });
    fireEvent.click(excluirBtn);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "success" })
    );
  });

   it("não chama mutateAsync quando uuid for null (cobre a verificação early return)", async () => {
    const onOpenChange = vi.fn();
    const onSuccess = vi.fn();

    render(
      <ModalExcluir
        open={true}
        onOpenChange={onOpenChange}
        uuid={null}
        onSuccess={onSuccess}
      />
    );

    const excluirBtn = screen.getByRole("button", { name: /Excluir Documento/i });
    fireEvent.click(excluirBtn);

    await waitFor(() => {
      expect(mutateAsyncMock).not.toHaveBeenCalled();
      expect(toastMock).not.toHaveBeenCalled();
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});
