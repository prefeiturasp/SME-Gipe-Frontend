import { renderHook, act } from "@testing-library/react";
import { useHandleAprovarUsuario } from "./useHandleAprovarUsuario";
import * as aprovarHook from "@/hooks/useAprovarUsuarioGestao";
import { toast } from "@/components/ui/headless-toast";

vi.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

vi.mock("@/components/ui/headless-toast", () => ({
    toast: vi.fn(),
}));

describe("useHandleAprovarUsuario", () => {
    it("deve retornar precocemente se usuarioParaAprovar for nulo", async () => {
        const mutateSpy = vi.fn();
        vi.spyOn(aprovarHook, "useAprovarUsuarioGestao").mockReturnValue({
            mutateAsync: mutateSpy,
            isPending: false,
        } as unknown as ReturnType<typeof aprovarHook.useAprovarUsuarioGestao>);

        const { result } = renderHook(() => useHandleAprovarUsuario());

        await act(async () => {
            await result.current.handleAprovarPerfil();
        });

        expect(mutateSpy).not.toHaveBeenCalled();
        expect(toast).not.toHaveBeenCalled();
    });

    it("deve limpar o estado (onOpenChange) quando setUsuarioParaAprovar(null) for chamado", () => {
        const { result } = renderHook(() => useHandleAprovarUsuario());

        const usuarioSample: import("@/types/usuarios").Usuario = {
            id: 1,
            uuid: "1",
            perfil: "perfil",
            nome: "Nome",
            rf_ou_cpf: "",
            email: "email@example.com",
            rede: "",
            diretoria_regional: "",
            unidade_educacional: "",
        };

        act(() => {
            result.current.setUsuarioParaAprovar(usuarioSample);
        });
        expect(result.current.usuarioParaAprovar).not.toBeNull();

        act(() => {
            result.current.setUsuarioParaAprovar(null);
        });
        expect(result.current.usuarioParaAprovar).toBeNull();
    });
});
