import type { Prisma } from "@prisma/client";
import type {
	GenerateSpecBody,
	StoryInput,
	TaskInput,
	UpdateSpecBody,
} from "../schemas/spec.schema";

export type GenerateInput = GenerateSpecBody;
export type StoryDTO = StoryInput;
export type TaskDTO = TaskInput;
export type UpdateSpecPayload = UpdateSpecBody;

export interface SpecResponse {
	id: string;
	createdAt: Date;
	input: {
		goal: string;
		users: string;
		constraints: string | null;
		template: string;
	};
	output: {
		stories: StoryDTO[];
		tasks: TaskDTO[];
	};
}

export interface HealthResponse {
	status: "ok" | "degraded";
	timestamp: string;
	backend: {
		status: "up";
		uptimeSeconds: number;
	};
	database: {
		status: "up" | "down";
		responseTimeMs: number;
		error?: string;
	};
}

export type ProjectSpecWithRelations = Prisma.ProjectSpecGetPayload<{
	include: {
		stories: true;
		tasks: true;
	};
}>;
