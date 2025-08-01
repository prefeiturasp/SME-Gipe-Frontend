import { useState } from "react";
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
    error,
    confirmError,
}: InputSenhaComValidadorProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <FormItem className="mb-6">
            <FormLabel className="required text-[#42474a] text-[14px] font-[700]">
                Crie uma senha
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
            <div className="mt-2 mb-2">
                {criteria.map((c, idx) => (
                    <div
                        key={c.label}
                        className={`flex items-center text-[13px] gap-2 ${
                            passwordStatus[idx]
                                ? "text-green-600"
                                : "text-gray-400"
                        }`}
                    >
                        {passwordStatus[idx] ? "✔️" : "❌"} {c.label}
                    </div>
                ))}
            </div>
            {error && <FormMessage>{error}</FormMessage>}
            <FormLabel className="required text-[#42474a] text-[14px] font-[700] mt-4">
                Confirmar senha
            </FormLabel>
            <FormControl>
                <div className="relative">
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
        </FormItem>
    );
}
