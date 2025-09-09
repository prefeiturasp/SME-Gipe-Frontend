"use client";

import { useEffect, useState } from "react";
import LogoGipe from "@/components/login/LogoGipe";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import Check from "@/assets/icons/Check";
import CloseCheck from "@/assets/icons/CloseCheck";
import useConfirmarEmail from "@/hooks/useConfirmarEmail";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUserStore";
import Cookies from "js-cookie";

import LogoPrefeituraSP from "../../../login/LogoPrefeituraSP";

export default function ConfirmarEmail({ code }: { readonly code: string }) {
    const [returnMessage, setReturnMessage] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    const router = useRouter();
    const clearUser = useUserStore((state) => state.clearUser);
    const { mutateAsync, isPending } = useConfirmarEmail();

    useEffect(() => {
        const sendChangeEmail = async () => {
            const response = await mutateAsync({
                code: code,
            });

            console.log(response);

            if (response.success) {
                setReturnMessage({
                    success: true,
                    message:
                        "Agora você já possui acesso ao GIPE com o novo endereço de e-mail cadastrado.",
                });
            } else {
                setReturnMessage({
                    success: false,
                    message: response.error,
                });
            }
        };
        sendChangeEmail();
    }, [code]);

    const handleLogout = () => {
        clearUser();
        Cookies.remove("user_data", { path: "/" });
        router.push("/");
    };

    return (
        <div className="w-full max-w-sm h-screen mx-auto flex flex-col py-0 overflow-hidden">
            <div className="flex justify-start pt-20">
                <LogoGipe />
            </div>

            <div className="flex-1 flex items-center justify-center">
                {!returnMessage || isPending ? (
                    <div className="flex flex-col items-center">
                        <svg
                            className="animate-spin origin-center"
                            style={{
                                transformBox: "fill-box",
                                transformOrigin: "center",
                            }}
                            width="53.333"
                            height="58.171"
                            viewBox="16440.833 -5746.213 53.333 58.171"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            aria-hidden
                        >
                            <g style={{ fill: "#000" }} rx="0" ry="0">
                                <g>
                                    <g className="fills">
                                        <path
                                            fill="none"
                                            fillRule="evenodd"
                                            d="M16469.081,-5689.525L16469.081,-5689.525ZL16468.863,-5689.426L16468.809,-5689.416L16468.772,-5689.426L16468.583,-5689.520C16468.554,-5689.528,16468.533,-5689.524,16468.519,-5689.506L16468.508,-5689.480L16468.463,-5688.338L16468.476,-5688.285L16468.503,-5688.250L16468.780,-5688.053L16468.820,-5688.042L16468.852,-5688.053L16469.129,-5688.250L16469.161,-5688.293L16469.172,-5688.338L16469.081,-5689.525ZC16469.120,-5689.505,16469.104,-5689.521,16469.081,-5689.525ZM16469.788,-5689.826L16469.788,-5689.826ZL16469.260,-5689.573L16469.233,-5689.546L16469.225,-5689.517L16469.273,-5688.370L16469.287,-5688.338L16469.308,-5688.320L16469.844,-5688.072C16469.878,-5688.063,16469.904,-5688.070,16469.921,-5688.093L16469.932,-5688.130L16469.788,-5689.826ZC16469.832,-5689.800,16469.815,-5689.819,16469.788,-5689.826ZM16467.881,-5689.821C16467.857,-5689.836,16467.825,-5689.829,16467.881,-5689.821ZL16467.793,-5689.768L16467.703,-5688.130C16467.704,-5688.098,16467.720,-5688.077,16467.748,-5688.066L16467.788,-5688.072L16468.324,-5688.320L16468.351,-5688.341L16468.361,-5688.370L16468.407,-5689.517L16468.399,-5689.549L16468.372,-5689.576Z"
                                        />
                                    </g>
                                </g>
                                <g style={{ opacity: 0.1 }}>
                                    <g className="fills">
                                        <path
                                            fill="#000000"
                                            d="M16467.500,-5740.880C16455.718,-5740.880,16446.167,-5731.328,16446.167,-5719.546C16446.167,-5707.764,16455.718,-5698.213,16467.500,-5698.213C16479.282,-5698.213,16488.833,-5707.764,16488.833,-5719.546C16488.833,-5731.328,16479.282,-5740.880,16467.500,-5740.880ZM16440.833,-5719.546C16440.833,-5734.274,16452.772,-5746.213,16467.500,-5746.213C16482.228,-5746.213,16494.167,-5734.274,16494.167,-5719.546C16494.167,-5704.818,16482.228,-5692.880,16467.500,-5692.880C16452.772,-5692.880,16440.833,-5704.818,16440.833,-5719.546Z"
                                        />
                                    </g>
                                </g>
                                <g>
                                    <g className="fills">
                                        <path
                                            fill="#717fc7"
                                            d="M16467.500,-5740.880C16462.000,-5740.891,16456.710,-5738.766,16452.745,-5734.954C16451.682,-5733.935,16449.994,-5733.971,16448.975,-5735.034C16447.956,-5736.098,16447.991,-5737.786,16449.055,-5738.805C16454.013,-5743.569,16460.624,-5746.224,16467.500,-5746.213C16468.973,-5746.213,16470.167,-5745.019,16470.167,-5743.546C16470.167,-5742.073,16468.973,-5740.880,16467.500,-5740.880Z"
                                        />
                                    </g>
                                </g>
                            </g>
                        </svg>

                        <p className="font-semibold text-[16px] mt-2">
                            Aguarde um momento!
                        </p>
                        <p className="text-sm text-center text-[#42474a] mt-1">
                            Estamos validando o seu e-mail...
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col py-6 w-full">
                        <h1 className="font-bold text-gray-900 text-[20px]">
                            {returnMessage.success
                                ? "E-mail confirmado!"
                                : "Ocorreu um erro!"}
                        </h1>
                        <Alert
                            className="mt-4"
                            variant={returnMessage.success ? "aviso" : "error"}
                        >
                            {returnMessage.success ? (
                                <Check height={20} width={20} />
                            ) : (
                                <CloseCheck height={20} width={20} />
                            )}
                            <AlertDescription>
                                {returnMessage.message}
                            </AlertDescription>
                        </Alert>

                        <div className="w-full mt-6">
                            <Button asChild variant="submit" className="w-full">
                                <Link
                                    href={
                                        returnMessage.success
                                            ? "/dashboard"
                                            : "/dashboard/meus-dados"
                                    }
                                    replace
                                >
                                    {returnMessage.success
                                        ? "Continuar no GIPE"
                                        : "Alterar e-mail"}
                                </Link>
                            </Button>
                            {returnMessage.success ? (
                                <Button
                                    onClick={handleLogout}
                                    variant="customOutline"
                                    className="w-full mt-2"
                                >
                                    Sair
                                </Button>
                            ) : (
                                <Button
                                    asChild
                                    variant="customOutline"
                                    className="w-full mt-2"
                                >
                                    <Link href="/dashboard">Cancelar</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center mt-auto pb-20">
                <div className="flex justify-center py-2">
                    <LogoPrefeituraSP />
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[#42474a] text-[12px] font-normal mt-3 text-center py-2">
                        - Sistema homologado para navegadores: Google Chrome e
                        Firefox
                    </span>
                </div>
            </div>
        </div>
    );
}
