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
