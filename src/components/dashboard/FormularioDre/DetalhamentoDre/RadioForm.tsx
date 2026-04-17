import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control } from "react-hook-form";
import { FormularioDreData } from "./schema";

type StringFieldNames = Exclude<
    {
        [K in keyof FormularioDreData]: FormularioDreData[K] extends
            | string
            | undefined
            ? K
            : never;
    }[keyof FormularioDreData],
    undefined
>;

type RadioFormProps = {
    control: Control<FormularioDreData>;
    name: StringFieldNames;
    label: string;
};

export function RadioForm({ control, name, label }: Readonly<RadioFormProps>) {
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
                                value={(field.value as string) ?? ""}
                                className="flex flex-col space-y-2"
                            >
                                <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                    <RadioGroupItem value="Sim" />
                                    <span className="text-sm text-[#42474a]">
                                        Sim
                                    </span>
                                </label>
                                <label className="flex items-center space-x-2 w-fit cursor-pointer">
                                    <RadioGroupItem value="Não" />
                                    <span className="text-sm text-[#42474a]">
                                        Não
                                    </span>
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
