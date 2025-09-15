import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Page from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function renderWithQueryProvider(ui: React.ReactElement) {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
}

const mutateAsyncMock = vi.fn().mockResolvedValue({ success: true });
vi.mock("@/hooks/useConfirmarEmail", () => ({
    __esModule: true,
    default: () => ({ mutateAsync: mutateAsyncMock, isPending: false }),
}));

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

describe("ConfirmarEmail Page", () => {
    it("renderiza o ConfirmarEmail com os params corretos", async () => {
        const params = {
            code: encodeURIComponent("uid123"),
        };
        renderWithQueryProvider(<Page params={params} />);
        await screen.findByText("Continuar no GIPE");
    });
    it("decodifica os params antes de passar para o ConfirmarEmail", async () => {
        const params = {
            code: encodeURIComponent("código@!"),
        };
        const { container } = renderWithQueryProvider(<Page params={params} />);

        await waitFor(() => {
            expect(container).toBeTruthy();
        });
    });
});
