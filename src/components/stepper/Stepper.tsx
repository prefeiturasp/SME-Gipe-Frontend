"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
    label: string;
}

interface StepperProps {
    readonly steps: Step[];
    readonly currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className="flex w-full items-start justify-between">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                const renderStepContent = () => {
                    if (isCompleted) {
                        return (
                            <Check
                                width={16}
                                height={16}
                                color="#fff"
                                data-testid="check-icon"
                            />
                        );
                    }
                    return null;
                };

                return (
                    <div
                        key={step.label}
                        className="flex flex-1 flex-col items-center justify-start"
                    >
                        <div className="flex w-full items-center">
                            <div className="flex-1 border-t-[1.5px] border-[#DADADA]" />
                            <div
                                className={cn(
                                    "flex h-[20px] w-[20px] items-center justify-center rounded-full border-[2px] mx-2",
                                    {
                                        "border-[#717FC7] bg-[#717FC7]":
                                            isCompleted,
                                        "border-[#717FC7] bg-transparent":
                                            isActive,
                                        "border-[#DADADA] bg-transparent":
                                            !isActive && !isCompleted,
                                    }
                                )}
                            >
                                {renderStepContent()}
                            </div>
                            <div className="flex-1 border-t-[1.5px] border-[#DADADA]" />
                        </div>
                        <div className="mt-2 text-center">
                            <p
                                className={cn(
                                    "flex h-[42px] w-[100px] items-center justify-center text-sm font-bold",
                                    {
                                        "text-[#42474a]":
                                            isActive || isCompleted,
                                        "text-[#dadada]":
                                            !isActive && !isCompleted,
                                    }
                                )}
                            >
                                {step.label}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
