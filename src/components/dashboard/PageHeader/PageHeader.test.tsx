import { render, screen } from "@testing-library/react";
import PageHeader from "./PageHeader";
import { useRouter } from "next/navigation";
import { vi, describe, it, expect } from "vitest";

vi.mock("next/navigation", () => ({
    useRouter: vi.fn(),
}));

describe("PageHeader", () => {
    it("deve renderizar o título", () => {
        (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
            back: vi.fn(),
        });
        render(<PageHeader title="Test Title" />);
        expect(
            screen.getByRole("heading", { name: /test title/i })
        ).toBeInTheDocument();
    });

    it("deve renderizar o botão de voltar por padrão", () => {
        (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
            back: vi.fn(),
        });
        render(<PageHeader title="Test Title" />);
        expect(
            screen.getByRole("button", { name: /voltar/i })
        ).toBeInTheDocument();
    });

    it("não deve renderizar o botão de voltar se showBackButton for false", () => {
        (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
            back: vi.fn(),
        });
        render(<PageHeader title="Test Title" showBackButton={false} />);
        expect(
            screen.queryByRole("button", { name: /voltar/i })
        ).not.toBeInTheDocument();
    });

    it("deve chamar router.back ao clicar no botão de voltar", () => {
        const backMock = vi.fn();
        (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
            back: backMock,
        });
        render(<PageHeader title="Test Title" />);
        const backButton = screen.getByRole("button", { name: /voltar/i });
        backButton.click();
        expect(backMock).toHaveBeenCalled();
    });
});
