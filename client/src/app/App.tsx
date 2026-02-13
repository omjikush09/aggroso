import { useEffect, useState } from "react";
import axios from "axios";
import { Copy, FileText, HeartPulse, Loader2, Settings } from "lucide-react";
import { toast, Toaster } from "sonner";

import FeatureForm from "@/features/spec-generator/ui/FeatureForm";
import HealthPage from "@/pages/health/ui/HealthPage";
import TaskList from "@/features/task-management/ui/TaskList";
import HistorySidebar from "@/widgets/history-sidebar/ui/HistorySidebar";
import { Button } from "@/shared/ui/button";
import type {
	CurrentSpec,
	GeneratePayload,
	SpecResponse,
	Story,
	Task,
} from "@/entities/spec/model/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const API_URL = `${API_BASE_URL.replace(/\/+$/, "")}/api`;

type ToastType = "success" | "error" | "info";
type PageView = "spec" | "health";

function App() {
	const [history, setHistory] = useState<SpecResponse[]>([]);
	const [currentSpec, setCurrentSpec] = useState<CurrentSpec | null>(null);
	const [loading, setLoading] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [pageView, setPageView] = useState<PageView>("spec");

	useEffect(() => {
		void fetchHistory();
	}, []);

	const showToast = (type: ToastType, message: string): void => {
		if (type === "success") {
			toast.success(message);
			return;
		}
		if (type === "error") {
			toast.error(message);
			return;
		}
		toast(message);
	};

	const fetchHistory = async (): Promise<void> => {
		try {
			const res = await axios.get<SpecResponse[]>(`${API_URL}/history`);
			setHistory(res.data);
		} catch (error) {
			console.error("Failed to fetch history", error);
		}
	};

	const handleGenerate = async (formData: GeneratePayload): Promise<void> => {
		setLoading(true);
		try {
			const res = await axios.post<SpecResponse>(`${API_URL}/generate`, formData);
			setCurrentSpec({ ...res.data.output, id: res.data.id });
			await fetchHistory();
		} catch (error) {
			console.error(error);
			showToast("error", "Failed to generate specs.");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateTasks = async (newTasks: Task[]): Promise<void> => {
		if (!currentSpec) return;

		const updatedSpec: CurrentSpec = { ...currentSpec, tasks: newTasks };
		setCurrentSpec(updatedSpec);

		if (updatedSpec.id) {
			try {
				await axios.put(`${API_URL}/spec/${updatedSpec.id}`, {
					tasks: newTasks,
				});
			} catch (error) {
				console.error("Failed to save updates", error);
				showToast("error", "Failed to save task updates.");
			}
		}
	};

	const exportToMarkdown = (): string => {
		if (!currentSpec) return "";
		let md = "# Project Specification\n\n";

		md += "## User Stories\n";
		currentSpec.stories.forEach((story: Story) => {
			md += `- ${story.content}\n`;
		});

		md += "\n## Engineering Tasks\n";
		const groups: Record<string, Task[]> = {};
		currentSpec.tasks.forEach((task: Task) => {
			const key = task.group || "ungrouped";
			groups[key] = groups[key] || [];
			groups[key].push(task);
		});

		Object.keys(groups).forEach((groupName) => {
			md += `### ${groupName.charAt(0).toUpperCase() + groupName.slice(1)}\n`;
			groups[groupName].forEach((task: Task) => {
				md += `- [ ] ${task.content}\n`;
			});
		});

		return md;
	};

	const copyToClipboard = async (): Promise<void> => {
		try {
			const text = exportToMarkdown();
			await navigator.clipboard.writeText(text);
			showToast("success", "Copied to clipboard.");
		} catch (error) {
			console.error("Failed to copy markdown", error);
			showToast("error", "Unable to copy to clipboard.");
		}
	};

	const loadFromHistory = (item: SpecResponse): void => {
		setCurrentSpec({ ...item.output, id: item.id });
	};

	return (
		<div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-purple-500 selection:text-white flex">
			<HistorySidebar
				history={history}
				onSelect={loadFromHistory}
				isOpen={isSidebarOpen}
				toggle={() => setIsSidebarOpen(!isSidebarOpen)}
			/>

			<main className="flex-1 p-8 overflow-y-auto h-screen relative">
				<div className="max-w-5xl mx-auto space-y-8">
					<header className="flex justify-between items-center mb-8">
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
								SpecGen
							</h1>
							<p className="text-gray-400 mt-2">
								Transform ideas into actionable engineering tasks
							</p>
						</div>

						<div className="flex gap-4">
							<Button
								variant={pageView === "health" ? "default" : "secondary"}
								onClick={() =>
									setPageView((prev) => (prev === "health" ? "spec" : "health"))
								}
							>
								<HeartPulse size={18} />
								{pageView === "health" ? "Back to Spec" : "Health"}
							</Button>
							{currentSpec && (
								<Button onClick={() => void copyToClipboard()} variant="secondary">
									<Copy size={18} />
									Export
								</Button>
							)}
						</div>
					</header>

					{pageView === "health" ? (
						<HealthPage apiUrl={API_URL} />
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
						<div className="lg:col-span-4 space-y-6">
							<div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
								<h2 className="text-xl font-semibold mb-4 text-purple-300 flex items-center gap-2">
									<Settings size={20} /> Configuration
								</h2>
								<FeatureForm onSubmit={handleGenerate} loading={loading} />
							</div>
						</div>

						<div className="lg:col-span-8 flex flex-col gap-6">
							{loading ? (
								<div className="h-64 flex items-center justify-center bg-gray-900/50 rounded-xl border border-dashed border-gray-800">
									<div className="flex flex-col items-center gap-4 text-purple-400">
										<Loader2 className="animate-spin w-8 h-8" />
										<span>Generating Specifications...</span>
									</div>
								</div>
							) : currentSpec ? (
								<div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
									<h2 className="text-xl font-semibold mb-4 text-green-400 flex items-center gap-2">
										<FileText size={20} /> User Stories & Tasks
									</h2>

									<TaskList
										tasks={currentSpec.tasks}
										onUpdate={handleUpdateTasks}
										onToast={showToast}
									/>

									<div className="mt-8 pt-6 border-t border-gray-800">
										<h3 className="text-lg font-medium mb-3 text-gray-300">
											User Stories
										</h3>
										<ul className="space-y-2">
											{currentSpec.stories.map((story: Story, idx: number) => (
												<li
													key={`${story.id}-${idx}`}
													className="p-3 bg-gray-800/50 rounded border border-gray-700/50 text-gray-300"
												>
													{story.content}
												</li>
											))}
										</ul>
									</div>

								</div>
							) : (
								<div className="h-64 flex items-center justify-center bg-gray-900/30 rounded-xl border border-dashed border-gray-800 text-gray-500">
									Select a template or fill the form to start generating.
								</div>
							)}
						</div>
						</div>
					)}
				</div>
			</main>
			<Toaster richColors theme="dark" position="bottom-right" />
		</div>
	);
}

export default App;
