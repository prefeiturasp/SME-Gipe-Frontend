import React from "react";
import Header from "./Header";
import QuadroUsuario from "./QuadroUsuario";

import QuadroBranco from "../QuadroBranco/QuadroBranco";
import FormDados from "./FormDados";

const MeusDados: React.FC = () => {
    return (
        <>
            <Header />
            <QuadroBranco>
                <span className="text-[14px] text-[#42474a]">
                    Esses são os seus dados cadastrados. Você pode alterá-los
                    clicando no botão editar.
                </span>
                <div className="flex flex-col md:flex-row gap-8 items-stretch">
                    <div className="w-full md:w-1/2 flex flex-col flex-1 self-stretch">
                        <QuadroUsuario />
                    </div>
                    <FormDados />
                </div>
            </QuadroBranco>
        </>
    );
};

export default MeusDados;
