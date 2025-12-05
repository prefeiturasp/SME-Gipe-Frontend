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

const mockToast = vi.fn();
vi.mock("@/components/ui/headless-toast", () => ({
    toast: (args: unknown) => mockToast(args),
}));

const mockMutateAsync = vi.fn();
vi.mock("@/hooks/useCadastro", () => ({
    __esModule: true,
    default: () => ({
        mutateAsync: mockMutateAsync,
        isPending: false,
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
        window.HTMLElement.prototype.scrollIntoView = vi.fn();
    });

    const preencherFormulario = async () => {
        const selectOption = async (
            comboboxIndex: number,
            optionName: string
        ) => {
            const comboboxes = screen.getAllByRole("combobox");
            const combobox = comboboxes[comboboxIndex];
            fireEvent.click(combobox);

            await waitFor(() => {
                const option = screen.getByRole("option", { name: optionName });
                expect(option).toBeInTheDocument();
            });

            const option = screen.getByRole("option", { name: optionName });
            fireEvent.click(option);
        };

        // Preencher nome completo
        const inputFullName = screen.getByTestId("input-fullName");
        fireEvent.change(inputFullName, {
            target: { value: "João da Silva" },
        });

        // Preencher CPF
        const inputCpf = screen.getByTestId("input-cpf");
        fireEvent.change(inputCpf, { target: { value: "12345678900" } });

        // Preencher e-mail
        const inputEmail = screen.getByTestId("input-email");
        fireEvent.change(inputEmail, {
            target: { value: "joao.silva@sme.prefeitura.sp.gov.br" },
        });

        // Selecionar perfil
        await selectOption(0, "Diretor(a)");

        // Selecionar DRE
        await selectOption(1, "DRE Butantã");

        // Selecionar UE
        await waitFor(() => {
            expect(screen.getByText("EMEF João da Silva")).toBeInTheDocument();
        });
        await selectOption(2, "EMEF João da Silva");
    };

    it("renderiza o formulário corretamente", () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        expect(screen.getByTestId("input-fullName")).toBeInTheDocument();
        expect(screen.getByTestId("input-cpf")).toBeInTheDocument();
        expect(screen.getByTestId("input-email")).toBeInTheDocument();
        expect(screen.getByTestId("select-perfil")).toBeInTheDocument();
        expect(screen.getByTestId("select-dre")).toBeInTheDocument();
        expect(screen.getByTestId("select-ue")).toBeInTheDocument();
    });

    it("mostra erros de validação quando campos obrigatórios não são preenchidos", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const submitButton = screen.getByTestId("button-cadastrar");
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("DRE é obrigatória")).toBeInTheDocument();
        });
    });

    it("valida CPF inválido", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const inputCpf = screen.getByTestId("input-cpf");
        fireEvent.change(inputCpf, { target: { value: "11111111111" } });
        fireEvent.blur(inputCpf);

        await waitFor(() => {
            expect(screen.getByText("CPF inválido")).toBeInTheDocument();
        });
    });

    it("valida formato de e-mail institucional", async () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

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

    it("cadastra pessoa usuária com sucesso", async () => {
        mockMutateAsync.mockResolvedValueOnce({ success: true });

        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        await preencherFormulario();

        const submitButton = screen.getByTestId("button-cadastrar");
        await waitFor(() => expect(submitButton).toBeEnabled());
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith({
                username: "12345678900",
                name: "João da Silva",
                cpf: "12345678900",
                email: "joao.silva@sme.prefeitura.sp.gov.br",
                cargo: 3360,
                rede: "INDIRETA",
                unidades: ["ue-1"],
            });
            expect(mockToast).toHaveBeenCalledWith({
                title: "Sucesso!",
                description: "Pessoa usuária cadastrada com sucesso.",
                duration: 5000,
            });
            expect(mockPush).toHaveBeenCalledWith(
                "/dashboard/gestao/pessoa-usuaria"
            );
        });
    });

    it("mostra mensagem de erro quando cadastro falha", async () => {
        mockMutateAsync.mockResolvedValueOnce({
            success: false,
            error: "Já existe uma conta com este CPF.",
            field: "username",
        });

        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        await preencherFormulario();

        const submitButton = screen.getByTestId("button-cadastrar");
        await waitFor(() => expect(submitButton).toBeEnabled());
        fireEvent.click(submitButton);

        await waitFor(() =>
            expect(
                screen.getByText("Já existe uma conta com este CPF.")
            ).toBeInTheDocument()
        );
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

    it("desabilita campo UE quando DRE não está selecionada", () => {
        render(<FormularioCadastroPessoaUsuaria />, { wrapper });

        const ueCombobox = screen.getAllByRole("combobox")[2];
        expect(ueCombobox).toBeDisabled();
    });
});
