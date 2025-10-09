"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import useMe from "@/hooks/useMe";
import { useUserStore } from "@/stores/useUserStore";
import FullPageLoader from "@/components/ui/FullPageLoader";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const { user, clearUser } = useUserStore();
    const { isLoading, isError, data: userData } = useMe();
    const didRedirect = useRef(false);

    useEffect(() => {
        if (isLoading) return;

        if (didRedirect.current) return;

        if (isError || !userData) {
            didRedirect.current = true;
            queryClient.removeQueries({ queryKey: ["me"] });
            clearUser();

            if (pathname !== "/") {
                router.push("/");
            }
        }
    }, [
        isLoading,
        isError,
        userData,
        router,
        pathname,
        clearUser,
        queryClient,
    ]);

    if (isLoading || !user) {
        return <FullPageLoader />;
    }

    return <>{children}</>;
};

export default AuthGuard;
