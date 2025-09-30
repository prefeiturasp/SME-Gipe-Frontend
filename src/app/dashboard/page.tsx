import PageHeader from "@/components/dashboard/PageHeader/PageHeader";
import QuadroBranco from "@/components/dashboard/QuadroBranco/QuadroBranco";
import TabelaOcorrencias from "@/components/dashboard/TabelaOcorrencias";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
    return (
        <div className="pt-4">
            <PageHeader
                title="Intercorrências Institucionais"
                showBackButton={false}
            />
            <QuadroBranco>
                <div className="flex flex-row space-x-4 items-center justify-between">
                    <span className="text-[14px] text-[#42474a]">
                        Para registrar uma nova intercorrência institucional,
                        clique no botão &quot;nova ocorrência&quot;
                    </span>

                    <Button
                        asChild
                        variant="submit"
                        size="sm"
                        className="font-normal"
                    >
                        <Link href="/dashboard/nova-ocorrencia" replace>
                            + Nova ocorrência
                        </Link>
                    </Button>
                </div>
            </QuadroBranco>
            <QuadroBranco>
                <TabelaOcorrencias />
            </QuadroBranco>
        </div>
    );
}
