import { useMutation } from "@tanstack/react-query";
import { confirmarEmailAction } from "@/actions/confirmar-email";

const useConfirmarEmail = () => {
    return useMutation({
        mutationFn: confirmarEmailAction,
    });
};

export default useConfirmarEmail;
