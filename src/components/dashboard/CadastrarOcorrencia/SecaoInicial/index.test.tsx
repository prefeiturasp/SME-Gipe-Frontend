import { vi } from "vitest";

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SecaoInicial from "./index";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
}));

const fakeUser = {
    nome: "Usuário Teste",
    username: "382888888",
    perfil_acesso: { nome: "DRE Teste", codigo: 123 },
    unidades: [
        {
            dre: {
                codigo_eol: "001",
                nome: "DRE Teste",
                sigla: "DRT",
            },
            ue: {
                codigo_eol: "0001",
                nome: "EMEF Teste",
                sigla: "EMEF",
            },
        },
    ],
    email: "a@b.com",
    cpf: "12345678900",
};

type UseUserSelector = (state: { user: typeof fakeUser }) => unknown;

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: (selector: UseUserSelector) => selector({ user: fakeUser }),
}));

const setFormDataMock = vi.fn();
const setOcorrenciaIdMock = vi.fn();
const mockOcorrenciaUuid = null;

vi.mock("@/stores/useOcorrenciaFormStore", () => ({
    useOcorrenciaFormStore: () => ({
        formData: {},
        setFormData: setFormDataMock,
        setOcorrenciaUuid: setOcorrenciaIdMock,
        ocorrenciaUuid: mockOcorrenciaUuid,
    }),
}));

const mockCriarOcorrencia = vi.fn();
const mockAtualizarOcorrencia = vi.fn();

vi.mock("@/hooks/useSecaoInicial", () => ({
    useSecaoInicial: () => ({
        mutateAsync: mockCriarOcorrencia,
        isPending: false,
    }),
}));

vi.mock("@/hooks/useAtualizarSecaoInicial", () => ({
    useAtualizarSecaoInicial: () => ({
        mutateAsync: mockAtualizarOcorrencia,
        isPending: false,
    }),
}));

const mutateMock = vi.fn();
vi.mock("@/hooks/useCadastrarOcorrencia", () => ({
    useCadastrarOcorrencia: () => ({
        mutateAsync: mutateMock,
        isPending: false,
    }),
}));

const toastMock = vi.fn();
vi.mock("@/components/ui/headless-toast", () => ({
    toast: (opts: unknown) => toastMock(opts),
}));

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};

describe("SecaoInicial", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        setFormDataMock.mockClear();
        setOcorrenciaIdMock.mockClear();
    });

    it("deve renderizar os campos corretamente com os valores do usuário", () => {
        renderWithClient(<SecaoInicial onSuccess={() => vi.fn()} />);

        expect(
            screen.getByLabelText(/Quando a ocorrência aconteceu\?\*/i)
        ).toBeInTheDocument();

        expect(screen.getAllByText(/DRE Teste/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/EMEF Teste/i).length).toBeGreaterThan(0);

        expect(screen.getByText(/Sim/)).toBeInTheDocument();
        expect(screen.getByText(/Não/)).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /Anterior/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Próximo/i })
        ).toBeInTheDocument();
    });

    it("deve validar o preenchimento e habilitar o botão Próximo apenas quando o formulário estiver válido", async () => {
        renderWithClient(<SecaoInicial onSuccess={() => vi.fn()} />);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        expect(nextButton).toBeDisabled();

        const dateInput = screen.getByLabelText<HTMLInputElement>(
            /Quando a ocorrência aconteceu\?\*/i
        );

        fireEvent.change(dateInput, { target: { value: "2025-10-02" } });
        expect(dateInput.value).toBe("2025-10-02");
        expect(nextButton).toBeDisabled();

        const radioSim = screen.getByRole("radio", { name: /Sim/ });
        fireEvent.click(radioSim);
        await waitFor(() =>
            expect(radioSim).toHaveAttribute("aria-checked", "true")
        );

        await waitFor(() => expect(nextButton).toBeEnabled());
    });

    it("não permite data futura e exibe erro", async () => {
        renderWithClient(<SecaoInicial onSuccess={() => vi.fn()} />);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        expect(nextButton).toBeDisabled();

        const dateInput = screen.getByLabelText<HTMLInputElement>(
            /Quando a ocorrência aconteceu\?\*/i
        );

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const dd = String(tomorrow.getDate()).padStart(2, "0");
        const futureDate = `${yyyy}-${mm}-${dd}`;

        fireEvent.change(dateInput, { target: { value: futureDate } });
        expect(dateInput.value).toBe(futureDate);

        const error = await screen.findByText(
            /A data da ocorrência não pode ser no futuro\./i
        );
        expect(error).toBeInTheDocument();

        expect(nextButton).toBeDisabled();
    });

    it("exibe erro quando a data é inválida (NaN)", async () => {
        const { container } = renderWithClient(
            <SecaoInicial onSuccess={() => vi.fn()} />
        );

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        expect(nextButton).toBeDisabled();

        const dateInput = screen.getByLabelText<HTMLInputElement>(
            /Quando a ocorrência aconteceu\?\*/i
        );

        fireEvent.change(dateInput, { target: { value: "invalid-date" } });
        expect(dateInput.value).toBe("");

        const formEl = container.querySelector("form") as HTMLFormElement;
        fireEvent.submit(formEl);

        const error = await screen.findByText(
            /A data da ocorrência é obrigatória\.|A data da ocorrência não pode ser no futuro\./i
        );
        expect(error).toBeInTheDocument();

        expect(nextButton).toBeDisabled();
    });

    it("schema rejeita data inválida (NaN) via safeParse", async () => {
        const mod = await import("./schema");
        const formSchema = mod.formSchema;

        const result = formSchema.safeParse({
            dataOcorrencia: "invalid-date",
            dre: "DRE Teste",
            unidadeEducacional: "EMEF Teste",
            tipoOcorrencia: "Sim",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(
                (i: { message: string }) => i.message
            );
            expect(messages).toContain(
                "A data da ocorrência não pode ser no futuro."
            );
        }
    });

    it("exibe toast quando submissão falha", async () => {
        const onSuccess = vi.fn();
        mutateMock.mockResolvedValue({ success: false, error: "erro" });

        renderWithClient(<SecaoInicial onSuccess={onSuccess} />);

        const dateInput = screen.getByLabelText<HTMLInputElement>(
            /Quando a ocorrência aconteceu\?\*/i
        );
        fireEvent.change(dateInput, { target: { value: "2025-10-02" } });

        const radioSim = screen.getByRole("radio", { name: /Sim/ });
        fireEvent.click(radioSim);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });

        await waitFor(() => expect(nextButton).toBeEnabled());
        fireEvent.click(nextButton);

        await waitFor(() => expect(mutateMock).toHaveBeenCalled());
        await waitFor(() => expect(toastMock).toHaveBeenCalled());
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it("submete o formulário com sucesso e chama onSuccess", async () => {
        const onSuccess = vi.fn();
        mutateMock.mockImplementationOnce(async () => {
            onSuccess();
            return { success: true, data: { uuid: "test-uuid" } };
        });

        renderWithClient(<SecaoInicial onSuccess={onSuccess} />);

        const dateInput = screen.getByLabelText<HTMLInputElement>(
            /Quando a ocorrência aconteceu\?\*/i
        );
        fireEvent.change(dateInput, { target: { value: "2025-10-02" } });

        const radioSim = screen.getByRole("radio", { name: /Sim/ });
        fireEvent.click(radioSim);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });

        await waitFor(() => expect(nextButton).toBeEnabled());
        fireEvent.click(nextButton);

        await waitFor(() => expect(mutateMock).toHaveBeenCalled());
        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });

    it("mostra placeholders quando códigos EOL estão ausentes", async () => {
        vi.resetModules();

        const userNoCodes = {
            ...fakeUser,
            unidades: [],
        };

        vi.doMock("next/navigation", () => ({
            useRouter: () => ({ back: vi.fn() }),
        }));

        vi.doMock("@/stores/useUserStore", () => ({
            useUserStore: (selector: UseUserSelector) =>
                selector({ user: userNoCodes as unknown as typeof fakeUser }),
        }));

        vi.doMock("@/hooks/useCadastrarOcorrencia", () => ({
            useCadastrarOcorrencia: () => ({
                mutateAsync: mutateMock,
                isPending: false,
            }),
        }));

        const mod = await import("./index");
        const SecaoInicialIsolated = mod.default;

        renderWithClient(<SecaoInicialIsolated onSuccess={() => {}} />);

        expect(screen.getByText(/Selecione a DRE/i)).toBeInTheDocument();
        expect(screen.getByText(/Selecione a unidade/i)).toBeInTheDocument();
    });

    it("chama apenas onSuccess sem fazer mutation quando formData já está preenchido", async () => {
        vi.resetModules();

        const preFilledFormData = {
            dataOcorrencia: "2025-10-02",
            dre: "001",
            unidadeEducacional: "0001",
            tipoOcorrencia: "Sim",
        };

        vi.doMock("next/navigation", () => ({
            useRouter: () => ({ back: vi.fn() }),
        }));

        vi.doMock("@/stores/useUserStore", () => ({
            useUserStore: (selector: UseUserSelector) =>
                selector({ user: fakeUser }),
        }));

        const mockMutate = vi.fn();
        vi.doMock("@/hooks/useCadastrarOcorrencia", () => ({
            useCadastrarOcorrencia: () => ({
                mutateAsync: mockMutate,
                isPending: false,
            }),
        }));

        vi.doMock("@/stores/useOcorrenciaFormStore", () => ({
            useOcorrenciaFormStore: () => ({
                formData: preFilledFormData,
                setFormData: vi.fn(),
                setOcorrenciaUuid: vi.fn(),
            }),
        }));

        const mod = await import("./index");
        const SecaoInicialIsolated = mod.default;

        const onSuccess = vi.fn();
        renderWithClient(<SecaoInicialIsolated onSuccess={onSuccess} />);

        const dateInput = screen.getByLabelText<HTMLInputElement>(
            /Quando a ocorrência aconteceu\?\*/i
        );
        expect(dateInput.value).toBe("2025-10-02");

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled());

        fireEvent.click(nextButton);

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(mockMutate).not.toHaveBeenCalled();
    });
});
