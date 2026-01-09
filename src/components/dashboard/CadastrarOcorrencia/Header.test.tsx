import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Header from "./Header";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
    usePathname: () => "/",
}));

vi.mock("@/hooks/useUserPermissions");

describe("Header - Nova Ocorrência", () => {
    it('deve renderizar a mensagem e o botão "Nova ocorrência"', () => {
        render(<Header />);

        expect(
            screen.getByText(
                /Para registrar uma nova intercorrência institucional, clique no botão "nova ocorrência"/i
            )
        ).toBeInTheDocument();

        const button = screen.getByRole("link", {
            name: /\+ nova ocorrência/i,
        });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute(
            "href",
            "/dashboard/cadastrar-ocorrencia"
        );
    });
});
