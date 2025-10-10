import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { vi, Mock } from "vitest";
import { useUserPermissions } from "@/hooks/useUserPermissions";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
    usePathname: () => "/",
}));

vi.mock("@/hooks/useUserPermissions");

describe("Header - Nova Ocorrência", () => {
    it('deve renderizar a mensagem e o botão "Nova ocorrência" para diretores e assistentes', () => {
        (useUserPermissions as Mock).mockReturnValue({
            isAssistenteOuDiretor: true,
        });

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
        expect(button).toHaveAttribute("href", "/dashboard/nova-ocorrencia");
    });

    it('não deve renderizar o botão "Nova ocorrência" para outros perfis', () => {
        (useUserPermissions as Mock).mockReturnValue({
            isAssistenteOuDiretor: false,
        });

        render(<Header />);

        expect(
            screen.getByText(
                /Para registrar uma nova intercorrência institucional, clique no botão "nova ocorrência"/i
            )
        ).toBeInTheDocument();

        const button = screen.queryByRole("link", {
            name: /\+ nova ocorrência/i,
        });
        expect(button).not.toBeInTheDocument();
    });
});
