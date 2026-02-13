import { Router } from "express";
import {
	generateSpecBodySchema,
	updateSpecBodySchema,
	updateSpecParamsSchema,
} from "../schemas/spec.schema";
import { validateBody, validateParams } from "../middlewares/validate";
import {
	generateSpec,
	getHealth,
	getSpecHistory,
	updateSpecById,
} from "../controllers/spec.controller";

export const specRouter: Router = Router();

specRouter.get("/health", getHealth);
specRouter.post("/generate", validateBody(generateSpecBodySchema), generateSpec);
specRouter.get("/history", getSpecHistory);
specRouter.put(
	"/spec/:id",
	validateParams(updateSpecParamsSchema),
	validateBody(updateSpecBodySchema),
	updateSpecById,
);
