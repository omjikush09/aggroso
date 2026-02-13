import { useEffect, useState } from "react";
import axios from "axios";
import { Activity, Database, RefreshCcw, Server } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { HealthResponse } from "@/entities/health/model/types";

interface HealthPageProps {
	apiUrl: string;
}

export default function HealthPage({ apiUrl }: HealthPageProps) {
	const [health, setHealth] = useState<HealthResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchHealth = async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			const res = await axios.get<HealthResponse>(`${apiUrl}/health`);
			setHealth(res.data);
		} catch (err) {
			if (axios.isAxiosError(err) && err.response?.data) {
				const payload = err.response.data as Partial<HealthResponse> & {
					error?: string;
				};
				if (payload.status && payload.backend && payload.database) {
					setHealth(payload as HealthResponse);
					setError(payload.error || "Service is degraded.");
				} else {
					setError(payload.error || "Failed to fetch health status.");
				}
			} else {
				setError("Failed to fetch health status.");
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void fetchHealth();
	}, []);

	return (
		<div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-xl font-semibold text-cyan-300 flex items-center gap-2">
						<Activity size={20} /> System Health
					</h2>
					<p className="text-sm text-gray-400 mt-1">
						Live status for backend and database connectivity.
					</p>
				</div>
				<Button
					variant="secondary"
					onClick={() => void fetchHealth()}
					disabled={loading}
				>
					<RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
					Refresh
				</Button>
			</div>

			{error && (
				<div className="mb-4 rounded-lg border border-red-900/60 bg-red-900/20 p-3 text-sm text-red-200">
					{error}
				</div>
			)}

			{!health ? (
				<div className="text-gray-400 text-sm">Loading health status...</div>
			) : (
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
							<div className="text-xs uppercase tracking-wide text-gray-400 mb-2">
								Overall
							</div>
							<div
								className={`text-sm font-semibold ${
									health.status === "ok" ? "text-emerald-300" : "text-yellow-300"
								}`}
							>
								{health.status.toUpperCase()}
							</div>
						</div>

						<div className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
							<div className="text-xs uppercase tracking-wide text-gray-400 mb-2 flex items-center gap-1">
								<Server size={14} /> Backend
							</div>
							<div className="text-sm font-semibold text-emerald-300">
								{health.backend.status.toUpperCase()}
							</div>
							<div className="text-xs text-gray-400 mt-1">
								Uptime: {health.backend.uptimeSeconds}s
							</div>
						</div>

						<div className="rounded-lg border border-gray-700 bg-gray-800/60 p-4">
							<div className="text-xs uppercase tracking-wide text-gray-400 mb-2 flex items-center gap-1">
								<Database size={14} /> Database
							</div>
							<div
								className={`text-sm font-semibold ${
									health.database.status === "up"
										? "text-emerald-300"
										: "text-red-300"
								}`}
							>
								{health.database.status.toUpperCase()}
							</div>
							<div className="text-xs text-gray-400 mt-1">
								Response: {health.database.responseTimeMs}ms
							</div>
						</div>
					</div>

					{health.database.error && (
						<div className="rounded-lg border border-red-900/60 bg-red-900/20 p-3 text-sm text-red-200">
							DB error: {health.database.error}
						</div>
					)}

					<div className="text-xs text-gray-500">
						Last checked: {new Date(health.timestamp).toLocaleString()}
					</div>
				</div>
			)}
		</div>
	);
}
