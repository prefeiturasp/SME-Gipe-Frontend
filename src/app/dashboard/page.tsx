import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import TabelaOcorrencias from "@/components/dashboard/TabelaOcorrencias";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    return (
        <div>
            <h1 className="px-[16px] pt-4 text-[24px] font-bold text-[#42474a]">
                Intercorrências Institucionais
            </h1>
            <QuadroBranco>
                <div className="flex flex-row space-x-4 items-center justify-between">
                    <span className="text-[14px] text-[#42474a]">
                        Para registrar uma nova intercorrência institucional,
                        clique no botão &quot;nova ocorrência&quot;
                    </span>
                    <Button variant="submit" size="sm" className="font-normal">
                        + Nova ocorrência
                    </Button>
                </div>
            </QuadroBranco>
            <QuadroBranco>
                <TabelaOcorrencias />
            </QuadroBranco>
        </div>
    );
}
