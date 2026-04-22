import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control, FieldPath, FieldValues } from "react-hook-form";

type RadioSimNaoProps<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    disabled?: boolean;
};

export function RadioSimNao<T extends FieldValues>({
    control,
    name,
    label,
    disabled = false,
}: Readonly<RadioSimNaoProps<T>>) {
    const textClass = disabled
        ? "text-sm text-[#B0B0B0]"
        : "text-sm text-[#42474a]";
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel disabled={disabled}>{label}</FormLabel>
                    <FormControl>
                        <div className="pt-2">
                            <RadioGroup
                                onValueChange={field.onChange}
                                value={(field.value as string) ?? ""}
                                disabled={disabled}
                                className="flex flex-col space-y-2"
                            >
                                <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                    <RadioGroupItem value="Sim" />
                                    <span className={textClass}>Sim</span>
                                </label>
                                <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                    <RadioGroupItem value="Não" />
                                    <span className={textClass}>Não</span>
                                </label>
                            </RadioGroup>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
