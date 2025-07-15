"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { useUserStore } from "@/stores/useUserStore";

export default function SignOutButton() {
    const router = useRouter();
    const clearUser = useUserStore((state) => state.clearUser);

    const handleLogout = () => {
        clearUser();

        Cookies.remove("user_data", { path: "/" });

        router.push("/login");
    };

    return (
        <Button
            variant="destructive"
            className="w-full rounded-full text-primary text-[16px] font-[700] md:h-[45px] md:pb-0 inline-block align-middle"
            onClick={handleLogout}
        >
            Sair
        </Button>
    );
}
