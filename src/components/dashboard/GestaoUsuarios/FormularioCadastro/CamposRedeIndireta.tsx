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

type CamposRedeIndiretaProps = {
    form: UseFormReturn<FormDataCadastroUsuario>;
    dreOptions: Array<{ uuid: string; codigo_eol: string; nome: string }>;
    ueOptions: Array<{ uuid: string; codigo_eol: string; nome: string }>;
    showDRE: boolean;
    showUE: boolean;
    isDreDisabled?: boolean;
    onDreChange?: (val: string) => void;
};

export function CamposRedeIndireta({
    form,
    dreOptions,
    ueOptions,
    showDRE,
    showUE,
    isDreDisabled = false,
    onDreChange,
}: Readonly<CamposRedeIndiretaProps>) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                Nome completo*
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Exemplo: Maria Clara Medeiros"
                                    className="font-normal border-[#DADADA]"
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
                            <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                CPF*
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    inputMode="numeric"
                                    placeholder="123.456.789-10"
                                    className="font-normal border-[#DADADA]"
                                    data-testid="input-cpf"
                                    maxLength={14}
                                    onChange={(e) => {
                                        const masked = maskCPF(e.target.value);
                                        field.onChange(masked);
                                    }}
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
                            <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                E-mail*
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="Digite o e-mail corporativo"
                                    className="font-normal border-[#DADADA]"
                                    data-testid="input-email"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {showDRE && (
                    <FormField
                        control={form.control}
                        name="dre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
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
                                        className="border-[#DADADA]"
                                        disabled={isDreDisabled}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {showUE && (
                    <FormField
                        control={form.control}
                        name="ue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
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
                                        className="border-[#DADADA]"
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
