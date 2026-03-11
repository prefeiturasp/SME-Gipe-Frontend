import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MultiSelectWithOther, type MultiSelectOption } from "./index";

vi.mock("@/components/ui/multi-select", () => ({
    MultiSelect: ({
        options,
        value,
        onChange,
        placeholder,
        disabled,
    }: {
        options: MultiSelectOption[];
        value: string[];
        onChange: (value: string[]) => void;
        placeholder?: string;
        disabled?: boolean;
    }) => (
        <div data-testid="multi-select">
            <span data-testid="multi-select-placeholder">{placeholder}</span>
            <span data-testid="multi-select-disabled">{String(disabled)}</span>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    data-testid={`option-${opt.value}`}
                    onClick={() =>
                        onChange(
                            value.includes(opt.value)
                                ? value.filter((v) => v !== opt.value)
                                : [...value, opt.value],
                        )
                    }
                >
                    {opt.label}
                </button>
            ))}
        </div>
    ),
}));

const mockOptions: MultiSelectOption[] = [
    { label: "Furto", value: "uuid-furto" },
    { label: "Roubo", value: "uuid-roubo" },
    { label: "Outra", value: "uuid-outra" },
];

const alwaysShowTextField = () => true;
const neverShowTextField = () => false;
const showWhenOtherSelected = (
    selectedValues: string[],
    options: MultiSelectOption[],
) =>
    options.some(
        (opt) =>
            selectedValues.includes(opt.value) &&
            ["outra", "outros"].includes(opt.label.toLowerCase()),
    );

describe("MultiSelectWithOther", () => {
    it("deve renderizar o MultiSelect com as opções fornecidas", () => {
        render(
            <MultiSelectWithOther
                options={mockOptions}
                value={[]}
                onChange={vi.fn()}
                shouldShowTextField={neverShowTextField}
            />,
        );

        expect(screen.getByTestId("multi-select")).toBeInTheDocument();
        expect(screen.getByText("Furto")).toBeInTheDocument();
        expect(screen.getByText("Roubo")).toBeInTheDocument();
        expect(screen.getByText("Outra")).toBeInTheDocument();
    });

    it("não deve exibir o campo de texto quando shouldShowTextField retorna false", () => {
        render(
            <MultiSelectWithOther
                options={mockOptions}
                value={["uuid-furto"]}
                onChange={vi.fn()}
                shouldShowTextField={neverShowTextField}
                textFieldLabel="Descreva qual o tipo de ocorrência*"
            />,
        );

        expect(
            screen.queryByText("Descreva qual o tipo de ocorrência*"),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByPlaceholderText("Descreva aqui..."),
        ).not.toBeInTheDocument();
    });

    it("deve exibir o campo de texto quando shouldShowTextField retorna true", () => {
        render(
            <MultiSelectWithOther
                options={mockOptions}
                value={["uuid-outra"]}
                onChange={vi.fn()}
                shouldShowTextField={alwaysShowTextField}
                textFieldLabel="Descreva qual o tipo de ocorrência*"
            />,
        );

        expect(
            screen.getByText("Descreva qual o tipo de ocorrência*"),
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Descreva aqui..."),
        ).toBeInTheDocument();
    });

    it("deve exibir o campo de texto ao selecionar 'Outra' via callback customizado", () => {
        const { rerender } = render(
            <MultiSelectWithOther
                options={mockOptions}
                value={[]}
                onChange={vi.fn()}
                shouldShowTextField={showWhenOtherSelected}
                textFieldLabel="Descreva*"
            />,
        );

        expect(screen.queryByText("Descreva*")).not.toBeInTheDocument();

        rerender(
            <MultiSelectWithOther
                options={mockOptions}
                value={["uuid-outra"]}
                onChange={vi.fn()}
                shouldShowTextField={showWhenOtherSelected}
                textFieldLabel="Descreva*"
            />,
        );

        expect(screen.getByText("Descreva*")).toBeInTheDocument();
    });

    it("deve exibir o hint quando fornecido", () => {
        render(
            <MultiSelectWithOther
                options={mockOptions}
                value={[]}
                onChange={vi.fn()}
                shouldShowTextField={neverShowTextField}
                hint="Se necessário, selecione mais de uma opção."
            />,
        );

        expect(
            screen.getByText("Se necessário, selecione mais de uma opção."),
        ).toBeInTheDocument();
    });

    it("deve repassar disabled para o MultiSelect e Textarea", () => {
        render(
            <MultiSelectWithOther
                options={mockOptions}
                value={["uuid-outra"]}
                onChange={vi.fn()}
                shouldShowTextField={alwaysShowTextField}
                textFieldLabel="Descreva*"
                disabled
            />,
        );

        expect(screen.getByTestId("multi-select-disabled")).toHaveTextContent(
            "true",
        );
        expect(screen.getByPlaceholderText("Descreva aqui...")).toBeDisabled();
    });

    it("deve chamar onTextFieldChange ao digitar no textarea", () => {
        const mockOnChange = vi.fn();

        render(
            <MultiSelectWithOther
                options={mockOptions}
                value={["uuid-outra"]}
                onChange={vi.fn()}
                shouldShowTextField={alwaysShowTextField}
                textFieldLabel="Descreva*"
                textFieldValue=""
                onTextFieldChange={mockOnChange}
            />,
        );

        const textarea = screen.getByPlaceholderText("Descreva aqui...");
        fireEvent.change(textarea, { target: { value: "Descrição teste" } });

        expect(mockOnChange).toHaveBeenCalledWith("Descrição teste");
    });

    it("deve exibir mensagem de erro quando textFieldError é fornecido", () => {
        render(
            <MultiSelectWithOther
                options={mockOptions}
                value={["uuid-outra"]}
                onChange={vi.fn()}
                shouldShowTextField={alwaysShowTextField}
                textFieldError="Campo obrigatório"
            />,
        );

        expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
    });

    it("deve usar placeholder customizado no textarea", () => {
        render(
            <MultiSelectWithOther
                options={mockOptions}
                value={["uuid-outra"]}
                onChange={vi.fn()}
                shouldShowTextField={alwaysShowTextField}
                textFieldPlaceholder="Escreva a descrição..."
            />,
        );

        expect(
            screen.getByPlaceholderText("Escreva a descrição..."),
        ).toBeInTheDocument();
    });

    it("deve permitir desabilitar apenas o textarea via textFieldDisabled", () => {
        render(
            <MultiSelectWithOther
                options={mockOptions}
                value={["uuid-outra"]}
                onChange={vi.fn()}
                shouldShowTextField={alwaysShowTextField}
                disabled={false}
                textFieldDisabled={true}
            />,
        );

        expect(screen.getByTestId("multi-select-disabled")).toHaveTextContent(
            "false",
        );
        expect(screen.getByPlaceholderText("Descreva aqui...")).toBeDisabled();
    });

    it("deve repassar o placeholder ao MultiSelect", () => {
        render(
            <MultiSelectWithOther
                options={mockOptions}
                value={[]}
                onChange={vi.fn()}
                shouldShowTextField={neverShowTextField}
                placeholder="Selecione os tipos"
            />,
        );

        expect(
            screen.getByTestId("multi-select-placeholder"),
        ).toHaveTextContent("Selecione os tipos");
    });

    it("deve aplicar estilo de hint desabilitado quando disabled", () => {
        render(
            <MultiSelectWithOther
                options={mockOptions}
                value={[]}
                onChange={vi.fn()}
                shouldShowTextField={neverShowTextField}
                hint="Texto auxiliar"
                disabled
            />,
        );

        const hint = screen.getByText("Texto auxiliar");
        expect(hint).toHaveClass("text-[#B0B0B0]");
    });

    it("deve renderizar a label quando fornecida", () => {
        render(
            <MultiSelectWithOther
                options={mockOptions}
                value={[]}
                onChange={vi.fn()}
                shouldShowTextField={neverShowTextField}
                label="Qual o tipo de ocorrência?*"
            />,
        );

        expect(
            screen.getByText("Qual o tipo de ocorrência?*"),
        ).toBeInTheDocument();
    });

    it("deve aplicar fundo #F5F6F8 quando shouldShowTextField retorna true", () => {
        const { container } = render(
            <MultiSelectWithOther
                options={mockOptions}
                value={["uuid-outra"]}
                onChange={vi.fn()}
                shouldShowTextField={alwaysShowTextField}
                label="Tipo*"
            />,
        );

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).toHaveClass("bg-[#F5F6F8]");
        expect(wrapper).toHaveClass("p-4");
        expect(wrapper).toHaveClass("rounded-md");
    });

    it("não deve aplicar fundo quando shouldShowTextField retorna false", () => {
        const { container } = render(
            <MultiSelectWithOther
                options={mockOptions}
                value={[]}
                onChange={vi.fn()}
                shouldShowTextField={neverShowTextField}
                label="Tipo*"
            />,
        );

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper).not.toHaveClass("bg-[#F5F6F8]");
    });

    it("deve aplicar estilo de label desabilitada quando disabled", () => {
        render(
            <MultiSelectWithOther
                options={mockOptions}
                value={[]}
                onChange={vi.fn()}
                shouldShowTextField={neverShowTextField}
                label="Tipo*"
                disabled
            />,
        );

        const label = screen.getByText("Tipo*");
        expect(label).toHaveClass("text-[#B0B0B0]");
    });
});
