import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import {
    CargoField,
    DreField,
    EmailField,
    FullNameField,
    UeField,
} from "./CamposCompartilhados";
import {
    getEmailDreUeGridCols,
    inputClass,
    labelClass,
} from "./formFieldsUtils";
import type { FormDataCadastroUsuario } from "./schema";
import { maskCPF } from "./utils";

type CamposRedeDiretaProps = {
    form: UseFormReturn<FormDataCadastroUsuario>;
    dreOptions: Array<{ uuid: string; codigo_eol: string; nome: string }>;
    ueOptions: Array<{ uuid: string; codigo_eol: string; nome: string }>;
    showDRE: boolean;
    showUE: boolean;
    isDreDisabled?: boolean;
    onDreChange?: (val: string) => void;
    mode?: "create" | "edit";
    isFormDisabled?: boolean;
    cargo?: string;
    cargoOptions: Array<{ value: string; label: string }>;
};

export function CamposRedeDireta({
    form,
    dreOptions,
    ueOptions,
    showDRE,
    showUE,
    isDreDisabled = false,
    onDreChange,
    mode = "create",
    isFormDisabled = false,
    cargo = "",
    cargoOptions,
}: Readonly<CamposRedeDiretaProps>) {
    const cpfDisabled = isFormDisabled || mode === "edit";
    const dreDisabled = isFormDisabled || isDreDisabled || mode === "edit";
    const ueDisabled = isFormDisabled || mode === "edit";

    const isGipe = cargo === "gipe";
    const isPontoFocalOrDiretorOrAssistente = [
        "ponto_focal",
        "diretor",
        "assistente",
    ].includes(cargo);
    const hasCargoSelected = !!cargo;

    return (
        <>
            {isGipe && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <CargoField
                        control={form.control}
                        disabled={isFormDisabled}
                        cargoOptions={cargoOptions}
                    />
                    <FullNameField
                        control={form.control}
                        disabled={isFormDisabled}
                    />
                    <EmailField
                        control={form.control}
                        disabled={isFormDisabled}
                    />
                </div>
            )}

            {(isPontoFocalOrDiretorOrAssistente || !hasCargoSelected) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={labelClass(cpfDisabled)}>
                                    CPF*
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        inputMode="numeric"
                                        placeholder="123.456.789-10"
                                        className={inputClass(cpfDisabled)}
                                        disabled={cpfDisabled}
                                        maxLength={14}
                                        onChange={(e) =>
                                            field.onChange(
                                                maskCPF(e.target.value),
                                            )
                                        }
                                        data-testid="input-cpf"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <CargoField
                        control={form.control}
                        disabled={isFormDisabled}
                        cargoOptions={cargoOptions}
                    />
                    <FullNameField
                        control={form.control}
                        disabled={isFormDisabled}
                    />
                </div>
            )}

            {(isPontoFocalOrDiretorOrAssistente || !hasCargoSelected) && (
                <div
                    className={`grid grid-cols-1 gap-6 mb-6 ${getEmailDreUeGridCols(showDRE, showUE)}`}
                >
                    <EmailField
                        control={form.control}
                        disabled={isFormDisabled}
                    />
                    {showDRE && (
                        <DreField
                            control={form.control}
                            disabled={dreDisabled}
                            dreOptions={dreOptions}
                            onDreChange={onDreChange}
                        />
                    )}
                    {showUE && (
                        <UeField
                            control={form.control}
                            disabled={ueDisabled}
                            ueOptions={ueOptions}
                        />
                    )}
                </div>
            )}
        </>
    );
}
