import { render, screen } from "@testing-library/react";
import PageHeader from "./PageHeader";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/hooks/useObterUsuarioGestao", () => ({
  useObterUsuarioGestao: vi.fn(),
}));

import { useObterUsuarioGestao } from "@/hooks/useObterUsuarioGestao";

describe("PageHeader", () => {
  it("deve renderizar o título", () => {
    (useObterUsuarioGestao as any).mockReturnValue({ data: { is_active: true } });
    render(<PageHeader title="Test Title" />);
    expect(screen.getByRole("heading", { name: /test title/i })).toBeInTheDocument();
  });

  it("deve renderizar o botão de voltar e o botão Inativar perfil no modo edit quando usuário ativo", () => {
    (useObterUsuarioGestao as any).mockReturnValue({ data: { is_active: true } });
    render(<PageHeader title="Test Title" edit={true} />);
    
    const backButton = screen.getByRole("link");
    expect(backButton).toHaveAttribute("href", "/dashboard/gestao-usuarios");

    const inativarButton = screen.getByRole("button", { name: /inativar perfil/i });
    expect(inativarButton).toBeInTheDocument();
  });

  it("deve renderizar o botão de Reativar perfil quando usuário inativo", () => {
    (useObterUsuarioGestao as any).mockReturnValue({ data: { is_active: false } });
    render(<PageHeader title="Test Title" edit={true} />);
    
    const reativarButton = screen.getByRole("button", { name: /reativar perfil/i });
    expect(reativarButton).toBeInTheDocument();
  });

  it("deve renderizar o botão de voltar com texto 'Voltar' quando edit for false", () => {
    (useObterUsuarioGestao as any).mockReturnValue({ data: { is_active: true } });
    render(<PageHeader title="Test Title" edit={false} />);
    
    const backButton = screen.getByRole("link", { name: /voltar/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute("href", "/dashboard/gestao-usuarios");
  });
});
