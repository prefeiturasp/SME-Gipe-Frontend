import { render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { CamposRedeIndireta } from "./CamposRedeIndireta";
import type { FormDataCadastroUsuario } from "./schema";

const TestWrapper = ({
    showDRE = true,
    showUE = true,
    isFormDisabled = false,
    mode = "create",
}: {
    showDRE?: boolean;
    showUE?: boolean;
    isFormDisabled?: boolean;
    mode?: "create" | "edit";
}) => {
    const methods = useForm<FormDataCadastroUsuario>({
        defaultValues: {
            fullName: "",
            rf: "",
            cpf: "",
            email: "",
            dre: "",
            ue: "",
        },
    });

    const dreOptions = [
        { uuid: "dre-1", codigo_eol: "000001", nome: "DRE Centro" },
        { uuid: "dre-2", codigo_eol: "000002", nome: "DRE Sul" },
    ];

    const ueOptions = [
        { uuid: "ue-1", codigo_eol: "100001", nome: "EMEF Test 1" },
        { uuid: "ue-2", codigo_eol: "100002", nome: "EMEF Test 2" },
    ];

    const cargoOptions = [
        { value: "diretor", label: "Diretor(a)" },
        { value: "assistente", label: "Assistente de direção" },
    ];

    return (
        <FormProvider {...methods}>
            <CamposRedeIndireta
                form={methods}
                dreOptions={dreOptions}
                ueOptions={ueOptions}
                showDRE={showDRE}
                showUE={showUE}
                isFormDisabled={isFormDisabled}
                cargoOptions={cargoOptions}
                mode={mode}
            />
        </FormProvider>
    );
};

describe("CamposRedeIndireta", () => {
    it("renderiza todos os campos corretamente", () => {
        render(<TestWrapper />);
        expect(screen.getByTestId("select-cargo")).toBeInTheDocument();
        expect(screen.getByTestId("input-fullName")).toBeInTheDocument();
        expect(screen.getByTestId("input-email")).toBeInTheDocument();
        expect(screen.getByTestId("select-dre")).toBeInTheDocument();
        expect(screen.getByTestId("select-ue")).toBeInTheDocument();
    });

    it("exibe opções de cargo corretamente", () => {
        render(<TestWrapper />);
        const cargoSelect = screen.getByTestId("select-cargo");
        expect(cargoSelect).toBeInTheDocument();
    });

    it("não exibe campo CPF (agora é renderizado no componente pai)", () => {
        render(<TestWrapper />);
        expect(screen.queryByTestId("input-cpf")).not.toBeInTheDocument();
    });

    it("não exibe campo DRE quando showDRE é false", () => {
        render(<TestWrapper showDRE={false} />);
        expect(screen.queryByTestId("select-dre")).not.toBeInTheDocument();
    });

    it("não exibe campo UE quando showUE é false", () => {
        render(<TestWrapper showUE={false} />);
        expect(screen.queryByTestId("select-ue")).not.toBeInTheDocument();
    });

    it("não desabilita fullName e email em qualquer modo", () => {
        render(<TestWrapper />);
        expect(screen.getByTestId("input-fullName")).not.toBeDisabled();
        expect(screen.getByTestId("input-email")).not.toBeDisabled();
    });

    it("desabilita todos os campos quando isFormDisabled é true", () => {
        render(<TestWrapper isFormDisabled={true} />);
        expect(screen.getByTestId("select-cargo")).toBeDisabled();
        expect(screen.getByTestId("input-fullName")).toBeDisabled();
        expect(screen.getByTestId("input-email")).toBeDisabled();
        expect(screen.getByTestId("select-dre")).toBeDisabled();
        expect(screen.getByTestId("select-ue")).toBeDisabled();
    });

    it("aplica estilos cinza para todos os campos quando isFormDisabled é true", () => {
        render(<TestWrapper isFormDisabled={true} />);
        const fields = [
            screen.getByTestId("input-fullName"),
            screen.getByTestId("input-email"),
            screen.getByTestId("select-dre"),
            screen.getByTestId("select-ue"),
        ];
        fields.forEach((field) => {
            expect(field).toHaveClass("text-[#B0B0B0]");
        });
    });

    it("desabilita campos DRE e UE no modo edit", () => {
        render(<TestWrapper mode="edit" />);
        const dreSelect = screen.getByTestId("select-dre");
        const ueSelect = screen.getByTestId("select-ue");
        expect(dreSelect).toBeDisabled();
        expect(ueSelect).toBeDisabled();
    });
});
