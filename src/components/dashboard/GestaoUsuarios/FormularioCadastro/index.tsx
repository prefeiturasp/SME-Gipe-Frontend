"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import ModalConfirmacao from "./ModalConfirmacao";
import { useCadastroUsuarioForm } from "./useCadastroUsuarioForm";
import { CamposRedeIndireta } from "./CamposRedeIndireta";
import { CamposRedeDireta } from "./CamposRedeDireta";

export default function FormularioCadastroPessoaUsuaria() {
    const {
        form,
        isValid,
        isPending,
        modalOpen,
        setModalOpen,
        dreOptions,
        ueOptions,
        redeOptions,
        cargoOptions,
        isRedeSelected,
        shouldShowExtraFields,
        showFields,
        isRedeIndireta,
        isRedeDireta,
        handleSubmitClick,
        handleConfirmCadastro,
        router,
    } = useCadastroUsuarioForm();

    return (
        <Form {...form}>
            <form>
                <h2 className="text-[14px] text-[#42474a] mb-6">
                    Cadastre as informações da pessoa usuária.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormField
                        control={form.control}
                        name="rede"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                    Rede*
                                </FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className="w-full border-[#DADADA]"
                                            data-testid="select-rede"
                                        >
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {redeOptions.map((rede) => (
                                            <SelectItem
                                                key={rede.value}
                                                value={rede.value}
                                            >
                                                {rede.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cargo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                                    Cargo*
                                </FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={!isRedeSelected}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className="w-full disabled:bg-[#F5F5F5] border-[#DADADA] disabled:opacity-100"
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
                </div>

                {shouldShowExtraFields && (
                    <>
                        {isRedeIndireta && (
                            <CamposRedeIndireta
                                form={form}
                                dreOptions={dreOptions}
                                ueOptions={ueOptions}
                                showDRE={showFields.dre}
                                showUE={showFields.ue}
                            />
                        )}

                        {isRedeDireta && (
                            <CamposRedeDireta
                                form={form}
                                dreOptions={dreOptions}
                                ueOptions={ueOptions}
                                showDRE={showFields.dre}
                                showUE={showFields.ue}
                            />
                        )}
                    </>
                )}

                {showFields.adminCheckbox && (
                    <div className="mt-6">
                        <FormField
                            control={form.control}
                            name="isAdmin"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            data-testid="checkbox-isAdmin"
                                            className="h-[18px] w-[18px] border-2 border-[#B0B0B0]"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="text-[14px] font-[700] text-[#42474a]">
                                            Atribuir perfil administrador
                                        </FormLabel>
                                        <p className="text-[12px] font-normal text-[#42474a]">
                                            Opção disponível para usuários que
                                            possuem cargo de Ponto Focal ou
                                            GIPE.
                                        </p>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <div className="flex gap-4 mt-8 justify-end">
                    <Button
                        type="button"
                        variant="customOutline"
                        onClick={() =>
                            router.push("/dashboard/gestao/pessoa-usuaria")
                        }
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="submit"
                        disabled={!isValid}
                        data-testid="button-cadastrar"
                        onClick={handleSubmitClick}
                    >
                        Cadastrar pessoa usuária
                    </Button>
                </div>
            </form>

            <ModalConfirmacao
                open={modalOpen}
                onOpenChange={setModalOpen}
                onConfirm={handleConfirmCadastro}
                isLoading={isPending}
            />
        </Form>
    );
}
