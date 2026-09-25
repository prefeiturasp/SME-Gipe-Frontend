import { UseFormReturn } from "react-hook-form";
import {
    CargoField,
    DreField,
    EmailField,
    FullNameField,
    UeField,
} from "./CamposCompartilhados";
import { getEmailDreUeGridCols } from "./formFieldsUtils";
import type { FormDataCadastroUsuario } from "./schema";

type CamposRedeIndiretaProps = {
    form: UseFormReturn<FormDataCadastroUsuario>;
    dreOptions: Array<{ uuid: string; codigo_eol: string; nome: string }>;
    ueOptions: Array<{ uuid: string; codigo_eol: string; nome: string }>;
    showDRE: boolean;
    showUE: boolean;
    isDreDisabled?: boolean;
    onDreChange?: (val: string) => void;
    isFormDisabled?: boolean;
    cargoOptions: Array<{ value: string; label: string }>;
    mode?: "create" | "edit";
};

export function CamposRedeIndireta({
    form,
    dreOptions,
    ueOptions,
    showDRE,
    showUE,
    isDreDisabled = false,
    onDreChange,
    isFormDisabled = false,
    cargoOptions,
    mode = "create",
}: Readonly<CamposRedeIndiretaProps>) {
    const dreDisabled = isFormDisabled || isDreDisabled || mode === "edit";
    const ueDisabled = isFormDisabled || mode === "edit";

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

            <div
                className={`grid grid-cols-1 gap-6 mb-6 ${getEmailDreUeGridCols(showDRE, showUE)}`}
            >
                <EmailField control={form.control} disabled={isFormDisabled} />
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
        </>
    );
}
