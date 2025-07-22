import { render, screen } from "@testing-library/react";
import { describe, it, afterEach, vi, expect } from "vitest";
import { Navbar } from "./Navbar";

interface MockUser {
    identificador: string;
    nome: string;
    perfil_acesso: string;
}
const mockUser: MockUser = {
    identificador: "12345",
    nome: "JOÃO DA SILVA",
    perfil_acesso: "ASSISTENTE DE DIRETOR",
};

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: (selector: (state: { user: MockUser }) => unknown) =>
        selector({ user: mockUser }),
}));

vi.mock("next/image", () => ({
    __esModule: true,
    default: (props: React.ComponentProps<"img">) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <img {...props} />;
    },
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
}));

describe("Navbar", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("deve renderizar a logo", () => {
        render(<Navbar />);
        expect(screen.getByAltText("Logo GIPE")).toBeInTheDocument();
    });

    it("deve exibir o identificador do usuário", () => {
        render(<Navbar />);
        expect(screen.getByText(/RF: 12345/i)).toBeInTheDocument();
    });

    it("deve exibir o nome do usuário capitalizado", () => {
        render(<Navbar />);
        expect(screen.getByText(/joão da silva/i)).toBeInTheDocument();
    });

    it("deve exibir o perfil de acesso capitalizado", () => {
        render(<Navbar />);
        expect(screen.getByText(/assistente de diretor/i)).toBeInTheDocument();
    });

    it("deve renderizar o botão de sair", () => {
        render(<Navbar />);
        expect(
            screen.getByRole("button", { name: /sair/i })
        ).toBeInTheDocument();
    });

    it("não deve quebrar se não houver usuário logado", async () => {
        vi.doMock("@/stores/useUserStore", () => ({
            useUserStore: (selector: (state: { user: undefined }) => unknown) =>
                selector({ user: undefined }),
        }));
        vi.resetModules();
        const { Navbar: NavbarSemUser } = await import("./Navbar");
        render(<NavbarSemUser />);
        expect(screen.queryByText(/RF:/i)).not.toBeInTheDocument();
    });
});
