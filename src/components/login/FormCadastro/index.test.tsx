import {
    render,
    screen,
    fireEvent,
    waitFor,
    within,
} from "@testing-library/react";
import FormCadastro from "./index";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mutateAsyncMock = vi.fn();
vi.mock("@/hooks/useCadastro", () => ({
    __esModule: true,
    default: () => ({
        mutateAsync: mutateAsyncMock,
        isPending: false,
    }),
}));

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/actions/unidades", () => ({
    getDREs: vi.fn().mockResolvedValue([
        { uuid: "dre-1", nome: "DRE Norte" },
        { uuid: "dre-2", nome: "DRE Sul" },
    ]),
    getUEs: vi.fn().mockImplementation((dreUuid: string) => {
        if (dreUuid === "dre-1") {
            return Promise.resolve([
                { uuid: "ue-1", nome: "EMEF João da Silva" },
                { uuid: "ue-2", nome: "EMEF Maria das Dores" },
            ]);
        }
        return Promise.resolve([]);
    }),
}));

describe("FormCadastro", () => {
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

    const preencherStep1 = async () => {
        const selectOption = async (
            comboboxIndex: number,
            optionName: string
        ) => {
            const combobox = screen.getAllByRole("combobox")[comboboxIndex];
            fireEvent.click(combobox);
            const option = await within(document.body).findByRole("option", {
                name: optionName,
            });
            fireEvent.click(option);
            await waitFor(() => expect(option).not.toBeInTheDocument());
            fireEvent.blur(combobox);
        };

        await selectOption(0, "DRE Norte");
        await selectOption(1, "EMEF João da Silva");

        fireEvent.change(
            screen.getByPlaceholderText("Exemplo: Maria Clara Medeiros"),
            { target: { value: "Maria Teste" } }
        );

        fireEvent.change(screen.getByPlaceholderText("123.456.789-10"), {
            target: { value: "128.088.888-13" },
        });
    };

    const irParaStep2 = async () => {
        const proximoBtn = screen.getByRole("button", {
            name: "Avançar",
        });
        await waitFor(() => expect(proximoBtn).toBeEnabled());
        fireEvent.click(proximoBtn);
    };

    const preencherStep2 = async (
        email: string,
        password: string,
        confirmPassword: string
    ) => {
        await waitFor(() =>
            expect(
                screen.getByLabelText("Qual o seu e-mail?")
            ).toBeInTheDocument()
        );
        fireEvent.change(
            screen.getByPlaceholderText("Digite o seu e-mail corporativo"),
            { target: { value: email } }
        );

        fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), {
            target: { value: password },
        });
        fireEvent.change(screen.getByPlaceholderText("Confirme sua senha"), {
            target: { value: confirmPassword },
        });
    };

    it("fluxo completo de cadastro com sucesso", async () => {
        mutateAsyncMock.mockResolvedValueOnce({ success: true });

        render(<FormCadastro />, { wrapper });

        await preencherStep1();
        await irParaStep2();

        await preencherStep2("admin@example.com", "Senha123!", "Senha123!");

        const cadastrarButton = screen.getByRole("button", {
            name: "Cadastrar agora",
        });
        await waitFor(() => expect(cadastrarButton).toBeEnabled());
        fireEvent.click(cadastrarButton);

        await waitFor(() => expect(mutateAsyncMock).toHaveBeenCalled());
        const finalizarButton = await screen.findByRole("button", {
            name: /finalizar/i,
        });
        fireEvent.click(finalizarButton);

        expect(pushMock).toHaveBeenCalledWith("/");
    });

    it("mostra erro quando senhas não coincidem e mantém botão desabilitado", async () => {
        render(<FormCadastro />, { wrapper });

        await preencherStep1();
        await irParaStep2();

        await preencherStep2("admin@example.com", "Senha123!", "OutraSenha!");

        await waitFor(() =>
            expect(
                screen.getByText("As senhas não coincidem")
            ).toBeInTheDocument()
        );

        const cadastrarButton = screen.getByRole("button", {
            name: "Cadastrar agora",
        });
        await waitFor(() => expect(cadastrarButton).toBeDisabled());
    });

    it("mostra mensagem de erro quando cadastro falha", async () => {
        mutateAsyncMock.mockResolvedValueOnce({
            success: false,
            error: "Erro no cadastro",
        });

        render(<FormCadastro />, { wrapper });

        await preencherStep1();
        await irParaStep2();

        await preencherStep2("admin@example.com", "Senha123!", "Senha123!");

        const cadastrarButton = screen.getByRole("button", {
            name: "Cadastrar agora",
        });
        await waitFor(() => expect(cadastrarButton).toBeEnabled());
        fireEvent.click(cadastrarButton);

        await waitFor(() =>
            expect(screen.getByText("Erro no cadastro")).toBeInTheDocument()
        );
    });

    it("botão voltar leva para a etapa 1", async () => {
        render(<FormCadastro />, { wrapper });

        await preencherStep1();
        await irParaStep2();

        await waitFor(() =>
            expect(
                screen.getByLabelText("Qual o seu e-mail?")
            ).toBeInTheDocument()
        );

        const btn = screen.getByRole("button", { name: /voltar/i });

        await waitFor(() => expect(btn).toBeInTheDocument());
        fireEvent.click(btn);
        await waitFor(() =>
            expect(screen.getByText("Selecione a DRE")).toBeInTheDocument()
        );
    });

    it("botão cancelar leva para a home", async () => {
        render(<FormCadastro />, { wrapper });

        const cancelarButton = screen.getByRole("button", { name: "Cancelar" });
        fireEvent.click(cancelarButton);

        expect(pushMock).toHaveBeenCalledWith("/");
    });

    it("botão cancelar na etapa 2 leva para a home", async () => {
        render(<FormCadastro />, { wrapper });

        await preencherStep1();
        await irParaStep2();

        await waitFor(() =>
            expect(
                screen.getByLabelText("Qual o seu e-mail?")
            ).toBeInTheDocument()
        );
        const cancelarButton = screen.getByRole("button", { name: "Cancelar" });
        fireEvent.click(cancelarButton);

        expect(pushMock).toHaveBeenCalledWith("/");
    });
});
