import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

const fakeUser = {
    nome: "Usuário Teste",
    username: "382888888",
    perfil_acesso: { nome: "DRE Teste", codigo: 123 },
    unidades: [
        {
            dre: { codigo_eol: "001", nome: "DRE Teste", sigla: "DRT" },
            ue: { codigo_eol: "0001", nome: "EMEF Teste", sigla: "EMEF" },
        },
    ],
    email: "a@b.com",
    cpf: "12345678900",
};

type UseUserSelector = (state: { user: typeof fakeUser }) => unknown;

export function mockUseUserStore() {
    return {
        useUserStore: (selector: UseUserSelector) =>
            selector({ user: fakeUser }),
    };
}

export function createDynamicStoreMock() {
    let currentFormData = {};

    const mockStoreState = {
        get formData() {
            return currentFormData;
        },
        savedFormData: {},
        setFormData: vi.fn((data) => {
            currentFormData = data;
        }),
        setSavedFormData: vi.fn(),
        setOcorrenciaUuid: vi.fn(),
        ocorrenciaUuid: null,
        reset: vi.fn(),
    };

    return {
        useOcorrenciaFormStore: (
            selector?: (state: typeof mockStoreState) => unknown
        ) => {
            if (typeof selector === "function") {
                return selector(mockStoreState);
            }
            return mockStoreState;
        },
    };
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
    },
});

export const renderWithClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};
