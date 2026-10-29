"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Calculator,
    Delete,
    Divide,
    Minus,
    Percent,
    Plus,
    Trash2,
    X,
} from "lucide-react";

type Operator = "+" | "-" | "×" | "÷";

interface CalculatorModalProps {
    className?: string;
}

interface CalculationHistory {
    id: number;
    expression: string;
    result: string;
}

const MAX_DISPLAY_LENGTH = 15;
const MAX_HISTORY_ITEMS = 8;
const HISTORY_STORAGE_KEY = "calculator-history";

export function CalculatorModal({
    className = "",
}: CalculatorModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [display, setDisplay] = useState("0");
    const [storedValue, setStoredValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<Operator | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [history, setHistory] = useState<CalculationHistory[]>([]);

    /* -------------------------------------------------
     * Load History
     * ------------------------------------------------- */

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem(
                HISTORY_STORAGE_KEY,
            );

            if (!savedHistory) return;

            const parsedHistory = JSON.parse(
                savedHistory,
            ) as CalculationHistory[];

            if (!Array.isArray(parsedHistory)) return;

            const validHistory = parsedHistory
                .filter(
                    (item) =>
                        item &&
                        typeof item.id === "number" &&
                        typeof item.expression === "string" &&
                        typeof item.result === "string",
                )
                .slice(0, MAX_HISTORY_ITEMS);

            setHistory(validHistory);
        } catch {
            // Ignore invalid localStorage data.
        }
    }, []);

    /* -------------------------------------------------
     * Save History
     * ------------------------------------------------- */

    useEffect(() => {
        try {
            if (history.length === 0) {
                localStorage.removeItem(HISTORY_STORAGE_KEY);
                return;
            }

            localStorage.setItem(
                HISTORY_STORAGE_KEY,
                JSON.stringify(history),
            );
        } catch {
            // Ignore localStorage errors.
        }
    }, [history]);

    /* -------------------------------------------------
     * Reset Calculator
     * ------------------------------------------------- */

    const resetCalculator = useCallback(() => {
        setDisplay("0");
        setStoredValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        setError(null);
    }, []);

    /* -------------------------------------------------
     * Open / Close Calculator
     * ------------------------------------------------- */

    const openCalculator = useCallback(() => {
        setIsOpen(true);
        setError(null);
    }, []);

    const closeCalculator = useCallback(() => {
        setIsOpen(false);
    }, []);

    /* -------------------------------------------------
     * Number Input
     * ------------------------------------------------- */

    const inputNumber = useCallback(
        (value: string) => {
            setError(null);

            if (waitingForOperand) {
                setDisplay(value);
                setWaitingForOperand(false);
                return;
            }

            setDisplay((current) => {
                if (current === "0") {
                    return value;
                }

                const cleanLength = current.startsWith("-")
                    ? current.length - 1
                    : current.length;

                if (cleanLength >= MAX_DISPLAY_LENGTH) {
                    return current;
                }

                return `${current}${value}`;
            });
        },
        [waitingForOperand],
    );

    /* -------------------------------------------------
     * Decimal Input
     * ------------------------------------------------- */

    const inputDecimal = useCallback(() => {
        setError(null);

        if (waitingForOperand) {
            setDisplay("0.");
            setWaitingForOperand(false);
            return;
        }

        setDisplay((current) => {
            if (current.includes(".")) {
                return current;
            }

            return `${current}.`;
        });
    }, [waitingForOperand]);

    /* -------------------------------------------------
     * Calculate
     * ------------------------------------------------- */

    const calculate = useCallback(
        (
            first: number,
            second: number,
            currentOperator: Operator,
        ): number | null => {
            switch (currentOperator) {
                case "+":
                    return first + second;

                case "-":
                    return first - second;

                case "×":
                    return first * second;

                case "÷":
                    if (second === 0) {
                        return null;
                    }

                    return first / second;

                default:
                    return second;
            }
        },
        [],
    );

    /* -------------------------------------------------
     * Format Result
     * ------------------------------------------------- */

    const formatResult = useCallback((value: number) => {
        if (!Number.isFinite(value)) {
            return null;
        }

        const formatted = Number(value.toPrecision(12));

        if (!Number.isFinite(formatted)) {
            return null;
        }

        return String(formatted);
    }, []);

    /* -------------------------------------------------
     * Add History
     * ------------------------------------------------- */

    const addToHistory = useCallback(
        (
            first: number,
            second: number,
            currentOperator: Operator,
            result: string,
        ) => {
            const newItem: CalculationHistory = {
                id: Date.now(),
                expression: `${first} ${currentOperator} ${second}`,
                result,
            };

            setHistory((current) =>
                [newItem, ...current].slice(
                    0,
                    MAX_HISTORY_ITEMS,
                ),
            );
        },
        [],
    );

    /* -------------------------------------------------
     * Remove One History
     * ------------------------------------------------- */

    const removeHistoryItem = useCallback((id: number) => {
        setHistory((current) =>
            current.filter((item) => item.id !== id),
        );
    }, []);

    /* -------------------------------------------------
     * Clear All History
     * ------------------------------------------------- */

    const clearHistory = useCallback(() => {
        setHistory([]);

        try {
            localStorage.removeItem(HISTORY_STORAGE_KEY);
        } catch {
            // Ignore localStorage errors.
        }
    }, []);

    /* -------------------------------------------------
     * Select History Result
     * ------------------------------------------------- */

    const selectHistoryResult = useCallback((result: string) => {
        setDisplay(result);
        setStoredValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        setError(null);
    }, []);

    /* -------------------------------------------------
     * Handle Operator
     * ------------------------------------------------- */

    const handleOperator = useCallback(
        (nextOperator: Operator) => {
            setError(null);

            const inputValue = Number(display);

            if (!Number.isFinite(inputValue)) {
                setError("Invalid value");
                return;
            }

            if (
                storedValue !== null &&
                operator !== null &&
                !waitingForOperand
            ) {
                const result = calculate(
                    storedValue,
                    inputValue,
                    operator,
                );

                if (result === null) {
                    setError("Cannot divide by zero");
                    return;
                }

                const formattedResult = formatResult(result);

                if (formattedResult === null) {
                    setError("Result is too large");
                    return;
                }

                setDisplay(formattedResult);
                setStoredValue(result);
            } else if (storedValue === null) {
                setStoredValue(inputValue);
            }

            setOperator(nextOperator);
            setWaitingForOperand(true);
        },
        [
            calculate,
            display,
            formatResult,
            operator,
            storedValue,
            waitingForOperand,
        ],
    );

    /* -------------------------------------------------
     * Handle Equals
     * ------------------------------------------------- */

    const handleEquals = useCallback(() => {
        if (
            storedValue === null ||
            operator === null ||
            waitingForOperand
        ) {
            return;
        }

        const inputValue = Number(display);

        if (!Number.isFinite(inputValue)) {
            setError("Invalid value");
            return;
        }

        const result = calculate(
            storedValue,
            inputValue,
            operator,
        );

        if (result === null) {
            setError("Cannot divide by zero");
            return;
        }

        const formattedResult = formatResult(result);

        if (formattedResult === null) {
            setError("Result is too large");
            return;
        }

        addToHistory(
            storedValue,
            inputValue,
            operator,
            formattedResult,
        );

        setDisplay(formattedResult);
        setStoredValue(null);
        setOperator(null);
        setWaitingForOperand(true);
    }, [
        addToHistory,
        calculate,
        display,
        formatResult,
        operator,
        storedValue,
        waitingForOperand,
    ]);

    /* -------------------------------------------------
     * Handle Percentage
     * ------------------------------------------------- */

    const handlePercentage = useCallback(() => {
        setError(null);

        const currentValue = Number(display);

        if (!Number.isFinite(currentValue)) {
            setError("Invalid value");
            return;
        }

        let percentageValue: number;

        if (
            storedValue !== null &&
            operator !== null &&
            (operator === "+" || operator === "-")
        ) {
            percentageValue =
                (storedValue * currentValue) / 100;
        } else {
            percentageValue = currentValue / 100;
        }

        const formattedResult =
            formatResult(percentageValue);

        if (formattedResult === null) {
            setError("Invalid percentage");
            return;
        }

        setDisplay(formattedResult);
        setWaitingForOperand(true);
    }, [
        display,
        formatResult,
        operator,
        storedValue,
    ]);

    /* -------------------------------------------------
     * Handle Backspace
     * ------------------------------------------------- */

    const handleBackspace = useCallback(() => {
        if (waitingForOperand) {
            return;
        }

        setError(null);

        setDisplay((current) => {
            if (current.length <= 1) {
                return "0";
            }

            if (
                current.length === 2 &&
                current.startsWith("-")
            ) {
                return "0";
            }

            const nextValue = current.slice(0, -1);

            return nextValue === "-" || nextValue === ""
                ? "0"
                : nextValue;
        });
    }, [waitingForOperand]);

    /* -------------------------------------------------
     * Keyboard Support
     * ------------------------------------------------- */

    const handleKeyboard = useCallback(
        (event: KeyboardEvent) => {
            if (!isOpen) {
                return;
            }

            const { key } = event;

            if (/^[0-9]$/.test(key)) {
                event.preventDefault();
                inputNumber(key);
                return;
            }

            switch (key) {
                case ".":
                    event.preventDefault();
                    inputDecimal();
                    break;

                case "+":
                    event.preventDefault();
                    handleOperator("+");
                    break;

                case "-":
                    event.preventDefault();
                    handleOperator("-");
                    break;

                case "*":
                case "x":
                case "X":
                    event.preventDefault();
                    handleOperator("×");
                    break;

                case "/":
                    event.preventDefault();
                    handleOperator("÷");
                    break;

                case "%":
                    event.preventDefault();
                    handlePercentage();
                    break;

                case "Enter":
                case "=":
                    event.preventDefault();
                    handleEquals();
                    break;

                case "Backspace":
                    event.preventDefault();
                    handleBackspace();
                    break;

                case "Escape":
                    event.preventDefault();
                    closeCalculator();
                    break;

                case "Delete":
                case "c":
                case "C":
                    event.preventDefault();
                    resetCalculator();
                    break;

                default:
                    break;
            }
        },
        [
            closeCalculator,
            handleBackspace,
            handleEquals,
            handleOperator,
            handlePercentage,
            inputDecimal,
            inputNumber,
            isOpen,
            resetCalculator,
        ],
    );

    /* -------------------------------------------------
     * Keyboard Event Listener
     * ------------------------------------------------- */

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        window.addEventListener(
            "keydown",
            handleKeyboard,
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyboard,
            );
        };
    }, [handleKeyboard, isOpen]);

    /* -------------------------------------------------
     * Display Current Operator
     * ------------------------------------------------- */

    const displayOperator =
        storedValue !== null && operator
            ? operator
            : null;

    /* -------------------------------------------------
     * Button Classes
     * ------------------------------------------------- */

    const numberButtonClass = [
        "h-9 sm:h-10 md:h-10",
        "min-h-0",
        "rounded-lg sm:rounded-xl",
        "border border-slate-200/60",
        "bg-white",
        "text-[13px] sm:text-[14px]",
        "font-semibold text-slate-800",
        "transition-all duration-150",
        "hover:border-slate-300/70 hover:bg-slate-50",
        "active:scale-[0.97]",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-blue-500/30",
    ].join(" ");

    const operatorButtonClass = [
        "flex h-9 sm:h-10 md:h-10",
        "min-h-0",
        "items-center justify-center",
        "rounded-lg sm:rounded-xl",
        "border border-blue-100/70",
        "bg-blue-50/70 text-blue-600",
        "transition-all duration-150",
        "hover:border-blue-200/80 hover:bg-blue-100/80",
        "active:scale-[0.97]",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-blue-500/30",
    ].join(" ");

    return (
        <>
            {/* -------------------------------------------------
             * Calculator Trigger
             * ------------------------------------------------- */}

            <button
                type="button"
                onClick={openCalculator}
                aria-label="Open calculator"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                className={[
                    "inline-flex h-10 w-10 items-center justify-center",
                    "rounded-xl border border-slate-200/70",
                    "bg-white text-slate-600 shadow-sm",
                    "transition-all duration-200",
                    "hover:border-blue-200/80",
                    "hover:bg-blue-50",
                    "hover:text-blue-600",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-blue-500/50",
                    "focus-visible:ring-offset-2",
                    className,
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <Calculator className="h-[18px] w-[18px]" />
            </button>

            {/* -------------------------------------------------
             * Calculator Modal
             * ------------------------------------------------- */}

            {isOpen && (
                <div
                    className="fixed inset-0 z-[9999] pointer-events-none"
                    aria-hidden={!isOpen}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="calculator-title"
                        className={[
                            "pointer-events-auto",
                            "absolute right-2 top-14 sm:right-4 sm:top-16",
                            "w-[calc(100vw-1rem)]",
                            "max-w-[360px]",
                            "overflow-hidden",
                            "rounded-2xl sm:rounded-3xl",
                            "border border-slate-200/70",
                            "bg-white",
                            "shadow-[0_20px_60px_rgba(15,23,42,0.14)]",
                            "animate-in fade-in slide-in-from-top-2",
                            "duration-200",
                            "max-h-[calc(100dvh-4.5rem)]",
                            "flex flex-col",
                        ].join(" ")}
                    >
                        {/* Header */}

                        <header className="flex shrink-0 items-center justify-between border-b border-slate-200/60 px-2 py-1.5">
                            <div className="flex min-w-0 items-center gap-1.5">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                                    <Calculator className="h-3 w-3" />
                                </div>

                                <div className="min-w-0 leading-none">
                                    <h2
                                        id="calculator-title"
                                        className="truncate text-[10px] font-semibold text-slate-900"
                                    >
                                        Calculator
                                    </h2>

                                    <p className="mt-0.5 text-[7px] text-slate-400">
                                        Quick calculations
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeCalculator}
                                aria-label="Close calculator"
                                className={[
                                    "flex h-6 w-6 shrink-0",
                                    "items-center justify-center",
                                    "rounded-md",
                                    "border border-slate-200/60",
                                    "text-slate-400",
                                    "transition-all duration-150",
                                    "hover:border-red-100",
                                    "hover:bg-red-50",
                                    "hover:text-red-500",
                                    "active:scale-95",
                                    "focus-visible:outline-none",
                                    "focus-visible:ring-1",
                                    "focus-visible:ring-red-500/30",
                                ].join(" ")}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </header>
                        {/* Display */}

                        <div className="shrink-0 border-b border-blue-100/60 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/70 px-3.5 py-3 sm:px-4 sm:py-3.5">
                            <div className="flex min-h-3 items-center justify-end gap-1.5">
                                {storedValue !== null && (
                                    <span className="max-w-[65%] truncate text-[9px] font-medium text-slate-400 sm:text-[10px]">
                                        {storedValue}
                                    </span>
                                )}

                                {displayOperator && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-100/80 text-[10px] font-bold text-blue-600">
                                        {displayOperator}
                                    </span>
                                )}
                            </div>

                            <div className="mt-1 flex min-h-[32px] items-center justify-end overflow-hidden">
                                <span
                                    className={[
                                        "block max-w-full truncate",
                                        "text-right font-semibold tracking-tight",
                                        "text-[1.8rem] leading-none",
                                        "xs:text-[2rem]",
                                        "sm:text-[2.2rem]",
                                        error
                                            ? "text-red-500"
                                            : "text-slate-900",
                                    ].join(" ")}
                                    title={display}
                                >
                                    {display}
                                </span>
                            </div>

                            {error && (
                                <div className="mt-1 text-right text-[9px] font-medium text-red-500 sm:text-[10px]">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* History */}


                        {/* Keypad */}

                        <div className="grid grid-cols-4 gap-1.5 bg-slate-50/70 p-2.5 sm:gap-2 sm:p-3">
                            {/* Row 1 */}

                            <button
                                type="button"
                                onClick={resetCalculator}
                                className={[
                                    "h-11 rounded-xl",
                                    "border border-red-100/70",
                                    "bg-red-50/70",
                                    "text-xs font-semibold text-red-500",
                                    "transition-all duration-150",
                                    "hover:border-red-200/80",
                                    "hover:bg-red-100/80",
                                    "active:scale-[0.97]",
                                    "focus-visible:outline-none",
                                    "focus-visible:ring-2",
                                    "focus-visible:ring-red-500/30",
                                    "sm:h-[50px] sm:rounded-2xl sm:text-sm",
                                ].join(" ")}
                            >
                                AC
                            </button>

                            <button
                                type="button"
                                onClick={handleBackspace}
                                aria-label="Backspace"
                                className={[
                                    numberButtonClass,
                                    "flex items-center justify-center",
                                ].join(" ")}
                            >
                                <Delete className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                            </button>

                            <button
                                type="button"
                                onClick={handlePercentage}
                                aria-label="Percentage"
                                className={operatorButtonClass}
                            >
                                <Percent className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleOperator("÷")
                                }
                                aria-label="Divide"
                                className={operatorButtonClass}
                            >
                                <Divide className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                            </button>

                            {/* Row 2 */}

                            {["7", "8", "9"].map((number) => (
                                <button
                                    key={number}
                                    type="button"
                                    onClick={() =>
                                        inputNumber(number)
                                    }
                                    className={numberButtonClass}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    handleOperator("×")
                                }
                                aria-label="Multiply"
                                className={operatorButtonClass}
                            >
                                ×
                            </button>

                            {/* Row 3 */}

                            {["4", "5", "6"].map((number) => (
                                <button
                                    key={number}
                                    type="button"
                                    onClick={() =>
                                        inputNumber(number)
                                    }
                                    className={numberButtonClass}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    handleOperator("-")
                                }
                                aria-label="Subtract"
                                className={operatorButtonClass}
                            >
                                <Minus className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                            </button>

                            {/* Row 4 */}

                            {["1", "2", "3"].map((number) => (
                                <button
                                    key={number}
                                    type="button"
                                    onClick={() =>
                                        inputNumber(number)
                                    }
                                    className={numberButtonClass}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    handleOperator("+")
                                }
                                aria-label="Add"
                                className={operatorButtonClass}
                            >
                                <Plus className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                            </button>

                            {/* Row 5 */}

                            <button
                                type="button"
                                onClick={() =>
                                    inputNumber("0")
                                }
                                className={[
                                    numberButtonClass,
                                    "col-span-2",
                                ].join(" ")}
                            >
                                0
                            </button>

                            <button
                                type="button"
                                onClick={inputDecimal}
                                className={numberButtonClass}
                            >
                                .
                            </button>

                            <button
                                type="button"
                                onClick={handleEquals}
                                aria-label="Equals"
                                className={[
                                    "flex h-11 items-center justify-center",
                                    "rounded-xl sm:h-[50px] sm:rounded-2xl",
                                    "border border-blue-600/90",
                                    "bg-blue-600",
                                    "text-base font-bold text-white",
                                    "shadow-sm shadow-blue-600/20",
                                    "transition-all duration-150",
                                    "hover:border-blue-700",
                                    "hover:bg-blue-700",
                                    "active:scale-[0.97]",
                                    "focus-visible:outline-none",
                                    "focus-visible:ring-2",
                                    "focus-visible:ring-blue-500/40",
                                    "sm:text-lg",
                                ].join(" ")}
                            >
                                =
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="max-h-[72px] overflow-y-auto px-2.5 pb-1 sm:px-3">
                            <div className="space-y-0.5">
                                {history.map((item) => (
                                    <div
                                        key={item.id}
                                        className={[
                                            "group flex items-center gap-1",
                                            "rounded-lg px-2",
                                            "transition-colors",
                                            "hover:bg-slate-50",
                                        ].join(" ")}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                selectHistoryResult(item.result)
                                            }
                                            className={[
                                                "flex min-w-0 flex-1",
                                                "items-center justify-between",
                                                "gap-2 text-left",
                                                "rounded-md",
                                                "focus-visible:outline-none",
                                                "focus-visible:ring-2",
                                                "focus-visible:ring-blue-500/30",
                                            ].join(" ")}
                                        >
                                            <span className="min-w-0 truncate text-[9px] font-medium text-slate-400 sm:text-[10px]">
                                                {item.expression}
                                            </span>

                                            <span className="shrink-0 text-[11px] font-semibold text-slate-800 sm:text-xs">
                                                = {item.result}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeHistoryItem(item.id)
                                            }
                                            aria-label={`Remove ${item.expression}`}
                                            className={[
                                                "flex h-6 w-6 shrink-0",
                                                "items-center justify-center",
                                                "rounded-md",
                                                "text-slate-300",
                                                "opacity-100 sm:opacity-0",
                                                "transition-all",
                                                "group-hover:opacity-100",
                                                "hover:bg-red-50",
                                                "hover:text-red-500",
                                                "focus-visible:opacity-100",
                                                "focus-visible:outline-none",
                                                "focus-visible:ring-2",
                                                "focus-visible:ring-red-500/30",
                                            ].join(" ")}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <footer className="flex shrink-0 items-center justify-center border-t border-slate-200/60 bg-white px-3 py-1.5 sm:py-2">
                            <span className="text-[8px] text-slate-400 sm:text-[9px]">
                                Keyboard supported · ESC to close
                            </span>
                        </footer>
                    </section>
                </div>
            )}
        </>
    );
}