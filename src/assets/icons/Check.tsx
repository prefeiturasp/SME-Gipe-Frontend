import * as React from "react";

// SVG baseado em icon-park-outline_check-one
export default function Check(props: Readonly<React.SVGProps<SVGSVGElement>>) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#297805"
                strokeWidth="4"
            />
            <path
                d="M16 24L22 30L32 18"
                stroke="#297805"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
}
