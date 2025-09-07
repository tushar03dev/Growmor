"use client"

import { Check } from "lucide-react"

interface CheckoutStepsProps {
    currentStep: number
    steps: string[]
}

export function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
    return (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                    <div className="flex items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                index < currentStep
                                    ? "bg-green-500 text-white"
                                    : index === currentStep
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                            }`}
                        >
                            {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                        </div>
                        <span
                            className={`ml-2 text-sm font-medium ${
                                index <= currentStep ? "text-foreground" : "text-muted-foreground"
                            }`}
                        >
              {step}
            </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`w-12 h-px mx-4 ${index < currentStep ? "bg-green-500" : "bg-muted"}`} />
                    )}
                </div>
            ))}
        </div>
    )
}
