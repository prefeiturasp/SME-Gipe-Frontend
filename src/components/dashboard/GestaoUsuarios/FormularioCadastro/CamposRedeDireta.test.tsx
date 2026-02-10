import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { CamposRedeDireta } from "./CamposRedeDireta";
import type { FormDataCadastroUsuario } from "./schema";

const TestWrapper = ({
    showDRE = true,
    showUE = true,
    mode = "create",
    isFormDisabled = false,
    cargo = "",
}: {
    showDRE?: boolean;
    showUE?: boolean;
    mode?: "create" | "edit";
    isFormDisabled?: boolean;
    cargo?: string;
}) => {
    const methods = useForm<FormDataCadastroUsuario>({
        defaultValues: {
            fullName: "",
            rf: "",
            cpf: "",
            cargo: cargo,
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
        { value: "ponto_focal", label: "Ponto focal" },
        { value: "gipe", label: "GIPE" },
    ];

    return (
        <FormProvider {...methods}>
            <CamposRedeDireta
                form={methods}
                dreOptions={dreOptions}
                ueOptions={ueOptions}
                showDRE={showDRE}
                showUE={showUE}
                mode={mode}
                isFormDisabled={isFormDisabled}
                cargo={cargo}
                cargoOptions={cargoOptions}
            />
        </FormProvider>
    );
};

describe("CamposRedeDireta", () => {
    it("renderiza campos padrão quando nenhum cargo está selecionado", () => {
        render(<TestWrapper />);
        expect(screen.getByTestId("input-fullName")).toBeInTheDocument();
        expect(screen.getByTestId("input-cpf")).toBeInTheDocument();
        expect(screen.getByTestId("select-cargo")).toBeInTheDocument();
        expect(screen.getByTestId("input-email")).toBeInTheDocument();
        expect(screen.getByTestId("select-dre")).toBeInTheDocument();
        expect(screen.getByTestId("select-ue")).toBeInTheDocument();
    });

    it("renderiza layout GIPE quando cargo é gipe", () => {
        render(<TestWrapper cargo="gipe" />);
        expect(screen.getByTestId("select-cargo")).toBeInTheDocument();
        expect(screen.getByTestId("input-fullName")).toBeInTheDocument();
        expect(screen.getByTestId("input-email")).toBeInTheDocument();
        expect(screen.queryByTestId("input-cpf")).not.toBeInTheDocument();
    });

    it("renderiza layout padrão com CPF quando cargo é diretor", () => {
        render(<TestWrapper cargo="diretor" />);
        expect(screen.getByTestId("input-cpf")).toBeInTheDocument();
        expect(screen.getByTestId("select-cargo")).toBeInTheDocument();
        expect(screen.getByTestId("input-fullName")).toBeInTheDocument();
        expect(screen.getByTestId("input-email")).toBeInTheDocument();
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

    it("exibe labels corretos para os campos padrão", () => {
        render(<TestWrapper cargo="diretor" />);
        expect(screen.getByText("Nome completo*")).toBeInTheDocument();
        expect(screen.getAllByText("CPF*")[0]).toBeInTheDocument();
        expect(screen.getByText("Cargo*")).toBeInTheDocument();
        expect(screen.getByText("E-mail*")).toBeInTheDocument();
        expect(screen.getByText("Diretoria Regional*")).toBeInTheDocument();
        expect(screen.getByText("Unidade Educacional*")).toBeInTheDocument();
    });

    it("desabilita campo CPF no modo edit", () => {
        render(<TestWrapper mode="edit" />);
        const cpfInput = screen.getByTestId("input-cpf");
        expect(cpfInput).toBeDisabled();
    });

    it("habilita campo CPF no modo create", () => {
        render(<TestWrapper mode="create" />);
        const cpfInput = screen.getByTestId("input-cpf");
        expect(cpfInput).not.toBeDisabled();
    });

    it("aplica estilos corretos no modo edit para CPF", () => {
        render(<TestWrapper mode="edit" />);
        const cpfInput = screen.getByTestId("input-cpf");
        expect(cpfInput).toHaveClass("text-[#B0B0B0]");
    });

    it("não desabilita campo email no modo edit", () => {
        render(<TestWrapper mode="edit" />);
        const emailInput = screen.getByTestId("input-email");
        expect(emailInput).not.toBeDisabled();
    });

    it("não desabilita campo fullName no modo edit", () => {
        render(<TestWrapper mode="edit" />);
        const fullNameInput = screen.getByTestId("input-fullName");
        expect(fullNameInput).not.toBeDisabled();
    });

    it("desabilita todos os campos quando isFormDisabled é true", () => {
        render(<TestWrapper isFormDisabled={true} />);
        expect(screen.getByTestId("input-fullName")).toBeDisabled();
        expect(screen.getByTestId("input-cpf")).toBeDisabled();
        expect(screen.getByTestId("select-cargo")).toBeDisabled();
        expect(screen.getByTestId("input-email")).toBeDisabled();
        expect(screen.getByTestId("select-dre")).toBeDisabled();
        expect(screen.getByTestId("select-ue")).toBeDisabled();
    });

    it("aplica estilos cinza para todos os campos quando isFormDisabled é true", () => {
        render(<TestWrapper isFormDisabled={true} />);
        const fields = [
            screen.getByTestId("input-fullName"),
            screen.getByTestId("input-cpf"),
            screen.getByTestId("select-cargo"),
            screen.getByTestId("input-email"),
            screen.getByTestId("select-dre"),
            screen.getByTestId("select-ue"),
        ];
        fields.forEach((field) => {
            expect(field).toHaveClass("text-[#B0B0B0]");
        });
    });
});
