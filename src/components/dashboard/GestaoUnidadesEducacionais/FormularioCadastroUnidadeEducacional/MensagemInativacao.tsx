interface MensagemInativacaoProps {
    motivoInativacao: string;
    dataInativacaoFormatada: string;
    responsavelInativacaoNome: string;
}

export default function MensagemInativacao({
    motivoInativacao,
    dataInativacaoFormatada,
    responsavelInativacaoNome,
}: Readonly<MensagemInativacaoProps>) {
    return (
        <div>
            <div
                className="p-4 mb-4 rounded-lg bg-[#E8F0FE] text-[#42474a] text-sm"
                role="alert"
                aria-label="Informações sobre inativação da unidade educacional"
            >
                <p className="font-bold">Motivo da inativação UE:</p>

                <p className="mt-2">{motivoInativacao}</p>
            </div>

            <p className="text-xs text-gray-500 italic">
                Inativado por {responsavelInativacaoNome} em{" "}
                {dataInativacaoFormatada}
            </p>
        </div>
    );
}
