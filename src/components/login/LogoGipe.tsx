import Image from "next/image";

export default function LogoGipe({ className = "", ...props }) {
    return (
        <Image
            src="/images/logo-gipe.webp"
            alt="Logo GIPE"
            width={320}
            height={260}
            className={`object-contain ${className}`}
            priority
            {...props}
        />
    );
}
