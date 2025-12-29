import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/Combobox";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
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
}: Readonly<CamposRedeDiretaProps>) {
    const fullNameDisabled = isFormDisabled;
    const cpfDisabled = isFormDisabled || mode === "edit";
    const rfDisabled = isFormDisabled || mode === "edit";
    const emailDisabled = isFormDisabled;
    const dreDisabled = isFormDisabled || isDreDisabled;
    const ueDisabled = isFormDisabled;

    const labelClass = (disabled: boolean) => `required text-[14px] font-[700] ${disabled ? "text-[#B0B0B0]" : "text-[#42474a]"}`;
    const inputClass = (disabled: boolean) => `font-normal border-[#DADADA] bg-white ${disabled ? "text-[#B0B0B0]" : ""}`;
    const comboboxClass = (disabled: boolean) => `border-[#DADADA] bg-white ${disabled ? "text-[#B0B0B0]" : ""}`;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass(fullNameDisabled)}>Nome completo*</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Exemplo: Maria Clara Medeiros"
                                    className={inputClass(fullNameDisabled)}
                                    disabled={fullNameDisabled}
                                    data-testid="input-fullName"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass(cpfDisabled)}>CPF*</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    inputMode="numeric"
                                    placeholder="123.456.789-10"
                                    className={inputClass(cpfDisabled)}
                                    disabled={cpfDisabled}
                                    maxLength={14}
                                    onChange={(e) => field.onChange(maskCPF(e.target.value))}
                                    data-testid="input-cpf"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                    control={form.control}
                    name="rf"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass(rfDisabled)}>RF*</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    inputMode="numeric"
                                    placeholder="Digite o RF"
                                    className={inputClass(rfDisabled)}
                                    disabled={rfDisabled}
                                    data-testid="input-rf"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={labelClass(emailDisabled)}>E-mail*</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="Digite o e-mail corporativo"
                                    className={inputClass(emailDisabled)}
                                    disabled={emailDisabled}
                                    data-testid="input-email"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
                {showDRE && (
                    <FormField
                        control={form.control}
                        name="dre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={labelClass(dreDisabled)}>Diretoria Regional*</FormLabel>
                                <FormControl>
                                    <Combobox
                                        data-testid="select-dre"
                                        options={dreOptions.map((dre) => ({ label: dre.nome, value: dre.uuid }))}
                                        value={field.value}
                                        onChange={onDreChange ?? field.onChange}
                                        placeholder="Digite ou selecione"
                                        className={comboboxClass(dreDisabled)}
                                        disabled={dreDisabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {showUE && (
                    <FormField
                        control={form.control}
                        name="ue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={labelClass(ueDisabled)}>Unidade Educacional*</FormLabel>
                                <FormControl>
                                    <Combobox
                                        data-testid="select-ue"
                                        options={ueOptions.map((ue) => ({ label: ue.nome, value: ue.uuid }))}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Digite ou selecione"
                                        className={comboboxClass(ueDisabled)}
                                        disabled={ueDisabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </div>
        </>
    );
}
