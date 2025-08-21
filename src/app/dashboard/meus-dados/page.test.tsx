import { vi } from "vitest";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        refresh: vi.fn(),
    }),
    usePathname: () => "/dashboard/meus-dados",
    useSearchParams: () => ({}),
    useParams: () => ({}),
}));

import { render, screen } from "@testing-library/react";
import MeusDadosPage from "./page";

vi.mock("@/stores/useUserStore", () => {
    return {
        useUserStore: vi.fn(),
    };
});

import { useUserStore } from "@/stores/useUserStore";
describe("MeusDadosPage", () => {
    it("deve renderizar o componente MeusDados", () => {
        render(<MeusDadosPage />);
        expect(
            screen.getByText(/esses são os seus dados cadastrados/i)
        ).toBeInTheDocument();
    });

    it("deve exibir o nome completo", () => {
        const fakeUser = {
            nome: "Fake User",
            perfil_acesso: "Assistente de diretor",
            unidade: [{ nomeUnidade: "Escola Fake" }],
        };

        (
            useUserStore as unknown as {
                mockImplementation: (fn: () => unknown) => void;
            }
        ).mockImplementation(() => fakeUser);
        render(<MeusDadosPage />);
        expect(screen.getByText(/fake user/i)).toBeInTheDocument();
    });

    it("deve exibir o botão Salvar alterações", () => {
        render(<MeusDadosPage />);
        expect(
            screen.getByRole("button", { name: /salvar alterações/i })
        ).toBeInTheDocument();
    });

    it("deve exibir o botão Cancelar", () => {
        render(<MeusDadosPage />);
        expect(
            screen.getByRole("link", { name: /cancelar/i })
        ).toBeInTheDocument();
    });
});
