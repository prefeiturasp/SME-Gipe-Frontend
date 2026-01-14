"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CamposRedeDireta } from "./CamposRedeDireta";
import { CamposRedeIndireta } from "./CamposRedeIndireta";
import ModalConfirmacao from "./ModalConfirmacao";
import { useCadastroUsuarioForm } from "./useCadastroUsuarioForm";
import MensagemInativacao from "./MensagemInativacao";

type FormularioCadastroPessoaUsuariaProps = {
    mode?: "create" | "edit";
    usuarioUuid?: string;
};

export default function FormularioCadastroPessoaUsuaria({
    mode = "create",
    usuarioUuid,
}: Readonly<FormularioCadastroPessoaUsuariaProps>) {
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
        handleRedeChange,
        handleCargoChange,
        handleDreChange,
        router,
        isDreDisabled,
        mode: currentMode,
        hasChanges,
        isFormDisabled,
        isActive,
        dataInativacaoFormatada,
        responsavelInativacaoNome,
        motivoInativacao,
        inativadoViaUnidade,
    } = useCadastroUsuarioForm({ mode, usuarioUuid });

    const labelClass = (disabled: boolean, extra?: string) =>
        `required text-[14px] font-[700] ${
            disabled ? "text-[#B0B0B0]" : "text-[#42474a]"
        } ${extra ?? ""}`;
    const selectClass = (disabled: boolean) =>
        `w-full border-[#DADADA] bg-white ${disabled ? "text-[#B0B0B0]" : ""}`;
    const buttonDisabled = isFormDisabled;

    return (
        <Form {...form}>
            <form>
                <h2 className="text-[14px] text-[#42474a] mb-6">
                    Cadastre as informações do perfil.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormField
                        control={form.control}
                        name="rede"
                        render={({ field }) => {
                            const disabled = isFormDisabled;
                            return (
                                <FormItem>
                                    <FormLabel className={labelClass(disabled)}>
                                        Tipo*
                                    </FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={handleRedeChange}
                                        disabled={
                                            disabled || currentMode === "edit"
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className={selectClass(
                                                    disabled
                                                )}
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
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="cargo"
                        render={({ field }) => {
                            const disabled = !isRedeSelected || isFormDisabled;
                            return (
                                <FormItem>
                                    <FormLabel className={labelClass(disabled)}>
                                        Cargo*
                                    </FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={handleCargoChange}
                                        disabled={disabled}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className={selectClass(
                                                    disabled
                                                )}
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
                            );
                        }}
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
                                isDreDisabled={isDreDisabled}
                                mode={currentMode}
                                onDreChange={handleDreChange}
                                isFormDisabled={isFormDisabled}
                            />
                        )}

                        {isRedeDireta && (
                            <CamposRedeDireta
                                form={form}
                                dreOptions={dreOptions}
                                ueOptions={ueOptions}
                                showDRE={showFields.dre}
                                showUE={showFields.ue}
                                isDreDisabled={isDreDisabled}
                                mode={currentMode}
                                onDreChange={handleDreChange}
                                isFormDisabled={isFormDisabled}
                            />
                        )}
                    </>
                )}

                {showFields.adminCheckbox && (
                    <div>
                        <FormField
                            control={form.control}
                            name="isAdmin"
                            render={({ field }) => {
                                const disabled = isFormDisabled;
                                return (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={disabled}
                                                className={`h-[18px] w-[18px] border-2 border-[#B0B0B0] ${
                                                    disabled
                                                        ? "bg-white text-[#B0B0B0]"
                                                        : ""
                                                }`}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel
                                                className={labelClass(disabled)}
                                            >
                                                Atribuir perfil administrador
                                            </FormLabel>
                                            <p
                                                className={`text-[12px] font-normal ${
                                                    disabled
                                                        ? "text-[#B0B0B0]"
                                                        : "text-[#42474a]"
                                                }`}
                                            >
                                                Opção disponível para usuários
                                                que possuem cargo de Ponto Focal
                                                ou GIPE.
                                            </p>
                                        </div>
                                    </FormItem>
                                );
                            }}
                        />
                    </div>
                )}

                <div className="mt-4">
                    {!isActive && motivoInativacao && (
                        <MensagemInativacao
                            dataInativacaoFormatada={dataInativacaoFormatada ?? ""}
                            responsavelInativacaoNome={responsavelInativacaoNome ?? ""}
                            motivoInativacao={motivoInativacao}
                            inativadoViaUnidade={inativadoViaUnidade ?? false}
                        />
                    )}
                </div>

                <div className="flex gap-4 mt-8 justify-end">
                    <Button
                        type="button"
                        variant="customOutline"
                        onClick={() =>
                            router.push("/dashboard/gestao-usuarios")
                        }
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="submit"
                        disabled={
                            buttonDisabled ||
                            !isValid ||
                            (currentMode === "edit" && !hasChanges)
                        }
                        data-testid="button-cadastrar"
                        onClick={handleSubmitClick}
                    >
                        {currentMode === "edit"
                            ? "Salvar alterações"
                            : "Cadastrar perfil"}
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
