import { z } from "zod";

const optionalTrimmedString = z
	.string()
	.trim()
	.optional()
	.transform((value) => (value && value.length > 0 ? value : undefined));

export const storySchema = z.object({
	id: z.string().trim().min(1),
	content: z.string().trim().min(1),
});

export const taskSchema = z.object({
	id: z.string().trim().min(1),
	content: z.string().trim().min(1),
	group: z.string().trim().min(1),
	completed: z.boolean().optional(),
});

export const generateSpecBodySchema = z.object({
	goal: z.string().trim().min(1, "Goal is required"),
	users: optionalTrimmedString,
	constraints: optionalTrimmedString,
	template: z.enum(["web", "mobile", "tool"]).optional(),
});

export const updateSpecParamsSchema = z.object({
	id: z.string().trim().min(1, "Spec id is required"),
});

export const updateSpecBodySchema = z
	.object({
		tasks: z.array(taskSchema).optional(),
		stories: z.array(storySchema).optional(),
	})
	.superRefine((value, ctx) => {
		if (value.tasks === undefined && value.stories === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "At least one of tasks or stories must be provided",
			});
		}
	});

export type StoryInput = z.infer<typeof storySchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type GenerateSpecBody = z.infer<typeof generateSpecBodySchema>;
export type UpdateSpecParams = z.infer<typeof updateSpecParamsSchema>;
export type UpdateSpecBody = z.infer<typeof updateSpecBodySchema>;
