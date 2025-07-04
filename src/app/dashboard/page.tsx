"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/useUserStore";

export default function Dashboard() {
    const user = useUserStore((state) => state.user);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) {
        return null;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Usuário não autenticado.
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                Dashboard
                            </h1>

                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <h2 className="text-lg font-medium text-blue-900 mb-2">
                                    Informações da Sessão
                                </h2>
                                <div className="space-y-2 text-sm text-blue-800">
                                    <p>
                                        <strong>Nome:</strong> {user.name}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                    <p>
                                        <strong>Cargo:</strong> {user.role}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">
                                    Área Protegida
                                </h3>
                                <p className="text-gray-600">
                                    Este conteúdo só é visível para usuários
                                    autenticados. Você está vendo isso porque
                                    fez login com sucesso!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
