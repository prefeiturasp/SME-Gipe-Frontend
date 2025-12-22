import { render, screen } from "@testing-library/react";
import PageHeader from "./PageHeader";
import { describe, it, expect } from "vitest";

describe("PageHeader", () => {
    it("deve renderizar o título", () => {
        render(<PageHeader title="Test Title" />);
        expect(
            screen.getByRole("heading", { name: /test title/i })
        ).toBeInTheDocument();
    });

    it("deve renderizar o botão de voltar e o botão Inativar perfil no modo edit", () => {
        render(<PageHeader title="Test Title" edit={true} />);
        const backButton = screen.getByRole("link");
        expect(backButton).toHaveAttribute(
            "href",
            "/dashboard/gestao-usuarios"
        );
        expect(
            screen.getByRole("button", { name: /inativar perfil/i })
        ).toBeInTheDocument();
    });

    it("deve renderizar o botão de voltar com texto 'Voltar' quando edit for false", () => {
        render(<PageHeader title="Test Title" edit={false} />);
        const backButton = screen.getByRole("link", { name: /voltar/i });
        expect(backButton).toBeInTheDocument();
        expect(backButton).toHaveAttribute(
            "href",
            "/dashboard/gestao-usuarios"
        );
    });
});
