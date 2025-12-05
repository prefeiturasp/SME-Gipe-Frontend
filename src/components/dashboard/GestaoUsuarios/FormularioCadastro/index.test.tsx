import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import FormularioCadastroPessoaUsuaria from "./index";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

vi.mock("@/hooks/useUnidades", () => ({
    useFetchDREs: () => ({
        data: [
            { uuid: "dre-1", nome: "DRE Butantã" },
            { uuid: "dre-2", nome: "DRE Centro" },
        ],
    }),
    useFetchUEs: vi.fn((dreUuid: string) => {
        if (dreUuid === "dre-1") {
            return {
                data: [
                    { uuid: "ue-1", nome: "EMEF João da Silva" },
                    { uuid: "ue-2", nome: "EMEF Maria das Dores" },
                ],
            };
        }
        return { data: [] };
    }),
}));

describe("FormularioCadastroPessoaUsuaria", () => {
    let queryClient: QueryClient;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
    });

    beforeAll(() => {
        globalThis.HTMLElement.prototype.scrollIntoView = vi.fn();
    });

    it("renderiza o formulário corretamente", () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        expect(screen.getByTestId("select-rede")).toBeInTheDocument();
        expect(screen.getByTestId("select-cargo")).toBeInTheDocument();
        expect(screen.getByTestId("input-fullName")).toBeInTheDocument();
        expect(screen.getByTestId("input-rfOuCpf")).toBeInTheDocument();
        expect(screen.getByTestId("input-email")).toBeInTheDocument();
        expect(screen.getByTestId("select-dre")).toBeInTheDocument();
        expect(screen.getByTestId("select-ue")).toBeInTheDocument();
        expect(screen.getByTestId("checkbox-isAdmin")).toBeInTheDocument();
    });

    it("desabilita todos os campos quando rede não está selecionada", () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        expect(screen.getByTestId("select-cargo")).toBeDisabled();
        expect(screen.getByTestId("input-fullName")).toBeDisabled();
        expect(screen.getByTestId("input-rfOuCpf")).toBeDisabled();
        expect(screen.getByTestId("input-email")).toBeDisabled();
        expect(screen.getByTestId("select-dre")).toBeDisabled();
        expect(screen.getByTestId("select-ue")).toBeDisabled();
        expect(screen.getByTestId("checkbox-isAdmin")).toBeDisabled();
    });

    it("habilita campos após selecionar rede", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);

        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            expect(option).toBeInTheDocument();
        });

        const option = screen.getByRole("option", { name: "Direta" });
        fireEvent.click(option);

        await waitFor(() => {
            expect(screen.getByTestId("select-cargo")).toBeEnabled();
            expect(screen.getByTestId("input-fullName")).toBeEnabled();
            expect(screen.getByTestId("input-rfOuCpf")).toBeEnabled();
            expect(screen.getByTestId("input-email")).toBeEnabled();
            expect(screen.getByTestId("select-dre")).toBeEnabled();
        });
    });

    it("permite preencher nome completo", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        // Selecionar rede primeiro
        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            fireEvent.click(option);
        });

        const inputFullName = screen.getByTestId("input-fullName");
        fireEvent.change(inputFullName, {
            target: { value: "João da Silva" },
        });

        expect(inputFullName).toHaveValue("João da Silva");
    });

    it("permite preencher RF ou CPF", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        // Selecionar rede primeiro
        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            fireEvent.click(option);
        });

        const inputRfOuCpf = screen.getByTestId("input-rfOuCpf");
        fireEvent.change(inputRfOuCpf, { target: { value: "1234567" } });

        expect(inputRfOuCpf).toHaveValue("1234567");
    });

    it("permite preencher e-mail", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        // Selecionar rede primeiro
        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            fireEvent.click(option);
        });

        const inputEmail = screen.getByTestId("input-email");
        fireEvent.change(inputEmail, {
            target: { value: "joao.silva@sme.prefeitura.sp.gov.br" },
        });

        expect(inputEmail).toHaveValue("joao.silva@sme.prefeitura.sp.gov.br");
    });

    it("valida CPF inválido para rede indireta", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Indireta" });
            fireEvent.click(option);
        });

        const inputRfOuCpf = screen.getByTestId("input-rfOuCpf");
        fireEvent.change(inputRfOuCpf, { target: { value: "11111111111" } });
        fireEvent.blur(inputRfOuCpf);

        await waitFor(() => {
            expect(screen.getByText("CPF inválido")).toBeInTheDocument();
        });
    });

    it("valida formato de e-mail institucional", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        // Selecionar rede primeiro
        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            fireEvent.click(option);
        });

        const inputEmail = screen.getByTestId("input-email");
        fireEvent.change(inputEmail, {
            target: { value: "email@gmail.com" },
        });
        fireEvent.blur(inputEmail);

        await waitFor(() => {
            expect(
                screen.getByText(/Use apenas e-mails institucionais/i)
            ).toBeInTheDocument();
        });
    });

    it("limpa campo cargo ao trocar de rede", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        // Selecionar rede Direta
        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            fireEvent.click(option);
        });

        // Selecionar cargo
        const selectCargo = screen.getByTestId("select-cargo");
        fireEvent.click(selectCargo);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Diretor(a)" });
            fireEvent.click(option);
        });

        // Trocar para rede Indireta
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Indireta" });
            fireEvent.click(option);
        });

        // Verificar que o cargo foi limpo (placeholder deve estar visível)
        await waitFor(() => {
            expect(screen.getByText("Selecione")).toBeInTheDocument();
        });
    });

    it("desabilita campo UE quando DRE não está selecionada", () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const ueCombobox = screen.getByTestId("select-ue");
        expect(ueCombobox).toBeDisabled();
    });

    it("habilita campo UE após selecionar DRE", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        // Selecionar rede primeiro
        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            fireEvent.click(option);
        });

        // Selecionar DRE
        const dreCombobox = screen.getByTestId("select-dre");
        fireEvent.click(dreCombobox);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "DRE Butantã" });
            fireEvent.click(option);
        });

        // Verificar que UE foi habilitada
        await waitFor(() => {
            const ueCombobox = screen.getByTestId("select-ue");
            expect(ueCombobox).toBeEnabled();
        });
    });

    it("habilita checkbox de admin apenas para Ponto Focal ou GIPE", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        // Inicialmente desabilitado
        expect(screen.getByTestId("checkbox-isAdmin")).toBeDisabled();

        // Selecionar rede Direta
        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            fireEvent.click(option);
        });

        // Selecionar cargo Ponto Focal
        const selectCargo = screen.getByTestId("select-cargo");
        fireEvent.click(selectCargo);
        await waitFor(() => {
            const option = screen.getByRole("option", {
                name: "Ponto focal",
            });
            fireEvent.click(option);
        });

        // Verificar que checkbox foi habilitado
        await waitFor(() => {
            expect(screen.getByTestId("checkbox-isAdmin")).toBeEnabled();
        });
    });

    it("limpa campos DRE e UE ao selecionar cargo GIPE", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        // Selecionar rede Direta
        const selectRede = screen.getByTestId("select-rede");
        fireEvent.click(selectRede);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "Direta" });
            fireEvent.click(option);
        });

        // Selecionar DRE
        const dreCombobox = screen.getByTestId("select-dre");
        fireEvent.click(dreCombobox);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "DRE Butantã" });
            fireEvent.click(option);
        });

        // Selecionar UE
        const ueCombobox = screen.getByTestId("select-ue");
        fireEvent.click(ueCombobox);
        await waitFor(() => {
            const option = screen.getByRole("option", {
                name: "EMEF João da Silva",
            });
            fireEvent.click(option);
        });

        // Selecionar cargo GIPE
        const selectCargo = screen.getByTestId("select-cargo");
        fireEvent.click(selectCargo);
        await waitFor(() => {
            const option = screen.getByRole("option", { name: "GIPE" });
            fireEvent.click(option);
        });

        // Verificar que DRE e UE foram limpos e DRE está desabilitado
        await waitFor(() => {
            expect(screen.getByTestId("select-dre")).toBeDisabled();
            expect(screen.getByTestId("select-ue")).toBeDisabled();
        });
    });

    it("botão cancelar redireciona para a página de gestão de pessoas", () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const cancelarButton = screen.getByRole("button", {
            name: "Cancelar",
        });
        fireEvent.click(cancelarButton);

        expect(mockPush).toHaveBeenCalledWith(
            "/dashboard/gestao/pessoa-usuaria"
        );
    });
});
