"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Delete, Calculator as CalculatorIcon, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useNumberFormat } from "@/hooks/use-number-format";

export function Calculator() {
    const [display, setDisplay] = useState("0");
    const [equation, setEquation] = useState("");
    const [copied, setCopied] = useState(false);
    const { format } = useNumberFormat();

    const handleNumberConfig = (num: string) => {
        // We always store and calculate in English numerals internally
        // num comes in as English digit "0"-"9" from button click
        setDisplay((prev) => (prev === "0" ? num : prev + num));
        setEquation((prev) => prev + num);
    };

    const handleOperatorConfig = (op: string) => {
        setDisplay("0");
        setEquation((prev) => prev + " " + op + " ");
    };

    const handleClear = () => {
        setDisplay("0");
        setEquation("");
    };

    const handleEqual = () => {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(equation.replace(/×/g, "*").replace(/÷/g, "/"));
            setDisplay(String(result));
            setEquation(String(result));
        } catch (error) {
            setDisplay("Error");
            setEquation("");
        }
    };

    const handleDelete = () => {
        setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
        setEquation((prev) => (prev.length > 1 ? prev.slice(0, -1) : ""));
    };

    const handleCopy = () => {
        // Copy the displayed (potentially Bengali) number to clipboard
        navigator.clipboard.writeText(format(display));
        setCopied(true);
        toast.success("Result copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="glass-card w-full max-w-sm mx-auto overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg font-medium">
                    <span className="flex items-center gap-2">
                        <CalculatorIcon className="h-5 w-5" />
                        Quick Calc
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleCopy}
                        title="Copy Result"
                    >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg mb-4 text-right">
                    <div className="text-sm text-muted-foreground min-h-[1.25rem] overflow-hidden text-ellipsis whitespace-nowrap">
                        {/* Format equation characters individually to handle operators correctly */}
                        {equation.split('').map((char, index) => {
                            if ("0123456789.".includes(char)) return format(char);
                            return char.replace(/\*/g, "×").replace(/\//g, "÷");
                        })}
                        {!equation && format("0")}
                    </div>
                    <div className="text-3xl font-mono font-bold tracking-wider overflow-hidden text-ellipsis whitespace-nowrap">
                        {/* Display the Result/Current Input in selected numeral system */}
                        {format(display)}
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {/* Row 1 */}
                    <Button
                        variant="secondary"
                        className="bg-destructive/10 hover:bg-destructive/20 text-destructive font-bold text-lg"
                        onClick={handleClear}
                    >
                        C
                    </Button>
                    <Button variant="secondary" className="text-lg font-bold text-primary" onClick={() => handleOperatorConfig("/")}>÷</Button>
                    <Button variant="secondary" className="text-lg font-bold text-primary" onClick={() => handleOperatorConfig("*")}>×</Button>
                    <Button
                        variant="secondary"
                        className="text-lg"
                        onClick={handleDelete}
                    >
                        <Delete className="h-5 w-5" />
                    </Button>

                    {/* Row 2 */}
                    {[7, 8, 9].map((num) => (
                        <Button key={num} variant="outline" className="text-xl font-medium h-12" onClick={() => handleNumberConfig(String(num))}>
                            {format(String(num))}
                        </Button>
                    ))}
                    <Button variant="secondary" className="text-xl font-bold text-primary" onClick={() => handleOperatorConfig("-")}>-</Button>

                    {/* Row 3 */}
                    {[4, 5, 6].map((num) => (
                        <Button key={num} variant="outline" className="text-xl font-medium h-12" onClick={() => handleNumberConfig(String(num))}>
                            {format(String(num))}
                        </Button>
                    ))}
                    <Button variant="secondary" className="text-xl font-bold text-primary" onClick={() => handleOperatorConfig("+")}>+</Button>

                    {/* Row 4 */}
                    {[1, 2, 3].map((num) => (
                        <Button key={num} variant="outline" className="text-xl font-medium h-12" onClick={() => handleNumberConfig(String(num))}>
                            {format(String(num))}
                        </Button>
                    ))}
                    <Button
                        variant="default"
                        className="row-span-2 text-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 h-full"
                        onClick={handleEqual}
                    >
                        =
                    </Button>

                    {/* Row 5 */}
                    <Button variant="outline" className="text-xl font-medium h-12 col-span-2" onClick={() => handleNumberConfig("0")}>
                        {format("0")}
                    </Button>
                    <Button variant="outline" className="text-xl font-medium h-12" onClick={() => handleNumberConfig(".")}>
                        .
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
