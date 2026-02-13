import { useState, type ChangeEvent, type FormEvent } from "react";
import { Send } from "lucide-react";
import type { GeneratePayload } from "@/entities/spec/model/types";

interface FeatureFormProps {
	onSubmit: (payload: GeneratePayload) => void;
	loading: boolean;
}

export default function FeatureForm({ onSubmit, loading }: FeatureFormProps) {
	const [formData, setFormData] = useState<GeneratePayload>({
		goal: "",
		users: "",
		constraints: "",
		template: "web",
	});

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
	): void => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-400 mb-1">
					App Template
				</label>
				<select
					name="template"
					value={formData.template}
					onChange={handleChange}
					className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
				>
					<option value="web">Web Application</option>
					<option value="mobile">Mobile App (iOS/Android)</option>
					<option value="tool">Internal Tool / Dashboard</option>
				</select>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-400 mb-1">
					Goal / Core Feature
				</label>
				<textarea
					name="goal"
					value={formData.goal}
					onChange={handleChange}
					required
					placeholder="e.g. Build a kanban board for project management..."
					rows={3}
					className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none placeholder-gray-600"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-400 mb-1">
					Target Users
				</label>
				<input
					type="text"
					name="users"
					value={formData.users}
					onChange={handleChange}
					placeholder="e.g. Remote teams, Freelancers"
					className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-600"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-400 mb-1">
					Constraints
				</label>
				<textarea
					name="constraints"
					value={formData.constraints}
					onChange={handleChange}
					placeholder="e.g. Mobile-first, No SQL, strict deadline..."
					rows={2}
					className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none placeholder-gray-600"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? (
					<span className="animate-pulse">Parsing Idea...</span>
				) : (
					<>
						<span>Generate Tasks</span>
						<Send size={18} />
					</>
				)}
			</button>
		</form>
	);
}
