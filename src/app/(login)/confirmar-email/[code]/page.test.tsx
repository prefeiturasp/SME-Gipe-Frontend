import { render } from "@testing-library/react";
import Page from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function renderWithQueryProvider(ui: React.ReactElement) {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
}

describe("ConfirmarEmail Page", () => {
    it("renderiza o ConfirmarEmail com os params corretos", () => {
        const params = {
            code: encodeURIComponent("uid123"),
        };
        const { getByTestId } = renderWithQueryProvider(
            <Page params={params} />
        );
        expect(getByTestId("input-password")).toBeInTheDocument();
        expect(getByTestId("input-confirm-password")).toBeInTheDocument();
    });

    it("decodifica os params antes de passar para o ConfirmarEmail", () => {
        const params = {
            code: encodeURIComponent("código@!"),
        };
        const { container } = renderWithQueryProvider(<Page params={params} />);
        expect(container).toBeTruthy();
    });
});
