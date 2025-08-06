import { useState } from "react";
import { FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Check from "@/assets/icons/Check";
import CloseCheck from "@/assets/icons/CloseCheck";
import OpenEye from "@/assets/icons/OpenEye";
import CloseEye from "@/assets/icons/CloseEye";

interface InputSenhaComValidadorProps {
    readonly password: string;
    readonly confirmPassword: string;
    readonly onPasswordChange: (value: string) => void;
    readonly onConfirmPasswordChange: (value: string) => void;
    readonly criteria: readonly {
        label: string;
        test: (v: string) => boolean;
    }[];
    readonly passwordStatus: readonly boolean[];
    readonly error?: string;
    readonly confirmError?: string;
}

export default function InputSenhaComValidador({
    password,
    confirmPassword,
    onPasswordChange,
    onConfirmPasswordChange,
    criteria,
    passwordStatus,
    confirmError,
}: InputSenhaComValidadorProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="mb-6">
            <FormLabel className="required text-[#42474a] text-[14px] font-[700] mb-2 block">
                Nova senha
            </FormLabel>
            <FormControl>
                <div className="relative mb-2">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        placeholder="Digite sua senha"
                        className="font-normal pr-10"
                    />
                    <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#717FC7]"
                        onClick={() => setShowPassword((v) => !v)}
                    >
                        {showPassword ? <CloseEye /> : <OpenEye />}
                    </button>
                </div>
            </FormControl>
            <div className="mt-4 mb-4 flex flex-col bg-[#F5F5F5] rounded-[4px] p-4 gap-4 ">
                <span className="text-[14px] font-[700] text-[#42474a] leading-[1.2]">
                    Por questões de segurança, a senha deve seguir os seguintes
                    critérios:
                </span>
                <div>
                    {criteria.map((c, idx) => (
                        <div
                            key={c.label}
                            className={`flex items-center text-sm gap-1 mb-1 last:mb-0 ${
                                passwordStatus[idx]
                                    ? "text-[#297805]"
                                    : "text-[#b40c31]"
                            }`}
                        >
                            {passwordStatus[idx] ? <Check /> : <CloseCheck />}{" "}
                            {c.label}
                        </div>
                    ))}
                </div>
            </div>
            <FormLabel className="required text-[#42474a] text-[14px] font-[700] mt-4 mb-2 block">
                Confirmação da nova senha
            </FormLabel>
            <FormControl>
                <div className="relative mb-2">
                    <Input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) =>
                            onConfirmPasswordChange(e.target.value)
                        }
                        placeholder="Confirme sua senha"
                        className="font-normal pr-10"
                    />
                    <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#717FC7]"
                        onClick={() => setShowConfirm((v) => !v)}
                    >
                        {showConfirm ? <CloseEye /> : <OpenEye />}
                    </button>
                </div>
            </FormControl>
            {confirmError && <FormMessage>{confirmError}</FormMessage>}
        </div>
    );
}
