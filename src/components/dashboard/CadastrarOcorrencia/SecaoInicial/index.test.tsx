import { vi } from "vitest";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import SecaoInicial, { SecaoInicialRef } from "./index";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        back: vi.fn(),
    }),
}));

const fakeUser = {
    nome: "Usuário Teste",
    username: "382888888",
    perfil_acesso: { nome: "DRE Teste", codigo: 3360 },
    unidades: [
        {
            dre: {
                dre_uuid: "dre-uuid-001",
                codigo_eol: "001",
                nome: "DRE Teste",
                sigla: "DRT",
            },
            ue: {
                ue_uuid: "ue-uuid-0001",
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

let mockUser: typeof fakeUser = fakeUser;

vi.mock("@/stores/useUserStore", () => ({
    useUserStore: (selector: UseUserSelector) => selector({ user: mockUser }),
}));

const setFormDataMock = vi.fn();
const setSavedFormDataMock = vi.fn();
const setOcorrenciaIdMock = vi.fn();
let mockOcorrenciaUuid: string | null = null;
let mockFormData: Record<string, unknown> = {};
let mockSavedFormData: Record<string, unknown> = {};

const mockCriarOcorrencia = vi.fn();
const mockAtualizarOcorrencia = vi.fn();

vi.mock("@/stores/useOcorrenciaFormStore", () => ({
    useOcorrenciaFormStore: () => ({
        formData: mockFormData,
        savedFormData: mockSavedFormData,
        setFormData: setFormDataMock,
        setSavedFormData: setSavedFormDataMock,
        setOcorrenciaUuid: setOcorrenciaIdMock,
        ocorrenciaUuid: mockOcorrenciaUuid,
    }),
}));

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

const toastMock = vi.fn();
vi.mock("@/components/ui/headless-toast", () => ({
    toast: (opts: unknown) => toastMock(opts),
}));

let mockPermissions = {
    isGipe: false,
    isPontoFocal: false,
    isAssistenteOuDiretor: true,
    isGipeAdmin: false,
};

vi.mock("@/hooks/useUserPermissions", () => ({
    useUserPermissions: () => mockPermissions,
}));

type GetUnidadesReturn = {
    data: unknown[];
    isLoading: boolean;
    isError: boolean;
};

let mockGetUnidadesImpl: (
    _ativa?: boolean,
    _dre?: string,
    _tipo?: string,
) => GetUnidadesReturn = () => ({
    data: [],
    isLoading: false,
    isError: false,
});

vi.mock("@/hooks/useGetUnidades", () => ({
    useGetUnidades: (ativa?: boolean, dre?: string, tipo_unidade?: string) =>
        mockGetUnidadesImpl(ativa, dre, tipo_unidade),
}));

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );
};

describe("SecaoInicial", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
        mockOcorrenciaUuid = null;
        mockFormData = {};
        mockSavedFormData = {};
        setFormDataMock.mockClear();
        setSavedFormDataMock.mockClear();
        setOcorrenciaIdMock.mockClear();
        mockUser = fakeUser;
        mockPermissions = {
            isGipe: false,
            isPontoFocal: false,
            isAssistenteOuDiretor: true,
            isGipeAdmin: false,
        };
        mockGetUnidadesImpl = () => ({
            data: [],
            isLoading: false,
            isError: false,
        });
    });

    it("deve renderizar os campos corretamente com os valores do usuário", () => {
        renderWithClient(<SecaoInicial onSuccess={() => vi.fn()} />);

        expect(
            screen.getByText(/Quando a ocorrência aconteceu\?\*/i),
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Selecione a data"),
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Digite o horário"),
        ).toBeInTheDocument();

        expect(screen.getAllByText(/DRE Teste/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/EMEF Teste/i).length).toBeGreaterThan(0);

        expect(screen.getByText(/Patrimonial/)).toBeInTheDocument();
        expect(screen.getByText(/Interpessoal/)).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /Anterior/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Próximo/i }),
        ).toBeInTheDocument();
    });

    it("deve validar o preenchimento e habilitar o botão Próximo apenas quando o formulário estiver válido", async () => {
        renderWithClient(<SecaoInicial onSuccess={() => vi.fn()} />);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        expect(nextButton).toBeDisabled();

        const dateInput = screen.getByPlaceholderText("Selecione a data");
        const timeInput = screen.getByPlaceholderText("Digite o horário");
        const radioPatrimonial = screen.getByRole("radio", {
            name: /Patrimonial/,
        });

        await act(async () => {
            fireEvent.change(dateInput, { target: { value: "2025-10-02" } });
            fireEvent.blur(dateInput);
        });
        expect(dateInput).toHaveValue("2025-10-02");

        await act(async () => {
            fireEvent.change(timeInput, { target: { value: "14:30" } });
            fireEvent.blur(timeInput);
        });
        expect(timeInput).toHaveValue("14:30");

        expect(nextButton).toBeDisabled();

        await act(async () => {
            fireEvent.click(radioPatrimonial);
        });
        await waitFor(() =>
            expect(radioPatrimonial).toHaveAttribute("aria-checked", "true"),
        );

        await waitFor(() => expect(nextButton).toBeEnabled(), {
            timeout: 3000,
        });
    });

    it("não permite data futura e exibe erro", async () => {
        renderWithClient(<SecaoInicial onSuccess={() => vi.fn()} />);

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        expect(nextButton).toBeDisabled();

        const dateInput = screen.getByPlaceholderText("Selecione a data");
        const timeInput = screen.getByPlaceholderText("Digite o horário");

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear() + 1;
        const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const dd = String(tomorrow.getDate()).padStart(2, "0");
        const futureDate = `${yyyy}-${mm}-${dd}`;

        fireEvent.change(dateInput, { target: { value: futureDate } });
        expect(dateInput).toHaveValue(futureDate);

        fireEvent.change(timeInput, { target: { value: "14:30" } });
        expect(timeInput).toHaveValue("14:30");

        const error = await screen.findByText(
            /A data da ocorrência não pode ser no futuro\./i,
        );
        expect(error).toBeInTheDocument();

        expect(nextButton).toBeDisabled();
    });

    it("exibe erro quando a data é inválida (NaN)", async () => {
        const { container } = renderWithClient(
            <SecaoInicial onSuccess={() => vi.fn()} />,
        );

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        expect(nextButton).toBeDisabled();

        const dateInput = screen.getByPlaceholderText("Selecione a data");

        fireEvent.change(dateInput, { target: { value: "invalid-date" } });
        expect(dateInput).toHaveValue("");

        const formEl = container.querySelector("form") as HTMLFormElement;
        fireEvent.submit(formEl);

        const error = await screen.findByText(
            /A data da ocorrência é obrigatória\.|A data da ocorrência não pode ser no futuro\./i,
        );
        expect(error).toBeInTheDocument();

        expect(nextButton).toBeDisabled();
    });

    it("schema rejeita data inválida (NaN) via safeParse", async () => {
        const mod = await import("./schema");
        const formSchema = mod.formSchema;

        const result = formSchema.safeParse({
            dataOcorrencia: "invalid-date",
            horaOcorrencia: "14:30",
            dre: "DRE Teste",
            unidadeEducacional: "EMEF Teste",
            tipoOcorrencia: "Sim",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(
                (i: { message: string }) => i.message,
            );
            expect(messages).toContain(
                "A data da ocorrência não pode ser no futuro.",
            );
        }
    });

    it("schema exige hora quando foraHorarioFuncionamento é false e hora está vazia", async () => {
        const mod = await import("./schema");
        const formSchema = mod.formSchema;

        const result = formSchema.safeParse({
            dataOcorrencia: "2025-10-02",
            horaOcorrencia: "",
            dre: "001",
            unidadeEducacional: "0001",
            tipoOcorrencia: "Sim",
            foraHorarioFuncionamento: false,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            const messages = result.error.issues.map(
                (i: { message: string }) => i.message,
            );
            expect(messages).toContain(
                "O horário da ocorrência é obrigatório.",
            );
        }
    });

    it("schema aceita hora vazia quando foraHorarioFuncionamento é true", async () => {
        const mod = await import("./schema");
        const formSchema = mod.formSchema;

        const result = formSchema.safeParse({
            dataOcorrencia: "2025-10-02",
            horaOcorrencia: "",
            dre: "001",
            unidadeEducacional: "0001",
            tipoOcorrencia: "Sim",
            foraHorarioFuncionamento: true,
        });

        expect(result.success).toBe(true);
    });

    it("exibe toast quando submissão falha", async () => {
        const onSuccess = vi.fn();
        mockCriarOcorrencia.mockResolvedValue({
            success: false,
            error: "erro",
        });

        renderWithClient(<SecaoInicial onSuccess={onSuccess} />);

        const dateInput = screen.getByPlaceholderText("Selecione a data");
        const timeInput = screen.getByPlaceholderText("Digite o horário");
        const radioPatrimonial = screen.getByRole("radio", {
            name: /Patrimonial/,
        });

        await act(async () => {
            fireEvent.change(dateInput, { target: { value: "2025-10-02" } });
            fireEvent.blur(dateInput);
        });

        await act(async () => {
            fireEvent.change(timeInput, { target: { value: "14:30" } });
            fireEvent.blur(timeInput);
        });

        await act(async () => {
            fireEvent.click(radioPatrimonial);
        });

        await waitFor(() =>
            expect(radioPatrimonial).toHaveAttribute("aria-checked", "true"),
        );

        const nextButton = screen.getByRole("button", { name: /Próximo/i });

        await waitFor(() => expect(nextButton).toBeEnabled(), {
            timeout: 3000,
        });

        await act(async () => {
            fireEvent.click(nextButton);
        });

        await waitFor(() => expect(mockCriarOcorrencia).toHaveBeenCalled());
        await waitFor(() => expect(toastMock).toHaveBeenCalled());
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it("submete o formulário com sucesso e chama onSuccess", async () => {
        const onSuccess = vi.fn();
        mockCriarOcorrencia.mockResolvedValue({
            success: true,
            data: { uuid: "test-uuid" },
        });

        renderWithClient(<SecaoInicial onSuccess={onSuccess} />);

        const dateInput = screen.getByPlaceholderText("Selecione a data");
        const timeInput = screen.getByPlaceholderText("Digite o horário");
        const radioPatrimonial = screen.getByRole("radio", {
            name: /Patrimonial/,
        });

        await act(async () => {
            fireEvent.change(dateInput, { target: { value: "2025-10-02" } });
            fireEvent.blur(dateInput);
        });

        await act(async () => {
            fireEvent.change(timeInput, { target: { value: "14:30" } });
            fireEvent.blur(timeInput);
        });

        await act(async () => {
            fireEvent.click(radioPatrimonial);
        });

        await waitFor(() =>
            expect(radioPatrimonial).toHaveAttribute("aria-checked", "true"),
        );

        const nextButton = screen.getByRole("button", { name: /Próximo/i });

        await waitFor(() => expect(nextButton).toBeEnabled(), {
            timeout: 3000,
        });

        await act(async () => {
            fireEvent.click(nextButton);
        });

        await waitFor(() => expect(mockCriarOcorrencia).toHaveBeenCalled());
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

        vi.doMock("@/hooks/useSecaoInicial", () => ({
            useSecaoInicial: () => ({
                mutateAsync: vi.fn(),
                isPending: false,
            }),
        }));

        vi.doMock("@/hooks/useAtualizarSecaoInicial", () => ({
            useAtualizarSecaoInicial: () => ({
                mutateAsync: vi.fn(),
                isPending: false,
            }),
        }));

        vi.doMock("@/hooks/useUserPermissions", () => ({
            useUserPermissions: () => ({
                isGipe: false,
                isPontoFocal: false,
                isAssistenteOuDiretor: true,
                isGipeAdmin: false,
            }),
        }));

        vi.doMock("@/hooks/useGetUnidades", () => ({
            useGetUnidades: () => ({
                data: [],
                isLoading: false,
                isError: false,
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
            horaOcorrencia: "14:30",
            dre: "001",
            unidadeEducacional: "0001",
            tipoOcorrencia: "Sim",
            foraHorarioFuncionamento: false,
        };

        const mockSetFormData = vi.fn();
        const mockSetOcorrenciaUuid = vi.fn();
        const mockMutateCreate = vi.fn();
        const mockMutateUpdate = vi.fn();

        vi.doMock("next/navigation", () => ({
            useRouter: () => ({ back: vi.fn() }),
        }));

        vi.doMock("@/stores/useUserStore", () => ({
            useUserStore: (selector: UseUserSelector) =>
                selector({ user: fakeUser }),
        }));

        vi.doMock("@/hooks/useSecaoInicial", () => ({
            useSecaoInicial: () => ({
                mutateAsync: mockMutateCreate,
                isPending: false,
            }),
        }));

        vi.doMock("@/hooks/useAtualizarSecaoInicial", () => ({
            useAtualizarSecaoInicial: () => ({
                mutateAsync: mockMutateUpdate,
                isPending: false,
            }),
        }));

        vi.doMock("@/hooks/useUserPermissions", () => ({
            useUserPermissions: () => ({
                isGipe: false,
                isPontoFocal: false,
                isAssistenteOuDiretor: true,
                isGipeAdmin: false,
            }),
        }));

        vi.doMock("@/hooks/useGetUnidades", () => ({
            useGetUnidades: () => ({
                data: [],
                isLoading: false,
                isError: false,
            }),
        }));

        vi.doMock("@/stores/useOcorrenciaFormStore", () => ({
            useOcorrenciaFormStore: () => ({
                formData: preFilledFormData,
                savedFormData: preFilledFormData,
                setFormData: mockSetFormData,
                setSavedFormData: vi.fn(),
                setOcorrenciaUuid: mockSetOcorrenciaUuid,
                ocorrenciaUuid: "uuid-existente",
            }),
        }));

        const mod = await import("./index");
        const SecaoInicialIsolated = mod.default;

        const onSuccess = vi.fn();
        renderWithClient(<SecaoInicialIsolated onSuccess={onSuccess} />);

        const dateInput = screen.getByPlaceholderText("Selecione a data");
        expect(dateInput).toHaveValue("2025-10-02");

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled());

        fireEvent.click(nextButton);

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(mockMutateCreate).not.toHaveBeenCalled();
        expect(mockMutateUpdate).not.toHaveBeenCalled();
    });

    it("chama atualizarOcorrencia quando ocorrenciaUuid existe e formData foi alterado", async () => {
        vi.resetModules();

        const preFilledFormData = {
            dataOcorrencia: "2025-10-02",
            horaOcorrencia: "14:30",
            dre: "001",
            unidadeEducacional: "0001",
            tipoOcorrencia: "Sim",
        };

        const mockSetFormData = vi.fn();
        const mockSetOcorrenciaUuid = vi.fn();
        const mockMutateCreate = vi.fn();
        const mockMutateUpdate = vi.fn().mockResolvedValue({
            success: true,
        });

        vi.doMock("next/navigation", () => ({
            useRouter: () => ({ back: vi.fn() }),
        }));

        vi.doMock("@/stores/useUserStore", () => ({
            useUserStore: (selector: UseUserSelector) =>
                selector({ user: fakeUser }),
        }));

        vi.doMock("@/hooks/useSecaoInicial", () => ({
            useSecaoInicial: () => ({
                mutateAsync: mockMutateCreate,
                isPending: false,
            }),
        }));

        vi.doMock("@/hooks/useAtualizarSecaoInicial", () => ({
            useAtualizarSecaoInicial: () => ({
                mutateAsync: mockMutateUpdate,
                isPending: false,
            }),
        }));

        vi.doMock("@/hooks/useUserPermissions", () => ({
            useUserPermissions: () => ({
                isGipe: false,
                isPontoFocal: false,
                isAssistenteOuDiretor: true,
                isGipeAdmin: false,
            }),
        }));

        vi.doMock("@/hooks/useGetUnidades", () => ({
            useGetUnidades: () => ({
                data: [],
                isLoading: false,
                isError: false,
            }),
        }));

        vi.doMock("@/stores/useOcorrenciaFormStore", () => ({
            useOcorrenciaFormStore: () => ({
                formData: preFilledFormData,
                savedFormData: preFilledFormData,
                setFormData: mockSetFormData,
                setSavedFormData: vi.fn(),
                setOcorrenciaUuid: mockSetOcorrenciaUuid,
                ocorrenciaUuid: "uuid-existente",
            }),
        }));

        const mod = await import("./index");
        const SecaoInicialIsolated = mod.default;

        const onSuccess = vi.fn();
        renderWithClient(<SecaoInicialIsolated onSuccess={onSuccess} />);

        const dateInput = screen.getByPlaceholderText("Selecione a data");
        expect(dateInput).toHaveValue("2025-10-02");

        fireEvent.change(dateInput, { target: { value: "2025-10-05" } });
        expect(dateInput).toHaveValue("2025-10-05");

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled());

        fireEvent.click(nextButton);

        await waitFor(() => expect(mockMutateUpdate).toHaveBeenCalled());
        expect(mockMutateUpdate).toHaveBeenCalledWith({
            uuid: "uuid-existente",
            body: {
                data_ocorrencia: expect.any(String),
                unidade_codigo_eol: "0001",
                dre_codigo_eol: "001",
                sobre_furto_roubo_invasao_depredacao: true,
                fora_horario_funcionamento_ue: false,
            },
        });
        expect(mockMutateCreate).not.toHaveBeenCalled();
        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });

    it("exibe toast de erro quando atualizarOcorrencia falha", async () => {
        vi.resetModules();

        const preFilledFormData = {
            dataOcorrencia: "2025-10-02",
            horaOcorrencia: "14:30",
            dre: "001",
            unidadeEducacional: "0001",
            tipoOcorrencia: "Sim",
        };

        const mockSetFormData = vi.fn();
        const mockSetOcorrenciaUuid = vi.fn();
        const mockMutateCreate = vi.fn();
        const mockMutateUpdate = vi.fn().mockResolvedValue({
            success: false,
            error: "Erro ao atualizar",
        });
        const mockToast = vi.fn();

        vi.doMock("next/navigation", () => ({
            useRouter: () => ({ back: vi.fn() }),
        }));

        vi.doMock("@/stores/useUserStore", () => ({
            useUserStore: (selector: UseUserSelector) =>
                selector({ user: fakeUser }),
        }));

        vi.doMock("@/hooks/useSecaoInicial", () => ({
            useSecaoInicial: () => ({
                mutateAsync: mockMutateCreate,
                isPending: false,
            }),
        }));

        vi.doMock("@/hooks/useAtualizarSecaoInicial", () => ({
            useAtualizarSecaoInicial: () => ({
                mutateAsync: mockMutateUpdate,
                isPending: false,
            }),
        }));

        vi.doMock("@/hooks/useUserPermissions", () => ({
            useUserPermissions: () => ({
                isGipe: false,
                isPontoFocal: false,
                isAssistenteOuDiretor: true,
                isGipeAdmin: false,
            }),
        }));

        vi.doMock("@/hooks/useGetUnidades", () => ({
            useGetUnidades: () => ({
                data: [],
                isLoading: false,
                isError: false,
            }),
        }));

        vi.doMock("@/stores/useOcorrenciaFormStore", () => ({
            useOcorrenciaFormStore: () => ({
                formData: preFilledFormData,
                savedFormData: preFilledFormData,
                setFormData: mockSetFormData,
                setSavedFormData: vi.fn(),
                setOcorrenciaUuid: mockSetOcorrenciaUuid,
                ocorrenciaUuid: "uuid-existente",
            }),
        }));

        vi.doMock("@/components/ui/headless-toast", () => ({
            toast: (opts: unknown) => mockToast(opts),
        }));

        const mod = await import("./index");
        const SecaoInicialIsolated = mod.default;

        const onSuccess = vi.fn();
        renderWithClient(<SecaoInicialIsolated onSuccess={onSuccess} />);

        const dateInput = screen.getByPlaceholderText("Selecione a data");

        fireEvent.change(dateInput, { target: { value: "2025-10-05" } });

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled());

        fireEvent.click(nextButton);

        await waitFor(() => expect(mockMutateUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockToast).toHaveBeenCalled());
        expect(mockToast).toHaveBeenCalledWith({
            variant: "error",
            title: "Erro ao atualizar ocorrência",
            description: "Erro ao atualizar",
        });
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it("ao ativar o switch fora do horário, o campo de hora é limpo", async () => {
        const user = userEvent.setup();
        renderWithClient(<SecaoInicial onSuccess={() => vi.fn()} />);

        const timeInput = screen.getByPlaceholderText("Digite o horário");
        await act(async () => {
            fireEvent.change(timeInput, { target: { value: "14:30" } });
        });
        expect(timeInput).toHaveValue("14:30");

        const switchEl = screen.getByRole("switch");
        await user.click(switchEl);

        await waitFor(() => expect(timeInput).toHaveValue(""));
    });

    it("submete com hora 00:00 quando foraHorarioFuncionamento está ativo", async () => {
        const user = userEvent.setup();
        const onSuccess = vi.fn();
        mockCriarOcorrencia.mockResolvedValue({
            success: true,
            data: { uuid: "fora-horario-uuid" },
        });

        renderWithClient(<SecaoInicial onSuccess={onSuccess} />);

        const dateInput = screen.getByPlaceholderText("Selecione a data");
        await act(async () => {
            fireEvent.change(dateInput, { target: { value: "2025-10-02" } });
        });

        const switchEl = screen.getByRole("switch");
        await user.click(switchEl);

        const radioPatrimonial = screen.getByRole("radio", {
            name: /Patrimonial/,
        });
        await act(async () => {
            fireEvent.click(radioPatrimonial);
        });

        await waitFor(() =>
            expect(radioPatrimonial).toHaveAttribute("aria-checked", "true"),
        );

        const nextButton = screen.getByRole("button", { name: /Próximo/i });
        await waitFor(() => expect(nextButton).toBeEnabled(), {
            timeout: 3000,
        });

        await act(async () => {
            fireEvent.click(nextButton);
        });

        await waitFor(() =>
            expect(mockCriarOcorrencia).toHaveBeenCalledWith(
                expect.objectContaining({
                    fora_horario_funcionamento_ue: true,
                    data_ocorrencia: expect.any(String),
                }),
            ),
        );
        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    });

    describe("métodos expostos via ref", () => {
        it("deve retornar dados do formulário via getFormData", () => {
            const ref = React.createRef<SecaoInicialRef>();

            renderWithClient(<SecaoInicial ref={ref} />);

            const formData = ref.current?.getFormData();

            expect(formData).toBeDefined();
            expect(formData).toHaveProperty("dataOcorrencia");
            expect(formData).toHaveProperty("horaOcorrencia");
            expect(formData).toHaveProperty("dre");
            expect(formData).toHaveProperty("unidadeEducacional");
            expect(formData).toHaveProperty("tipoOcorrencia");
        });

        it("deve retornar instância do formulário via getFormInstance", () => {
            const ref = React.createRef<SecaoInicialRef>();

            renderWithClient(<SecaoInicial ref={ref} />);

            const formInstance = ref.current?.getFormInstance();

            expect(formInstance).toBeDefined();
            expect(formInstance).toHaveProperty("getValues");
            expect(formInstance).toHaveProperty("trigger");
            expect(formInstance).toHaveProperty("formState");
        });

        it("deve validar e submeter via submitForm quando dados são válidos", async () => {
            mockCriarOcorrencia.mockResolvedValue({
                success: true,
                data: { uuid: "new-uuid-123" },
            });

            const ref = React.createRef<SecaoInicialRef>();

            const onSuccess = vi.fn();
            renderWithClient(<SecaoInicial ref={ref} onSuccess={onSuccess} />);

            const dateInput = screen.getByPlaceholderText("Selecione a data");
            const timeInput = screen.getByPlaceholderText("Digite o horário");
            const simRadio = screen.getByLabelText("Patrimonial");

            await act(async () => {
                fireEvent.change(dateInput, {
                    target: { value: "2024-10-15" },
                });
                fireEvent.change(timeInput, { target: { value: "14:30" } });
                fireEvent.click(simRadio);
            });

            await waitFor(() => {
                expect(ref.current).not.toBeNull();
            });

            let result: boolean | undefined;
            await act(async () => {
                result = await ref.current?.submitForm();
            });

            expect(result).toBe(true);
            await waitFor(() => {
                expect(mockCriarOcorrencia).toHaveBeenCalled();
            });
        });

        it("deve retornar false em submitForm quando dados são inválidos", async () => {
            const ref = React.createRef<SecaoInicialRef>();

            renderWithClient(<SecaoInicial ref={ref} />);

            await waitFor(() => {
                expect(ref.current).not.toBeNull();
            });

            let result: boolean | undefined;
            await act(async () => {
                result = await ref.current?.submitForm();
            });

            expect(result).toBe(false);
            expect(mockCriarOcorrencia).not.toHaveBeenCalled();
        });
    });

    it("deve desabilitar todos os campos quando disabled=true", async () => {
        renderWithClient(
            <SecaoInicial onSuccess={() => vi.fn()} disabled={true} />,
        );

        const dataInput = screen.getByPlaceholderText("Selecione a data");
        const horaInput = screen.getByPlaceholderText("Digite o horário");
        expect(dataInput).toHaveAttribute("readonly");
        expect(horaInput).toHaveAttribute("readonly");

        const radioButtons = screen.getAllByRole("radio");
        radioButtons.forEach((radio) => {
            expect(radio).toBeDisabled();
        });
    });

    describe("comportamento por perfil de usuário", () => {
        const fakeDres = [
            {
                id: 1,
                uuid: "dre-uuid-100",
                nome: "DRE Norte",
                tipo_unidade: "DRE",
                rede_label: "Municipal",
                codigo_eol: "100",
                dre_nome: "",
                sigla: "DRN",
                status: "Ativa",
            },
            {
                id: 2,
                uuid: "dre-uuid-200",
                nome: "DRE Sul",
                tipo_unidade: "DRE",
                rede_label: "Municipal",
                codigo_eol: "200",
                dre_nome: "",
                sigla: "DRS",
                status: "Ativa",
            },
        ];

        const fakeUes = [
            {
                id: 10,
                uuid: "ue-uuid-1001",
                nome: "EMEF Alpha",
                tipo_unidade: "EMEF",
                rede_label: "Municipal",
                codigo_eol: "1001",
                dre_nome: "DRE Norte",
                sigla: "EMEF",
                status: "Ativa",
            },
            {
                id: 11,
                uuid: "ue-uuid-1002",
                nome: "EMEF Beta",
                tipo_unidade: "EMEF",
                rede_label: "Municipal",
                codigo_eol: "1002",
                dre_nome: "DRE Norte",
                sigla: "EMEF",
                status: "Ativa",
            },
        ];

        it("deve exibir DRE desabilitada e UE habilitada para Ponto Focal", () => {
            mockPermissions = {
                isGipe: false,
                isPontoFocal: true,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            };
            mockGetUnidadesImpl = (
                _ativa?: boolean,
                _dre?: string,
                tipo_unidade?: string,
            ) => {
                if (tipo_unidade === "DRE") {
                    return { data: [], isLoading: false, isError: false };
                }
                return {
                    data: fakeUes,
                    isLoading: false,
                    isError: false,
                };
            };

            renderWithClient(<SecaoInicial onSuccess={() => {}} />);

            const comboboxes = screen.getAllByRole("combobox");
            const dreTrigger = comboboxes[0];
            expect(dreTrigger).toBeDisabled();

            const ueTrigger = comboboxes[1];
            expect(ueTrigger).not.toBeDisabled();
        });

        it("deve exibir DRE e UE habilitadas para GIPE", () => {
            mockPermissions = {
                isGipe: true,
                isPontoFocal: false,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            };
            mockGetUnidadesImpl = (
                _ativa?: boolean,
                _dre?: string,
                tipo_unidade?: string,
            ) => {
                if (tipo_unidade === "DRE") {
                    return {
                        data: fakeDres,
                        isLoading: false,
                        isError: false,
                    };
                }
                return { data: [], isLoading: false, isError: false };
            };

            renderWithClient(<SecaoInicial onSuccess={() => {}} />);

            const comboboxes = screen.getAllByRole("combobox");
            const dreTrigger = comboboxes[0];
            expect(dreTrigger).not.toBeDisabled();

            const ueTrigger = comboboxes[1];
            expect(ueTrigger).toBeDisabled();
        });

        it("deve desabilitar DRE e UE quando ocorrenciaUuid existe para GIPE", () => {
            mockPermissions = {
                isGipe: true,
                isPontoFocal: false,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            };
            mockOcorrenciaUuid = "uuid-existente";
            mockFormData = {
                dre: "001",
                unidadeEducacional: "0001",
                dataOcorrencia: "2025-10-02",
                horaOcorrencia: "14:30",
                tipoOcorrencia: "Sim",
            };
            mockGetUnidadesImpl = () => ({
                data: fakeDres,
                isLoading: false,
                isError: false,
            });

            renderWithClient(<SecaoInicial onSuccess={() => {}} />);

            const comboboxes = screen.getAllByRole("combobox");
            const dreTrigger = comboboxes[0];
            const ueTrigger = comboboxes[1];

            expect(dreTrigger).toBeDisabled();
            expect(ueTrigger).toBeDisabled();
        });

        it("deve manter DRE e UE desabilitadas para Diretor/Assistente", () => {
            renderWithClient(<SecaoInicial onSuccess={() => vi.fn()} />);

            const comboboxes = screen.getAllByRole("combobox");
            const dreTrigger = comboboxes[0];
            const ueTrigger = comboboxes[1];

            expect(dreTrigger).toBeDisabled();
            expect(ueTrigger).toBeDisabled();
        });

        it("deve sincronizar o dreUuid ao retornar ao form com DRE preenchida (GIPE)", async () => {
            mockUser = {
                ...fakeUser,
                perfil_acesso: { nome: "GIPE", codigo: 0 },
                unidades: [
                    {
                        ...fakeUser.unidades[0],
                        dre: {
                            ...fakeUser.unidades[0].dre,
                            dre_uuid: "",
                        },
                    },
                ],
            };
            mockPermissions = {
                isGipe: true,
                isPontoFocal: false,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            };
            mockFormData = { dre: "100" };
            const mockSpy = vi.fn(
                (_ativa?: boolean, _dre?: string, tipo_unidade?: string) => {
                    if (tipo_unidade === "DRE") {
                        return {
                            data: fakeDres,
                            isLoading: false,
                            isError: false,
                        };
                    }
                    return { data: [], isLoading: false, isError: false };
                },
            );
            mockGetUnidadesImpl = mockSpy;

            renderWithClient(<SecaoInicial onSuccess={() => {}} />);

            await waitFor(() => {
                const calls = mockSpy.mock.calls;
                const ueCall = calls.find((c) => c[1] === "dre-uuid-100");
                expect(ueCall).toBeDefined();
            });
        });

        it("deve chamar handleDreChange ao selecionar DRE para GIPE", async () => {
            const user = userEvent.setup();
            mockPermissions = {
                isGipe: true,
                isPontoFocal: false,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            };
            mockGetUnidadesImpl = (
                _ativa?: boolean,
                _dre?: string,
                tipo_unidade?: string,
            ) => {
                if (tipo_unidade === "DRE") {
                    return {
                        data: fakeDres,
                        isLoading: false,
                        isError: false,
                    };
                }
                return { data: [], isLoading: false, isError: false };
            };

            renderWithClient(<SecaoInicial onSuccess={() => {}} />);

            const comboboxes = screen.getAllByRole("combobox");
            const dreTrigger = comboboxes[0];

            await user.click(dreTrigger);

            const dreOptions = await screen.findAllByText("DRE Norte");
            await user.click(dreOptions[dreOptions.length - 1]);

            await waitFor(() => {
                expect(setFormDataMock).toHaveBeenCalledWith(
                    expect.objectContaining({ nomeDre: "DRE Norte" }),
                );
            });
        });

        it("deve chamar handleUeChange ao selecionar UE para Ponto Focal", async () => {
            const user = userEvent.setup();
            mockPermissions = {
                isGipe: false,
                isPontoFocal: true,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            };
            mockGetUnidadesImpl = (
                _ativa?: boolean,
                _dre?: string,
                tipo_unidade?: string,
            ) => {
                if (tipo_unidade === "DRE") {
                    return { data: fakeDres, isLoading: false, isError: false };
                }
                return { data: fakeUes, isLoading: false, isError: false };
            };

            renderWithClient(<SecaoInicial onSuccess={() => {}} />);

            const comboboxes = screen.getAllByRole("combobox");
            const ueTrigger = comboboxes[1];

            await user.click(ueTrigger);

            const ueOptions = await screen.findAllByText("EMEF Alpha");
            await user.click(ueOptions[ueOptions.length - 1]);

            await waitFor(() => {
                expect(setFormDataMock).toHaveBeenCalledWith(
                    expect.objectContaining({ nomeUnidade: "EMEF Alpha" }),
                );
            });
        });

        it("deve exibir placeholder de carregamento para DRE (GIPE)", () => {
            mockPermissions = {
                isGipe: true,
                isPontoFocal: false,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            };
            mockGetUnidadesImpl = (
                _ativa?: boolean,
                _dre?: string,
                tipo_unidade?: string,
            ) => {
                if (tipo_unidade === "DRE") {
                    return { data: [], isLoading: true, isError: false };
                }
                return { data: [], isLoading: false, isError: false };
            };

            renderWithClient(<SecaoInicial onSuccess={() => {}} />);

            expect(screen.getByText("Carregando...")).toBeInTheDocument();
        });

        it("deve exibir mensagem de erro no placeholder para DRE (GIPE)", () => {
            mockPermissions = {
                isGipe: true,
                isPontoFocal: false,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            };
            mockGetUnidadesImpl = (
                _ativa?: boolean,
                _dre?: string,
                tipo_unidade?: string,
            ) => {
                if (tipo_unidade === "DRE") {
                    return { data: [], isLoading: false, isError: true };
                }
                return { data: [], isLoading: false, isError: false };
            };

            renderWithClient(<SecaoInicial onSuccess={() => {}} />);

            expect(
                screen.getByText("Erro ao carregar DREs"),
            ).toBeInTheDocument();
        });

        it("deve exibir placeholder de carregamento para UE quando DRE está selecionada (GIPE)", () => {
            mockPermissions = {
                isGipe: true,
                isPontoFocal: false,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            };
            mockFormData = { dre: "100" };
            mockGetUnidadesImpl = (
                _ativa?: boolean,
                _dre?: string,
                tipo_unidade?: string,
            ) => {
                if (tipo_unidade === "DRE") {
                    return { data: fakeDres, isLoading: false, isError: false };
                }
                return { data: [], isLoading: true, isError: false };
            };

            renderWithClient(<SecaoInicial onSuccess={() => {}} />);

            const allCarregando = screen.queryAllByText("Carregando...");
            expect(allCarregando.length).toBeGreaterThan(0);
        });

        it("deve exibir mensagem de erro no placeholder para UE quando DRE está selecionada (GIPE)", () => {
            mockPermissions = {
                isGipe: true,
                isPontoFocal: false,
                isAssistenteOuDiretor: false,
                isGipeAdmin: false,
            };
            mockFormData = { dre: "100" };
            mockGetUnidadesImpl = (
                _ativa?: boolean,
                _dre?: string,
                tipo_unidade?: string,
            ) => {
                if (tipo_unidade === "DRE") {
                    return { data: fakeDres, isLoading: false, isError: false };
                }
                return { data: [], isLoading: false, isError: true };
            };

            renderWithClient(<SecaoInicial onSuccess={() => {}} />);

            expect(
                screen.getByText("Erro ao carregar unidades"),
            ).toBeInTheDocument();
        });
    });
});
