import { useMemo, useState, type CSSProperties } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	Check,
	Edit2,
	FolderTree,
	GripVertical,
	Layers,
	Merge,
	Plus,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";
import type { Task } from "@/entities/spec/model/types";

type ToastType = "success" | "error" | "info";

interface TaskRowProps {
	id: string;
	task: Task;
	onUpdate: (id: string, task: Task) => void;
	isSelected: boolean;
	onSelect: (id: string, selected: boolean) => void;
}

interface StaticTaskRowProps {
	task: Task;
	onUpdate: (id: string, task: Task) => void;
	isSelected: boolean;
	onSelect: (id: string, selected: boolean) => void;
}

interface TaskListProps {
	tasks: Task[];
	onUpdate: (tasks: Task[]) => void;
	onToast?: (type: ToastType, message: string) => void;
}

function SortableTaskRow({
	id,
	task,
	onUpdate,
	isSelected,
	onSelect,
}: TaskRowProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id });

	const style: CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 50 : "auto",
		position: "relative",
	};

	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(task.content);

	const handleSave = (): void => {
		const value = editedContent.trim();
		if (!value) {
			setEditedContent(task.content);
			setIsEditing(false);
			return;
		}
		onUpdate(task.id, { ...task, content: value });
		setIsEditing(false);
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={twMerge(
				"group flex items-center gap-3 p-3 bg-gray-800 rounded-lg border mb-2 transition-colors hover:border-purple-500/30",
				isSelected ? "border-purple-500 bg-purple-900/20" : "border-gray-700/50",
				isDragging &&
					"opacity-50 border-purple-500 shadow-lg ring-2 ring-purple-500/20",
			)}
		>
			<div className="p-1">
				<input
					type="checkbox"
					checked={isSelected}
					onChange={(e) => onSelect(task.id, e.target.checked)}
					className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
				/>
			</div>

			<div
				{...attributes}
				{...listeners}
				className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 p-1"
			>
				<GripVertical size={18} />
			</div>

			<div className="flex-1">
				{isEditing ? (
					<input
						autoFocus
						type="text"
						value={editedContent}
						onChange={(e) => setEditedContent(e.target.value)}
						onBlur={handleSave}
						onKeyDown={(e) => e.key === "Enter" && handleSave()}
						className="w-full bg-gray-900 text-white p-1 rounded border border-purple-500 outline-none"
					/>
				) : (
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
						<span
							className={clsx(
								"text-gray-200 text-sm font-medium",
								task.completed && "line-through text-gray-500",
							)}
						>
							{task.content}
						</span>
						<span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 capitalize w-fit">
							{task.group || "ungrouped"}
						</span>
					</div>
				)}
			</div>

			<button
				onClick={() => setIsEditing(!isEditing)}
				className="text-gray-500 hover:text-purple-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
			>
				{isEditing ? <Check size={16} /> : <Edit2 size={16} />}
			</button>
		</div>
	);
}

function StaticTaskRow({ task, onUpdate, isSelected, onSelect }: StaticTaskRowProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(task.content);

	const handleSave = (): void => {
		const value = editedContent.trim();
		if (!value) {
			setEditedContent(task.content);
			setIsEditing(false);
			return;
		}
		onUpdate(task.id, { ...task, content: value });
		setIsEditing(false);
	};

	return (
		<div
			className={twMerge(
				"group flex items-center gap-3 p-3 bg-gray-800 rounded-lg border mb-2 transition-colors hover:border-purple-500/30",
				isSelected ? "border-purple-500 bg-purple-900/20" : "border-gray-700/50",
			)}
		>
			<div className="p-1">
				<input
					type="checkbox"
					checked={isSelected}
					onChange={(e) => onSelect(task.id, e.target.checked)}
					className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
				/>
			</div>
			<div className="p-1 text-gray-600">
				<GripVertical size={18} />
			</div>
			<div className="flex-1">
				{isEditing ? (
					<input
						autoFocus
						type="text"
						value={editedContent}
						onChange={(e) => setEditedContent(e.target.value)}
						onBlur={handleSave}
						onKeyDown={(e) => e.key === "Enter" && handleSave()}
						className="w-full bg-gray-900 text-white p-1 rounded border border-purple-500 outline-none"
					/>
				) : (
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
						<span
							className={clsx(
								"text-gray-200 text-sm font-medium",
								task.completed && "line-through text-gray-500",
							)}
						>
							{task.content}
						</span>
						<span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 capitalize w-fit">
							{task.group || "ungrouped"}
						</span>
					</div>
				)}
			</div>
			<button
				onClick={() => setIsEditing(!isEditing)}
				className="text-gray-500 hover:text-purple-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
			>
				{isEditing ? <Check size={16} /> : <Edit2 size={16} />}
			</button>
		</div>
	);
}

export default function TaskList({ tasks, onUpdate, onToast }: TaskListProps) {
	const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
	const [viewMode, setViewMode] = useState<"flat" | "grouped">("flat");
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [groupDialogOpen, setGroupDialogOpen] = useState(false);
	const [combineDialogOpen, setCombineDialogOpen] = useState(false);
	const [newTaskContent, setNewTaskContent] = useState("");
	const [newTaskGroup, setNewTaskGroup] = useState("planning");
	const [groupName, setGroupName] = useState("planning");
	const [combinedContent, setCombinedContent] = useState("");

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const groupedTasks = useMemo<Record<string, Task[]>>(
		() =>
			tasks.reduce<Record<string, Task[]>>((acc, task) => {
				const key = (task.group || "ungrouped").trim() || "ungrouped";
				acc[key] = acc[key] || [];
				acc[key].push(task);
				return acc;
			}, {}),
		[tasks],
	);

	const groupOrder = useMemo(
		() => Object.keys(groupedTasks).sort((a, b) => a.localeCompare(b)),
		[groupedTasks],
	);

	const selectedTaskData = useMemo(
		() => tasks.filter((task) => selectedTasks.includes(task.id)),
		[tasks, selectedTasks],
	);

	const handleDragEnd = (event: DragEndEvent): void => {
		const { active, over } = event;
		if (!over) return;

		if (active.id !== over.id) {
			const oldIndex = tasks.findIndex((task) => task.id === active.id);
			const newIndex = tasks.findIndex((task) => task.id === over.id);
			onUpdate(arrayMove(tasks, oldIndex, newIndex));
		}
	};

	const handleTaskUpdate = (id: string, updatedTask: Task): void => {
		onUpdate(tasks.map((task) => (task.id === id ? updatedTask : task)));
	};

	const toggleSelect = (id: string, isSelected: boolean): void => {
		if (isSelected) {
			setSelectedTasks((prev) => [...prev, id]);
			return;
		}
		setSelectedTasks((prev) => prev.filter((taskId) => taskId !== id));
	};

	const openGroupDialog = (): void => {
		if (selectedTasks.length === 0) return;
		setGroupName(selectedTaskData[0]?.group || "planning");
		setGroupDialogOpen(true);
	};

	const applyGroup = (): void => {
		const nextGroup = groupName.trim() || "ungrouped";
		const updated = tasks.map((task) =>
			selectedTasks.includes(task.id) ? { ...task, group: nextGroup } : task,
		);
		onUpdate(updated);
		setSelectedTasks([]);
		setGroupDialogOpen(false);
		onToast?.("success", `Assigned ${nextGroup} to selected tasks.`);
	};

	const openCombineDialog = (): void => {
		if (selectedTaskData.length < 2) return;
		setCombinedContent(selectedTaskData.map((task) => task.content).join(" + "));
		setCombineDialogOpen(true);
	};

	const applyCombine = (): void => {
		const value = combinedContent.trim();
		if (!value || selectedTaskData.length < 2) return;

		const firstTask = selectedTaskData[0];
		const combinedTask: Task = {
			...firstTask,
			id: `task-${Date.now()}`,
			content: value,
			group: firstTask.group,
		};

		const nextTasks: Task[] = [];
		let inserted = false;
		tasks.forEach((task) => {
			if (selectedTasks.includes(task.id)) {
				if (!inserted) {
					nextTasks.push(combinedTask);
					inserted = true;
				}
				return;
			}
			nextTasks.push(task);
		});

		onUpdate(nextTasks);
		setSelectedTasks([]);
		setCombineDialogOpen(false);
		onToast?.("success", "Tasks combined.");
	};

	const applyAddTask = (): void => {
		const content = newTaskContent.trim();
		if (!content) return;

		const group = newTaskGroup.trim() || "ungrouped";
		const nextTasks: Task[] = [
			...tasks,
			{
				id: `task-${Date.now()}`,
				content,
				group,
				completed: false,
			},
		];

		onUpdate(nextTasks);
		setNewTaskContent("");
		setNewTaskGroup("planning");
		setAddDialogOpen(false);
		onToast?.("success", "Task added.");
	};

	return (
		<div>
			<div className="mb-4 flex items-center justify-between gap-2">
				<Button size="sm" onClick={() => setAddDialogOpen(true)}>
					<Plus size={16} /> Add Task
				</Button>
				<div className="inline-flex rounded-lg border border-gray-700 overflow-hidden">
					<Button
						size="sm"
						variant={viewMode === "flat" ? "default" : "secondary"}
						className="rounded-none border-0"
						onClick={() => setViewMode("flat")}
					>
						<Layers size={15} /> Flat
					</Button>
					<Button
						size="sm"
						variant={viewMode === "grouped" ? "default" : "secondary"}
						className="rounded-none border-0 border-l border-gray-700"
						onClick={() => setViewMode("grouped")}
					>
						<FolderTree size={15} /> Grouped
					</Button>
				</div>
			</div>

			{selectedTasks.length > 0 && (
				<div className="mb-4 p-2 bg-purple-900/30 border border-purple-500/50 rounded flex justify-between items-center gap-2">
					<span className="text-sm text-purple-200">
						{selectedTasks.length} tasks selected
					</span>
					<div className="flex items-center gap-2">
						<Button size="sm" variant="secondary" onClick={openGroupDialog}>
							Group Selected
						</Button>
						{selectedTasks.length > 1 && (
							<Button size="sm" onClick={openCombineDialog}>
								<Merge size={16} /> Combine
							</Button>
						)}
					</div>
				</div>
			)}

			{viewMode === "flat" ? (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={tasks.map((task) => task.id)}
						strategy={verticalListSortingStrategy}
					>
						<div className="space-y-2">
							{tasks.map((task) => (
								<SortableTaskRow
									key={task.id}
									id={task.id}
									task={task}
									onUpdate={handleTaskUpdate}
									isSelected={selectedTasks.includes(task.id)}
									onSelect={toggleSelect}
								/>
							))}
						</div>
					</SortableContext>
				</DndContext>
			) : (
				<div className="space-y-4">
					{groupOrder.map((groupName) => (
						<div
							key={groupName}
							className="rounded-lg border border-gray-700/60 bg-gray-900/50 p-3"
						>
							<div className="mb-2 flex items-center justify-between">
								<h3 className="text-sm font-semibold text-indigo-300 capitalize">
									{groupName}
								</h3>
								<span className="text-xs text-gray-400">
									{groupedTasks[groupName].length} tasks
								</span>
							</div>
							<div>
								{groupedTasks[groupName].map((task) => (
									<StaticTaskRow
										key={task.id}
										task={task}
										onUpdate={handleTaskUpdate}
										isSelected={selectedTasks.includes(task.id)}
										onSelect={toggleSelect}
									/>
								))}
							</div>
						</div>
					))}
					<div className="text-xs text-gray-500">
						Switch to Flat view to reorder tasks with drag and drop.
					</div>
				</div>
			)}

			<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Task</DialogTitle>
						<DialogDescription>
							Create a new task and assign a group.
						</DialogDescription>
					</DialogHeader>
					<div className="mt-4 space-y-3">
						<Input
							placeholder="Task description"
							value={newTaskContent}
							onChange={(e) => setNewTaskContent(e.target.value)}
						/>
						<Input
							placeholder="Group (e.g. backend, frontend)"
							value={newTaskGroup}
							onChange={(e) => setNewTaskGroup(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button variant="secondary" onClick={() => setAddDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={applyAddTask} disabled={!newTaskContent.trim()}>
							Add
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Group Selected Tasks</DialogTitle>
						<DialogDescription>
							Assign one group to all selected tasks.
						</DialogDescription>
					</DialogHeader>
					<div className="mt-4">
						<Input
							placeholder="Group name"
							value={groupName}
							onChange={(e) => setGroupName(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button variant="secondary" onClick={() => setGroupDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={applyGroup}>Apply</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={combineDialogOpen} onOpenChange={setCombineDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Combine Tasks</DialogTitle>
						<DialogDescription>
							Merge selected tasks into one task with a custom description.
						</DialogDescription>
					</DialogHeader>
					<div className="mt-4">
						<Input
							placeholder="Combined task description"
							value={combinedContent}
							onChange={(e) => setCombinedContent(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button variant="secondary" onClick={() => setCombineDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={applyCombine} disabled={!combinedContent.trim()}>
							Combine
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
