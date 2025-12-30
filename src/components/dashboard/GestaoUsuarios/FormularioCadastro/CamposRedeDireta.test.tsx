import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useForm, FormProvider } from "react-hook-form";
import { CamposRedeDireta } from "./CamposRedeDireta";
import type { FormDataCadastroUsuario } from "./schema";

const TestWrapper = ({
  showDRE = true,
  showUE = true,
  mode = "create",
  isFormDisabled = false,
}: {
  showDRE?: boolean;
  showUE?: boolean;
  mode?: "create" | "edit";
  isFormDisabled?: boolean;
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
        mode={mode}
        isFormDisabled={isFormDisabled}
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

  it("desabilita campos RF e CPF no modo edit", () => {
    render(<TestWrapper mode="edit" />);
    const rfInput = screen.getByTestId("input-rf");
    const cpfInput = screen.getByTestId("input-cpf");
    expect(rfInput).toBeDisabled();
    expect(cpfInput).toBeDisabled();
  });

  it("habilita campos RF e CPF no modo create", () => {
    render(<TestWrapper mode="create" />);
    const rfInput = screen.getByTestId("input-rf");
    const cpfInput = screen.getByTestId("input-cpf");
    expect(rfInput).not.toBeDisabled();
    expect(cpfInput).not.toBeDisabled();
  });

  it("aplica estilos corretos no modo edit para RF e CPF", () => {
    render(<TestWrapper mode="edit" />);
    const rfInput = screen.getByTestId("input-rf");
    const cpfInput = screen.getByTestId("input-cpf");
    expect(rfInput).toHaveClass("text-[#B0B0B0]");
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

  // Novos testes para isFormDisabled
  it("desabilita todos os campos quando isFormDisabled é true", () => {
    render(<TestWrapper isFormDisabled={true} />);
    expect(screen.getByTestId("input-fullName")).toBeDisabled();
    expect(screen.getByTestId("input-cpf")).toBeDisabled();
    expect(screen.getByTestId("input-rf")).toBeDisabled();
    expect(screen.getByTestId("input-email")).toBeDisabled();
    expect(screen.getByTestId("select-dre")).toBeDisabled();
    expect(screen.getByTestId("select-ue")).toBeDisabled();
  });

  it("aplica estilos cinza para todos os campos quando isFormDisabled é true", () => {
    render(<TestWrapper isFormDisabled={true} />);
    const fields = [
      screen.getByTestId("input-fullName"),
      screen.getByTestId("input-cpf"),
      screen.getByTestId("input-rf"),
      screen.getByTestId("input-email"),
      screen.getByTestId("select-dre"),
      screen.getByTestId("select-ue"),
    ];
    fields.forEach((field) => {
      expect(field).toHaveClass("text-[#B0B0B0]");
    });
  });
});
