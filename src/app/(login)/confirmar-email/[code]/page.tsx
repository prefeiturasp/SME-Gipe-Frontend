import ConfirmarEmail from "@/components/dashboard/MeusDados/ConfirmarEmail";

export default function Page({
    params,
}: {
    readonly params: { readonly code: string };
}) {
    const code = decodeURIComponent(params.code);

    return <ConfirmarEmail code={code} />;
}
