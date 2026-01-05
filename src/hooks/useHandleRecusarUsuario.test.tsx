import { renderHook, act } from "@testing-library/react";
import { useHandleRecusarUsuario } from "./useHandleRecusarUsuario";
import * as recusarHook from "@/hooks/useRecusarUsuarioGestao";
import { toast } from "@/components/ui/headless-toast";

vi.mock("@tanstack/react-query", () => ({
    useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));

vi.mock("@/components/ui/headless-toast", () => ({
    toast: vi.fn(),
}));

describe("useHandleRecusarUsuario", () => {
    it("deve retornar precocemente se usuarioParaRecusar for nulo", async () => {
        const mutateSpy = vi.fn();
        vi.spyOn(recusarHook, "useRecusarUsuarioGestao").mockReturnValue({
            mutateAsync: mutateSpy,
            isPending: false,
        } as unknown as ReturnType<typeof recusarHook.useRecusarUsuarioGestao>);

        const { result } = renderHook(() => useHandleRecusarUsuario());

        await act(async () => {
            await result.current.handleRecusarPerfil("Motivo qualquer");
        });

        expect(mutateSpy).not.toHaveBeenCalled();
        expect(toast).not.toHaveBeenCalled();
    });

    it("deve limpar o estado (onOpenChange) quando setUsuarioParaRecusar(null) for chamado", () => {
        const { result } = renderHook(() => useHandleRecusarUsuario());

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
            result.current.setUsuarioParaRecusar(usuarioSample);
        });
        expect(result.current.usuarioParaRecusar).not.toBeNull();

        act(() => {
            result.current.setUsuarioParaRecusar(null);
        });
        expect(result.current.usuarioParaRecusar).toBeNull();
    });
});
