import Image from "next/image";

export default function LogoPrefeituraSP({ className = "", ...props }) {
    return (
        <Image
            src="/images/logo-prefeitura-sp.webp"
            alt="Logo prefeitura de SP"
            width={120}
            height={70}
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
