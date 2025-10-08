"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Logout from "@/assets/icons/Logout";
import { useUserStore } from "@/stores/useUserStore";

export default function SignOutButton() {
    const router = useRouter();
    const clearUser = useUserStore((state) => state.clearUser);

    const handleLogout = () => {
        clearUser();
        router.push("/");
    };

    return (
        <Button
            onClick={handleLogout}
            variant="ghost"
            className="flex h-[80px] flex-col items-center text-xs"
            style={{ color: "#929494" }}
        >
            <Logout width={28} height={28} />
            Sair
        </Button>
    );
}
