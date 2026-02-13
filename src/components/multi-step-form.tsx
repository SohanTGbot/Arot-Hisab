"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Step {
    id: string;
    title: string;
    description?: string;
    content: ReactNode;
    optional?: boolean;
}

interface MultiStepFormProps {
    steps: Step[];
    onComplete: () => void;
    onStepChange?: (step: number) => void;
}

export function MultiStepForm({ steps, onComplete, onStepChange }: MultiStepFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    const currentStepData = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;
    const isFirstStep = currentStep === 0;

    const handleNext = () => {
        if (isLastStep) {
            onComplete();
        } else {
            setCompletedSteps((prev) => new Set(prev).add(currentStep));
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            onStepChange?.(nextStep);
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            const prevStep = currentStep - 1;
            setCurrentStep(prevStep);
            onStepChange?.(prevStep);
        }
    };

    const handleStepClick = (index: number) => {
        if (index < currentStep || completedSteps.has(index)) {
            setCurrentStep(index);
            onStepChange?.(index);
        }
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    return (
        <div className="space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.has(index);
                    const isCurrent = index === currentStep;
                    const isAccessible = index <= currentStep || isCompleted;

                    return (
                        <div key={step.id} className="flex items-center flex-1">
                            <button
                                onClick={() => handleStepClick(index)}
                                disabled={!isAccessible}
                                className={cn(
                                    "flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-2 transition-all",
                                    isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                                )}
                                aria-label={`Step ${index + 1}: ${step.title}`}
                                aria-current={isCurrent ? "step" : undefined}
                            >
                                <div
                                    className={cn(
                                        "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                                        isCurrent && "border-primary bg-primary text-primary-foreground",
                                        isCompleted && !isCurrent && "border-primary bg-primary/10 text-primary",
                                        !isCurrent && !isCompleted && "border-muted-foreground/30"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <span className="font-semibold">{index + 1}</span>
                                    )}
                                </div>
                                <div className="hidden md:block text-left">
                                    <div className={cn("text-sm font-medium", isCurrent && "text-primary")}>
                                        {step.title}
                                    </div>
                                    {step.optional && (
                                        <div className="text-xs text-muted-foreground">Optional</div>
                                    )}
                                </div>
                            </button>
                            {index < steps.length - 1 && (
                                <div className={cn(
                                    "flex-1 h-0.5 mx-2 transition-all",
                                    isCompleted ? "bg-primary" : "bg-muted"
                                )} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Content */}
            <Card className="min-h-[400px]">
                <CardHeader>
                    <CardTitle>{currentStepData.title}</CardTitle>
                    {currentStepData.description && (
                        <CardDescription>{currentStepData.description}</CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    <AnimatePresence mode="wait" custom={1}>
                        <motion.div
                            key={currentStep}
                            custom={1}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                        >
                            {currentStepData.content}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isFirstStep}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>
                <Button onClick={handleNext}>
                    {isLastStep ? "Complete" : "Next"}
                    {!isLastStep && <ChevronRight className="h-4 w-4 ml-2" />}
                </Button>
            </div>
        </div>
    );
}
