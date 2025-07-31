import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const pushSpy = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushSpy,
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => "/dashboard/meus-dados",
}));

import Header from "./Header";

describe("Header", () => {
    beforeEach(() => {
        pushSpy.mockClear();
    });

    it("renderiza o título 'Meus dados'", () => {
        render(<Header />);
        expect(screen.getByText(/meus dados/i)).toBeInTheDocument();
    });

    it("renderiza o botão 'Voltar'", () => {
        render(<Header />);
        expect(
            screen.getByRole("button", { name: /voltar/i })
        ).toBeInTheDocument();
    });

    it("chama router.push('/dashboard') ao clicar no botão Voltar", async () => {
        const user = userEvent.setup();
        render(<Header />);
        const btn = screen.getByRole("button", { name: /voltar/i });
        await user.click(btn);
        expect(pushSpy).toHaveBeenCalledWith("/dashboard");
    });
});
