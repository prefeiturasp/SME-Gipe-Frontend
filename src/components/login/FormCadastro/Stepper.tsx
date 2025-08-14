"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
    label: string;
    description: string;
}

interface StepperProps {
    readonly steps: Step[];
    readonly currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className="flex items-center justify-center w-full mt-8">
            {steps.map((step, index) => {
                const isActive = index + 1 === currentStep;
                const isCompleted = index + 1 < currentStep;
                const isLast = index === steps.length - 1;

                let stepCircleClass =
                    "flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold";
                if (isActive) {
                    stepCircleClass +=
                        " bg-[#717FC7] text-white border-[#717FC7]";
                } else {
                    stepCircleClass +=
                        " bg-white text-gray-500 border-[#6F777C]";
                }

                return (
                    <div
                        key={step.label}
                        className="flex items-start justify-center flex-1"
                    >
                        <div className={stepCircleClass}>
                            {isCompleted ? (
                                <Check width={20} height={20} color="#717FC7" />
                            ) : (
                                index + 1
                            )}
                        </div>
                        <div className="ml-2 flex flex-col justify-start mt-1">
                            <p
                                className={cn(
                                    "text-md",
                                    isActive
                                        ? "text-[#42474a]"
                                        : "text-[#6f777c]"
                                )}
                            >
                                {step.label}
                            </p>
                            <p className="text-sm text-[#6f777c]">
                                {step.description}
                            </p>
                        </div>
                        {!isLast && (
                            <div className="-ml-8 -mr-4 flex-1 h-[1px] bg-[#717FC7] self-start mt-3" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
