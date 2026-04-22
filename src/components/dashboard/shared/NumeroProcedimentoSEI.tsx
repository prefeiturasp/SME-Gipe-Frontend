import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { InputMask } from "@/components/ui/input";
import { Control, FieldPath, FieldValues } from "react-hook-form";

type NumeroProcedimentoSEIProps<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    disabled?: boolean;
};

export function NumeroProcedimentoSEI<T extends FieldValues>({
    control,
    name,
    disabled = false,
}: Readonly<NumeroProcedimentoSEIProps<T>>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel disabled={disabled}>
                        Número do processo SEI*
                    </FormLabel>
                    <FormControl>
                        <InputMask
                            maskProps={{
                                mask: "9999.9999/9999999-9",
                            }}
                            placeholder="Exemplo: 1234.5678/9012345-6"
                            disabled={disabled}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
