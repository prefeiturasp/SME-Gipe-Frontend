import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useForm, FormProvider } from "react-hook-form";
import { CamposRedeDireta } from "./CamposRedeDireta";
import type { FormDataCadastroUsuario } from "./schema";

const TestWrapper = ({
    showDRE = true,
    showUE = true,
}: {
    showDRE?: boolean;
    showUE?: boolean;
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

    return (
        <FormProvider {...methods}>
            <CamposRedeDireta
                form={methods}
                dreOptions={dreOptions}
                ueOptions={ueOptions}
                showDRE={showDRE}
                showUE={showUE}
            />
        </FormProvider>
    );
};

describe("CamposRedeDireta", () => {
    it("renderiza todos os campos corretamente", () => {
        render(<TestWrapper />);

        expect(screen.getByTestId("input-fullName")).toBeInTheDocument();
        expect(screen.getByTestId("input-cpf")).toBeInTheDocument();
        expect(screen.getByTestId("input-rf")).toBeInTheDocument();
        expect(screen.getByTestId("input-email")).toBeInTheDocument();
        expect(screen.getByTestId("select-dre")).toBeInTheDocument();
        expect(screen.getByTestId("select-ue")).toBeInTheDocument();
    });

    it("aplica máscara de CPF ao digitar", () => {
        render(<TestWrapper />);

        const cpfInput = screen.getByTestId("input-cpf");
        fireEvent.change(cpfInput, { target: { value: "12345678910" } });

        expect(cpfInput).toHaveValue("123.456.789-10");
    });

    it("limita CPF a 14 caracteres (com máscara)", () => {
        render(<TestWrapper />);

        const cpfInput = screen.getByTestId("input-cpf");
        expect(cpfInput).toHaveAttribute("maxLength", "14");
    });

    it("não exibe campo DRE quando showDRE é false", () => {
        render(<TestWrapper showDRE={false} />);

        expect(screen.queryByTestId("select-dre")).not.toBeInTheDocument();
    });

    it("não exibe campo UE quando showUE é false", () => {
        render(<TestWrapper showUE={false} />);

        expect(screen.queryByTestId("select-ue")).not.toBeInTheDocument();
    });

    it("exibe labels corretos para os campos", () => {
        render(<TestWrapper />);

        expect(screen.getByText("Nome completo*")).toBeInTheDocument();
        expect(screen.getAllByText("CPF*")[0]).toBeInTheDocument();
        expect(screen.getByText("RF*")).toBeInTheDocument();
        expect(screen.getByText("E-mail*")).toBeInTheDocument();
        expect(screen.getByText("Diretoria Regional*")).toBeInTheDocument();
        expect(screen.getByText("Unidade Educacional*")).toBeInTheDocument();
    });

    it("organiza campos em grids responsivos", () => {
        const { container } = render(<TestWrapper />);

        const grids = container.querySelectorAll(".grid");
        expect(grids.length).toBeGreaterThan(0);
    });
});
