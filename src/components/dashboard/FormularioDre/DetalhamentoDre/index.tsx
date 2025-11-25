"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import QuadroBranco from "../../QuadroBranco/QuadroBranco";
import Anexos from "../../CadastrarOcorrencia/Anexos";
import { formSchema, FormularioDreData } from "./schema";
import { RadioForm } from "./RadioForm";
import { TextareaForm } from "./TextareaForm";

export function DetalhamentoDre() {
    const router = useRouter();
    const form = useForm<FormularioDreData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            acionamentoSegurancaPublica: undefined,
            interlocucaoSTS: undefined,
            informacoesComplementaresSTS: "",
            interlocucaoCPCA: undefined,
            informacoesComplementaresCPCA: "",
            interlocucaoSupervisaoEscolar: undefined,
            informacoesComplementaresSupervisaoEscolar: "",
            interlocucaoNAAPA: undefined,
            informacoesComplementaresNAAPA: "",
        },
    });

    const { isValid } = form.formState;

    const handlePrevious = () => {
        router.back();
    };

    return (
        <>
            <Form {...form}>
                <form>
                    <QuadroBranco>
                        <h2 className="text-[20px] font-bold text-[#42474a] mb-2">
                            Continuação da ocorrência
                        </h2>
                        <div className="flex flex-col gap-6">
                            <RadioForm
                                control={form.control}
                                name="acionamentoSegurancaPublica"
                                label="Houve acionamento da Secretaria de Seguranças Pública ou Forças de Segurança?"
                            />

                            <RadioForm
                                control={form.control}
                                name="interlocucaoSTS"
                                label="Houve interlocução com a Supervisão Técnica de Saúde (STS)?"
                            />

                            <TextareaForm
                                control={form.control}
                                name="informacoesComplementaresSTS"
                                label="Existe alguma informação complementar da atuação conjunta entre a DRE e o STS?"
                            />

                            <RadioForm
                                control={form.control}
                                name="interlocucaoCPCA"
                                label="Houve interlocução com a Coordenação de Políticas para Criança e Adolescente (CPCA)?"
                            />

                            <TextareaForm
                                control={form.control}
                                name="informacoesComplementaresCPCA"
                                label="Existe alguma informação complementar da atuação conjunta entre a DRE e o CPCA?"
                            />
                        </div>
                    </QuadroBranco>

                    <QuadroBranco>
                        <div className="flex flex-col gap-6">
                            <RadioForm
                                control={form.control}
                                name="interlocucaoSupervisaoEscolar"
                                label="Houve interlocução com a Supervisão Escolar?"
                            />

                            <TextareaForm
                                control={form.control}
                                name="informacoesComplementaresSupervisaoEscolar"
                                label="Existe alguma informação complementar da atuação conjunta entre a DRE e o Supervisão Escolar? Algum planejamento ou estratégias de ação?"
                            />
                        </div>
                    </QuadroBranco>

                    <QuadroBranco>
                        <div className="flex flex-col gap-6">
                            <RadioForm
                                control={form.control}
                                name="interlocucaoNAAPA"
                                label="Houve interlocução com o Núcleo de Apoio e Acompanhamento para a Aprendizagem (NAAPA)?"
                            />

                            <TextareaForm
                                control={form.control}
                                name="informacoesComplementaresNAAPA"
                                label="Existe alguma informação complementar da atuação conjunta entre a DRE e o NAAPA?"
                            />
                        </div>
                    </QuadroBranco>
                </form>
            </Form>

            <QuadroBranco>
                <Anexos showButtons={false} />

                <div className="flex justify-end gap-2">
                    <Button
                        variant="customOutline"
                        type="button"
                        onClick={handlePrevious}
                    >
                        Anterior
                    </Button>
                    <Button type="submit" variant="submit" disabled={!isValid}>
                        Salvar informações
                    </Button>
                </div>
            </QuadroBranco>
        </>
    );
}
