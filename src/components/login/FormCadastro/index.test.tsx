/* eslint-disable @next/next/no-img-element */

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

// Mock do Next.js Image
vi.mock("next/image", () => ({
    default: (props: Record<string, unknown>) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { priority, ...rest } = props || {};
        return (
            <img alt={typeof rest.alt === "string" ? rest.alt : ""} {...rest} />
        );
    },
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

    it("renderiza todos os campos do formulário", async () => {
        render(<FormCadastro />, { wrapper });

        expect(
            await screen.findByText("Faça o seu cadastro")
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(
                "nome.sobrenome@sme.prefeitura.sp.gov.br"
            )
        ).toBeInTheDocument();
        expect(screen.getByText("Selecione a DRE")).toBeInTheDocument();
        expect(screen.getByText("Digite o nome da UE")).toBeInTheDocument();
        expect(screen.getByText("Qual o seu CPF?")).toBeInTheDocument();
    });

    it("desabilita o botão cadastrar quando campos estão vazios", async () => {
        render(<FormCadastro />, { wrapper });
        const button = screen.getByRole("button", { name: "Cadastrar agora" });
        expect(button).toBeDisabled();
    });

    it("habilita o combobox de UE somente após selecionar DRE", async () => {
        window.HTMLElement.prototype.scrollIntoView = vi.fn();

        render(<FormCadastro />, { wrapper });

        const [dreCombobox, ueCombobox] = screen.getAllByRole("combobox");

        expect(ueCombobox).toBeDisabled();

        fireEvent.click(dreCombobox);

        const dreOption = await waitFor(() =>
            within(document.body).getByRole("option", { name: "DRE Butantã" })
        );
        fireEvent.click(dreOption);

        expect(ueCombobox).not.toBeDisabled();
    });

    it("realiza cadastro com sucesso e mostra componente Finalizado", async () => {
        mutateAsyncMock.mockResolvedValueOnce({ success: true });

        render(<FormCadastro />, { wrapper });

        const fillField = (placeholder: string, value: string) => {
            const input = screen.getByPlaceholderText(placeholder);
            fireEvent.change(input, { target: { value } });
            fireEvent.blur(input);
        };

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

        await selectOption(0, "DRE Butantã");
        await selectOption(1, "EMEF João da Silva");
        fillField("Exemplo: Maria Clara Medeiros", "Maria Teste");
        fillField("123.456.789-10", "128.088.888-13");
        fillField(
            "nome.sobrenome@sme.prefeitura.sp.gov.br",
            "admin@example.com"
        );

        const cadastrarButton = await screen.findByRole("button", {
            name: "Cadastrar agora",
        });
        await waitFor(() => expect(cadastrarButton).toBeEnabled());
        fireEvent.click(cadastrarButton);

        await waitFor(() => expect(mutateAsyncMock).toHaveBeenCalled());
        const finalizarButton = await screen.findByRole("button", {
            name: /finalizar/i,
        });
        expect(finalizarButton).toBeInTheDocument();

        fireEvent.click(finalizarButton);
        expect(pushMock).toHaveBeenCalledWith("/");
    });

    it("mostra mensagem de erro quando cadastro falha", async () => {
        mutateAsyncMock.mockResolvedValueOnce({
            success: false,
            error: "Erro no cadastro",
        });

        render(<FormCadastro />, { wrapper });

        const fillField = (placeholder: string, value: string) => {
            const input = screen.getByPlaceholderText(placeholder);
            fireEvent.change(input, { target: { value } });
            fireEvent.blur(input);
        };

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

        await selectOption(0, "DRE Butantã");
        await selectOption(1, "EMEF João da Silva");
        fillField("Exemplo: Maria Clara Medeiros", "Maria Teste");
        fillField("123.456.789-10", "128.088.888-13");
        fillField(
            "nome.sobrenome@sme.prefeitura.sp.gov.br",
            "admin@example.com"
        );

        const cadastrarButton = await screen.findByRole("button", {
            name: "Cadastrar agora",
        });
        await waitFor(() => expect(cadastrarButton).toBeEnabled());
        fireEvent.click(cadastrarButton);

        await waitFor(() => {
            expect(screen.getByText("Erro no cadastro")).toBeInTheDocument();
        });
    });

    it("chama router.push ao clicar em Cancelar", async () => {
        render(<FormCadastro />, { wrapper });

        fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
        expect(pushMock).toHaveBeenCalledWith("/");
    });
});
