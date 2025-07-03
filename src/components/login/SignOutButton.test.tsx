import { render, screen, fireEvent } from "@testing-library/react";
import SignOutButton from "./SignOutButton";
import Cookies from "js-cookie";
import { vi, Mock } from "vitest";

const clearUserMock = vi.fn();
const pushMock = vi.fn();

vi.mock("js-cookie", () => ({
    default: {
        remove: vi.fn(),
    },
}));

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: (selector: (state: unknown) => unknown) =>
        selector({ clearUser: clearUserMock }),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

describe("SignOutButton", () => {
    beforeEach(() => {
        clearUserMock.mockClear();
        (Cookies.remove as Mock).mockClear();
        pushMock.mockClear();
    });

    it('renderiza o botão "Sair"', () => {
        render(<SignOutButton />);
        expect(
            screen.getByRole("button", { name: /sair/i })
        ).toBeInTheDocument();
    });

    it("executa clearUser, Cookies.remove e router.push ao clicar", () => {
        render(<SignOutButton />);
        fireEvent.click(screen.getByRole("button", { name: /sair/i }));

        expect(clearUserMock).toHaveBeenCalled();
        expect(Cookies.remove).toHaveBeenCalledWith("user_data", { path: "/" });
        expect(pushMock).toHaveBeenCalledWith("/login");
    });
});
