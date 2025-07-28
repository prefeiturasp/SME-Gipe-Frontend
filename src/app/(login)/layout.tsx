import Banner from "@/components/login/Banner";
import React from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function LoginLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex w-screen h-screen overflow-hidden">
            <div className="w-1/2 h-full min-h-0 flex-shrink-0">
                <Banner />
            </div>
            <div className="w-1/2 h-full min-h-0 flex flex-col bg-white overflow-y-auto justify-center">
                <div className="w-full flex flex-col items-center flex-shrink-0 px-4 py-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
