import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

function sendZodError(res: Response, message: string, issues: unknown) {
	return res.status(400).json({
		error: message,
		issues,
	});
}

export function validateBody<T>(schema: ZodType<T>) {
	return (req: Request, res: Response, next: NextFunction): void => {
		const parsed = schema.safeParse(req.body);
		if (!parsed.success) {
			sendZodError(res, "Invalid request body", parsed.error.issues);
			return;
		}

		req.body = parsed.data;
		next();
	};
}

export function validateParams<T extends Record<string, string>>(schema: ZodType<T>) {
	return (req: Request, res: Response, next: NextFunction): void => {
		const parsed = schema.safeParse(req.params);
		if (!parsed.success) {
			sendZodError(res, "Invalid route params", parsed.error.issues);
			return;
		}

		req.params = parsed.data;
		next();
	};
}
