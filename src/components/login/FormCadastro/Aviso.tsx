import { ReactNode } from "react";
import AlertSmall from "@/assets/icons/AlertSmall";

interface AvisoProps {
    children: ReactNode;
}

export default function Aviso({ children }: AvisoProps) {
    return (
        <div className="flex items-start gap-2 p-4 rounded-md bg-[#F5F5F5] text-[#42474a]">
            <AlertSmall className="w-[22px]" />
            <span
                className="text-[14px] font-normal"
                style={{ lineHeight: 1.2 }}
            >
                {children}
            </span>
        </div>
    );
}
