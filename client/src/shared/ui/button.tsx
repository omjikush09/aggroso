import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

const variants = {
	default: "bg-purple-600 text-white hover:bg-purple-500",
	secondary: "bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700",
	destructive: "bg-red-600 text-white hover:bg-red-500",
	outline: "border border-gray-700 bg-transparent text-gray-200 hover:bg-gray-800",
};

const sizes = {
	default: "h-10 px-4 py-2",
	sm: "h-8 px-3 text-sm",
	lg: "h-11 px-6",
	icon: "h-10 w-10",
};

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

export function Button({
	className,
	variant = "default",
	size = "default",
	type = "button",
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			className={cn(
				"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
				variants[variant] ?? variants.default,
				sizes[size] ?? sizes.default,
				className,
			)}
			{...props}
		/>
	);
}
