import { Button } from "@/components/ui/button";

type BotoesNavegacaoSecaoProps = {
    showButtons: boolean;
    isValid: boolean;
    isPending?: boolean;
    onClickAnterior: () => void;
};

export function BotoesNavegacaoSecao({
    showButtons,
    isValid,
    isPending = false,
    onClickAnterior,
}: Readonly<BotoesNavegacaoSecaoProps>) {
    if (!showButtons) return null;

    return (
        <div className="flex justify-end gap-2">
            <Button
                size="sm"
                variant="customOutline"
                type="button"
                onClick={onClickAnterior}
            >
                Anterior
            </Button>
            <Button
                size="sm"
                type="submit"
                variant="submit"
                disabled={!isValid || isPending}
            >
                Próximo
            </Button>
        </div>
    );
}
