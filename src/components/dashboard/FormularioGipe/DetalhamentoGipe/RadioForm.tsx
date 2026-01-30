import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control, FieldPath } from "react-hook-form";
import { FormularioGipeData } from "./schema";

type RadioFormProps = {
    control: Control<FormularioGipeData>;
    name: Extract<
        FieldPath<FormularioGipeData>,
        "envolveArmaOuAtaque" | "ameacaRealizada"
    >;
    label: string;
    options?: Array<{ value: string; label: string }>;
};

export function RadioForm({
    control,
    name,
    label,
    options = [
        { value: "Sim", label: "Sim" },
        { value: "Não", label: "Não" },
    ],
}: Readonly<RadioFormProps>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="pt-2">
                            <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value ?? ""}
                                className="flex flex-col space-y-2"
                            >
                                {options.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center space-x-2 w-fit cursor-pointer"
                                    >
                                        <RadioGroupItem value={option.value} />
                                        <span className="text-sm text-[#42474a]">
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </RadioGroup>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
