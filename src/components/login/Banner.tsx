import Image from "next/image";

export default function Banner() {
    return (
        <div className="w-full h-full relative overflow-hidden">
            <Image
                src="/images/banner.webp"
                alt="Banner do login"
                fill
                className="object-cover"
                priority
            />
        </div>
    );
}
