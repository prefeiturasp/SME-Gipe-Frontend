import { describe, it, expect, vi } from "vitest";
import { renderWithClient, mockUseUserStore } from "./helpers";
import { screen } from "@testing-library/react";

describe("Helpers - renderWithClient", () => {
    it("deve renderizar um componente com QueryClientProvider", () => {
        const TestComponent = () => <div>Test Component</div>;
        renderWithClient(<TestComponent />);
        expect(screen.getByText("Test Component")).toBeInTheDocument();
    });

    it("deve permitir renderizar múltiplos componentes", () => {
        const Component1 = () => <div>Component 1</div>;
        const Component2 = () => <div>Component 2</div>;

        renderWithClient(<Component1 />);
        expect(screen.getByText("Component 1")).toBeInTheDocument();

        const { container } = renderWithClient(<Component2 />);
        expect(container).toBeInTheDocument();
    });
});

describe("Helpers - mockUseUserStore", () => {
    it("deve retornar um mock funcional da useUserStore", () => {
        const { useUserStore } = mockUseUserStore();

        const result = useUserStore((state) => state.user);

        expect(result).toEqual({
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
        });
    });

    it("deve retornar dados específicos quando selector é usado", () => {
        const { useUserStore } = mockUseUserStore();

        const nome = useUserStore((state) => state.user.nome);
        const email = useUserStore((state) => state.user.email);
        const cpf = useUserStore((state) => state.user.cpf);

        expect(nome).toBe("Usuário Teste");
        expect(email).toBe("a@b.com");
        expect(cpf).toBe("12345678900");
    });

    it("deve retornar perfil de acesso correto", () => {
        const { useUserStore } = mockUseUserStore();

        const perfilAcesso = useUserStore((state) => state.user.perfil_acesso);

        expect(perfilAcesso).toEqual({
            nome: "DRE Teste",
            codigo: 123,
        });
    });

    it("deve retornar unidades corretas", () => {
        const { useUserStore } = mockUseUserStore();

        const unidades = useUserStore((state) => state.user.unidades) as Array<{
            dre: { codigo_eol: string; nome: string; sigla: string };
            ue: { codigo_eol: string; nome: string; sigla: string };
        }>;

        expect(unidades).toHaveLength(1);
        expect(unidades[0].dre.nome).toBe("DRE Teste");
        expect(unidades[0].ue.nome).toBe("EMEF Teste");
    });

    it("deve retornar username correto", () => {
        const { useUserStore } = mockUseUserStore();

        const username = useUserStore((state) => state.user.username);

        expect(username).toBe("382888888");
    });
});

describe("Helpers - createDynamicStoreMock", () => {
    it("deve criar um mock da store com formData vazio por padrão", async () => {
        vi.resetModules();

        const { createDynamicStoreMock } = await import("./helpers");
        const { useOcorrenciaFormStore } = createDynamicStoreMock();

        const formData = useOcorrenciaFormStore((state) => state.formData);

        expect(formData).toEqual({});
    });

    it("deve atualizar formData quando setFormData é chamado", async () => {
        vi.resetModules();

        const { createDynamicStoreMock } = await import("./helpers");
        const { useOcorrenciaFormStore } = createDynamicStoreMock();

        const store = useOcorrenciaFormStore() as {
            formData: Record<string, unknown>;
            setFormData: (data: Record<string, unknown>) => void;
        };

        expect(store.formData).toEqual({});

        store.setFormData({ teste: "valor", numero: 123 });

        expect(store.formData).toEqual({ teste: "valor", numero: 123 });

        store.setFormData({ novo: "dado" });
        expect(store.formData).toEqual({ novo: "dado" });
    });

    it("deve retornar todos os métodos da store", async () => {
        vi.resetModules();

        const { createDynamicStoreMock } = await import("./helpers");
        const { useOcorrenciaFormStore } = createDynamicStoreMock();

        const store = useOcorrenciaFormStore();

        expect(store).toHaveProperty("formData");
        expect(store).toHaveProperty("savedFormData");
        expect(store).toHaveProperty("setFormData");
        expect(store).toHaveProperty("setSavedFormData");
        expect(store).toHaveProperty("setOcorrenciaUuid");
        expect(store).toHaveProperty("ocorrenciaUuid");
        expect(store).toHaveProperty("reset");
    });

    it("deve ter ocorrenciaUuid como null por padrão", async () => {
        vi.resetModules();

        const { createDynamicStoreMock } = await import("./helpers");
        const { useOcorrenciaFormStore } = createDynamicStoreMock();

        const uuid = useOcorrenciaFormStore((state) => state.ocorrenciaUuid);

        expect(uuid).toBeNull();
    });

    it("deve ter savedFormData como objeto vazio por padrão", async () => {
        vi.resetModules();

        const { createDynamicStoreMock } = await import("./helpers");
        const { useOcorrenciaFormStore } = createDynamicStoreMock();

        const savedFormData = useOcorrenciaFormStore(
            (state) => state.savedFormData
        );

        expect(savedFormData).toEqual({});
    });
});
