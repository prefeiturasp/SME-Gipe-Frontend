import { consultarRfUsuarioAction } from "@/actions/consultar-rf-usuario";
import { useMutation } from "@tanstack/react-query";

export function useConsultarRfUsuario() {
    return useMutation({
        mutationFn: (rf: string) => consultarRfUsuarioAction(rf),
    });
}
