import type { Prisma } from "@prisma/client";
import type {
	GenerateInput,
	HealthResponse,
	ProjectSpecWithRelations,
	SpecResponse,
	StoryDTO,
	TaskDTO,
	UpdateSpecPayload,
} from "../types/spec";
import { prisma } from "../lib/prisma";

const orderedInclude = {
	stories: { orderBy: { position: "asc" as const } },
	tasks: { orderBy: { position: "asc" as const } },
};

export function generateSpecs({
	goal,
	users,
	constraints,
	template = "web",
}: GenerateInput): { stories: StoryDTO[]; tasks: TaskDTO[] } {
	const base = Date.now();

	const stories: StoryDTO[] = [
		{
			id: `us-${base}-1`,
			content: `As a ${users || "user"}, I want to achieve ${goal || "my goal"} so that I can be productive.`,
		},
		{
			id: `us-${base}-2`,
			content: `As an admin, I want to manage ${goal} configurations.`,
		},
	];

	const tasks: TaskDTO[] = [
		{
			id: `task-${base}-1`,
			content: `Setup project repository for ${template} app`,
			group: "setup",
		},
		{
			id: `task-${base}-2`,
			content: `Implement authentication for ${users || "users"}`,
			group: "backend",
		},
		{
			id: `task-${base}-3`,
			content: `Create UI for ${goal}`,
			group: "frontend",
		},
	];

	if (constraints) {
		tasks.push({
			id: `task-${base}-4`,
			content: `Ensure compliance with: ${constraints}`,
			group: "compliance",
		});
	}

	return { stories, tasks };
}

export function formatSpec(spec: ProjectSpecWithRelations): SpecResponse {
	return {
		id: spec.id,
		createdAt: spec.createdAt,
		input: {
			goal: spec.goal,
			users: spec.users,
			constraints: spec.constraints,
			template: spec.template,
		},
		output: {
			stories: spec.stories.map((story) => ({
				id: story.id,
				content: story.content,
			})),
			tasks: spec.tasks.map((task) => ({
				id: task.id,
				content: task.content,
				group: task.group,
				completed: task.completed,
			})),
		},
	};
}

export async function createGeneratedSpec(
	input: GenerateInput,
): Promise<SpecResponse> {
	const { stories, tasks } = generateSpecs({
		goal: input.goal,
		users: input.users,
		constraints: input.constraints,
		template: input.template,
	});

	const specEntry = await prisma.projectSpec.create({
		data: {
			goal: input.goal,
			users: input.users || "",
			constraints: input.constraints || null,
			template: input.template || "web",
			stories: {
				create: stories.map((story, index) => ({
					id: story.id,
					content: story.content,
					position: index,
				})),
			},
			tasks: {
				create: tasks.map((task, index) => ({
					id: task.id,
					content: task.content,
					group: task.group,
					completed: task.completed ?? false,
					position: index,
				})),
			},
		},
		include: orderedInclude,
	});

	return formatSpec(specEntry);
}

export async function getHistory(): Promise<SpecResponse[]> {
	const history = await prisma.projectSpec.findMany({
		orderBy: { createdAt: "desc" },
		take: 5,
		include: orderedInclude,
	});

	return history.map(formatSpec);
}

export async function updateSpec(
	specId: string,
	payload: UpdateSpecPayload,
): Promise<SpecResponse | null> {
	const updated = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		if (payload.tasks !== undefined) {
			await tx.task.deleteMany({ where: { specId } });
			if (payload.tasks.length > 0) {
				await tx.task.createMany({
					data: payload.tasks.map((task, index) => ({
						id: task.id,
						specId,
						content: task.content,
						group: task.group,
						completed: task.completed ?? false,
						position: index,
					})),
				});
			}
		}

		if (payload.stories !== undefined) {
			await tx.story.deleteMany({ where: { specId } });
			if (payload.stories.length > 0) {
				await tx.story.createMany({
					data: payload.stories.map((story, index) => ({
						id: story.id,
						specId,
						content: story.content,
						position: index,
					})),
				});
			}
		}

		return tx.projectSpec.findUnique({
			where: { id: specId },
			include: orderedInclude,
		});
	});

	if (!updated) {
		return null;
	}

	return formatSpec(updated);
}

export async function getHealthStatus(): Promise<HealthResponse> {
	const startedAt = Date.now();

	try {
		await prisma.$queryRaw`SELECT 1`;
		const responseTimeMs = Date.now() - startedAt;
		return {
			status: "ok",
			timestamp: new Date().toISOString(),
			backend: {
				status: "up",
				uptimeSeconds: Math.floor(process.uptime()),
			},
			database: {
				status: "up",
				responseTimeMs,
			},
		};
	} catch (error) {
		const responseTimeMs = Date.now() - startedAt;
		return {
			status: "degraded",
			timestamp: new Date().toISOString(),
			backend: {
				status: "up",
				uptimeSeconds: Math.floor(process.uptime()),
			},
			database: {
				status: "down",
				responseTimeMs,
				error: error instanceof Error ? error.message : "Unknown DB error",
			},
		};
	}
}
