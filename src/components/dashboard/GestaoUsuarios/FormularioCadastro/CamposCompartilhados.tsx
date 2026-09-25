import { Combobox } from "@/components/ui/Combobox";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";
import { comboboxClass, inputClass, labelClass } from "./formFieldsUtils";
import type { FormDataCadastroUsuario } from "./schema";

type DreOption = { uuid: string; codigo_eol: string; nome: string };
type UeOption = { uuid: string; codigo_eol: string; nome: string };
type CargoOption = { value: string; label: string };

type CargoFieldProps = {
    control: Control<FormDataCadastroUsuario>;
    disabled: boolean;
    cargoOptions: CargoOption[];
};

export function CargoField({
    control,
    disabled,
    cargoOptions,
}: Readonly<CargoFieldProps>) {
    return (
        <FormField
            control={control}
            name="cargo"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={labelClass(disabled)}>
                        Cargo*
                    </FormLabel>
                    <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={disabled}
                    >
                        <FormControl>
                            <SelectTrigger
                                className={`${inputClass(disabled)} w-full`}
                                data-testid="select-cargo"
                            >
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {cargoOptions.map((cargo) => (
                                <SelectItem
                                    key={cargo.value}
                                    value={cargo.value}
                                >
                                    {cargo.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

type FullNameFieldProps = {
    control: Control<FormDataCadastroUsuario>;
    disabled: boolean;
};

export function FullNameField({
    control,
    disabled,
}: Readonly<FullNameFieldProps>) {
    return (
        <FormField
            control={control}
            name="fullName"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={labelClass(disabled)}>
                        Nome completo*
                    </FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            placeholder="Exemplo: Maria Clara Medeiros"
                            className={inputClass(disabled)}
                            disabled={disabled}
                            data-testid="input-fullName"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

type EmailFieldProps = {
    control: Control<FormDataCadastroUsuario>;
    disabled: boolean;
};

export function EmailField({ control, disabled }: Readonly<EmailFieldProps>) {
    return (
        <FormField
            control={control}
            name="email"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={labelClass(disabled)}>
                        E-mail*
                    </FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            type="email"
                            placeholder="Digite o e-mail corporativo"
                            className={inputClass(disabled)}
                            disabled={disabled}
                            data-testid="input-email"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

type DreFieldProps = {
    control: Control<FormDataCadastroUsuario>;
    disabled: boolean;
    dreOptions: DreOption[];
    onDreChange?: (val: string) => void;
};

export function DreField({
    control,
    disabled,
    dreOptions,
    onDreChange,
}: Readonly<DreFieldProps>) {
    return (
        <FormField
            control={control}
            name="dre"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={labelClass(disabled)}>
                        Diretoria Regional*
                    </FormLabel>
                    <FormControl>
                        <Combobox
                            data-testid="select-dre"
                            options={dreOptions.map((dre) => ({
                                label: dre.nome,
                                value: dre.uuid,
                            }))}
                            value={field.value}
                            onChange={onDreChange ?? field.onChange}
                            placeholder="Digite ou selecione"
                            className={comboboxClass(disabled)}
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

type UeFieldProps = {
    control: Control<FormDataCadastroUsuario>;
    disabled: boolean;
    ueOptions: UeOption[];
};

export function UeField({
    control,
    disabled,
    ueOptions,
}: Readonly<UeFieldProps>) {
    return (
        <FormField
            control={control}
            name="ue"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={labelClass(disabled)}>
                        Unidade Educacional*
                    </FormLabel>
                    <FormControl>
                        <Combobox
                            data-testid="select-ue"
                            options={ueOptions.map((ue) => ({
                                label: ue.nome,
                                value: ue.uuid,
                            }))}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Digite ou selecione"
                            className={comboboxClass(disabled)}
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
