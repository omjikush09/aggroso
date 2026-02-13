import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface DialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<button
				className="absolute inset-0 bg-black/70"
				onClick={() => onOpenChange(false)}
				aria-label="Close dialog"
			/>
			<div className="relative z-10 w-full max-w-md px-4">{children}</div>
		</div>
	);
}

export function DialogContent({
	className,
	children,
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"rounded-xl border border-gray-800 bg-gray-950 p-5 shadow-2xl",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function DialogHeader({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("space-y-1.5", className)} {...props} />;
}

export function DialogTitle({
	className,
	...props
}: HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h2 className={cn("text-lg font-semibold text-white", className)} {...props} />
	);
}

export function DialogDescription({
	className,
	...props
}: HTMLAttributes<HTMLParagraphElement>) {
	return <p className={cn("text-sm text-gray-400", className)} {...props} />;
}

export function DialogFooter({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("mt-5 flex items-center justify-end gap-2", className)}
			{...props}
		/>
	);
}
