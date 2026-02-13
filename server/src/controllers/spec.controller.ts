import type { Request, Response } from "express";
import {
	createGeneratedSpec,
	getHealthStatus,
	getHistory,
	updateSpec,
} from "../services/spec.service";
import type {
	GenerateSpecBody,
	UpdateSpecBody,
	UpdateSpecParams,
} from "../schemas/spec.schema";

export async function generateSpec(
	req: Request<Record<string, string>, unknown, GenerateSpecBody>,
	res: Response,
): Promise<Response> {
	try {
		const spec = await createGeneratedSpec(req.body);
		return res.json(spec);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Failed to save spec" });
	}
}

export async function getSpecHistory(
	_req: Request,
	res: Response,
): Promise<Response> {
	try {
		const history = await getHistory();
		return res.json(history);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Failed to fetch history" });
	}
}

export async function updateSpecById(
	req: Request<UpdateSpecParams, unknown, UpdateSpecBody>,
	res: Response,
): Promise<Response> {
	try {
		const updated = await updateSpec(req.params.id, req.body);
		if (!updated) {
			return res.status(404).json({ error: "Spec not found" });
		}
		return res.json(updated);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Failed to update spec" });
	}
}

export async function getHealth(
	_req: Request,
	res: Response,
): Promise<Response> {
	try {
		const health = await getHealthStatus();
		return res.status(health.status === "ok" ? 200 : 503).json(health);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			status: "degraded",
			error: "Failed to check health",
		});
	}
}
