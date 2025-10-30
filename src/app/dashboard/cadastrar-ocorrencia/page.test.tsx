import { render, screen } from "@testing-library/react";
import CadastrarOcorrenciaPage from "./page";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
}));

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};

describe("CadastrarOcorrenciaPage", () => {
    it("deve renderizar o componente CadastrarOcorrencia com os elementos principais", () => {
        renderWithClient(<CadastrarOcorrenciaPage />);

        expect(
            screen.getByRole("heading", {
                name: /intercorrências institucionais/i,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", { name: /nova ocorrência/i })
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /preencha as informações abaixo para registrar uma nova ocorrência/i
            )
        ).toBeInTheDocument();

        expect(screen.getByText("Cadastro de ocorrência")).toBeInTheDocument();
        expect(screen.getByText("Fase 02")).toBeInTheDocument();
        expect(screen.getByText("Fase 03")).toBeInTheDocument();
        expect(screen.getByText("Anexos")).toBeInTheDocument();
    });
});
