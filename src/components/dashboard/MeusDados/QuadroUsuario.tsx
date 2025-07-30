import React from "react";
import User from "@/assets/icons/User";

interface QuadroUsuarioProps {
    nome: string;
    cpf: string;
    rf: string;
}

const QuadroUsuario: React.FC<QuadroUsuarioProps> = ({ nome, cpf, rf }) => {
    return (
        <div className="flex flex-col items-center justify-center bg-[#E8F0FE] rounded-[4px] p-6 h-[calc(100%_-_70px)]">
            <User width={48} height={48} fill="#717FC7" />
            <span className="mt-4 text-[24px] font-bold text-[#42474A] text-center">
                {nome}
            </span>
            <span className="mt-2 text-[14px] text-[#42474A] text-center">
                CPF: {cpf}
            </span>
            <span className="text-[14px] text-[#42474A] text-center">
                RF: {rf}
            </span>
        </div>
    );
};

export default QuadroUsuario;
