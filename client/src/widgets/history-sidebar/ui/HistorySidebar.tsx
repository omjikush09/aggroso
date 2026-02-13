import { ChevronRight, Clock, X } from "lucide-react";
import type { SpecResponse } from "@/entities/spec/model/types";

interface HistorySidebarProps {
	history: SpecResponse[];
	onSelect: (item: SpecResponse) => void;
	isOpen: boolean;
	toggle: () => void;
}

export default function HistorySidebar({
	history,
	onSelect,
	isOpen,
	toggle,
}: HistorySidebarProps) {
	if (!isOpen) {
		return (
			<div className="fixed top-4 left-4 z-50">
				<button
					onClick={toggle}
					className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 hover:text-white"
				>
					<Clock size={24} />
				</button>
			</div>
		);
	}

	return (
		<aside className="w-80 h-screen bg-gray-900 border-r border-gray-800 flex flex-col fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out md:block shadow-2xl">
			<div className="p-4 border-b border-gray-800 flex justify-between items-center">
				<h2 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
					<Clock size={18} className="text-purple-500" />
					Recent Specs
				</h2>
				<button onClick={toggle} className="lg:hidden text-gray-500 hover:text-white">
					<X size={20} />
				</button>
			</div>

			<div className="flex-1 overflow-y-auto p-4 space-y-3">
				{history.length === 0 ? (
					<div className="text-center text-gray-600 py-8 text-sm">
						No history yet. Start creating!
					</div>
				) : (
					history.map((item) => (
						<button
							key={item.id}
							onClick={() => onSelect(item)}
							className="w-full text-left p-3 rounded-lg hover:bg-gray-800 border border-transparent hover:border-gray-700 transition-all group relative overflow-hidden"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="relative z-10">
								<h3 className="font-medium text-gray-300 group-hover:text-purple-300 truncate mb-1">
									{item.input.goal}
								</h3>
								<div className="flex justify-between items-center text-xs text-gray-500">
									<span>{new Date(item.createdAt).toLocaleDateString()}</span>
									<span className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">
										{item.input.template}
									</span>
								</div>
							</div>
							<ChevronRight
								size={16}
								className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1"
							/>
						</button>
					))
				)}
			</div>

			<div className="p-4 border-t border-gray-800 text-xs text-center text-gray-600">
				Aggroso Spec Gen v1.0
			</div>
		</aside>
	);
}
