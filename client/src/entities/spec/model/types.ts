export interface Story {
	id: string;
	content: string;
}

export interface Task {
	id: string;
	content: string;
	group: string;
	completed?: boolean;
}

export interface SpecOutput {
	stories: Story[];
	tasks: Task[];
}

export interface SpecResponse {
	id: string;
	createdAt: string;
	input: {
		goal: string;
		users: string;
		constraints: string | null;
		template: string;
	};
	output: SpecOutput;
}

export interface CurrentSpec extends SpecOutput {
	id: string;
}

export interface GeneratePayload {
	goal: string;
	users?: string;
	constraints?: string;
	template?: string;
}
