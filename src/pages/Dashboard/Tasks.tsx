
import { useEffect, useMemo, useState } from "react";
import {
    Check,
    Pencil,
    Plus,
    Trash2,
    X,
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Eye,
    Search,
} from "lucide-react";
import api from "../../features/api";

type Task = {
    _id: string;
    title: string;
    description: string;
    status: "pending" | "completed";
    priority: "low" | "medium" | "high";
    dueDate?: string | null;
};

const emptyTaskForm = {
    title: "",
    description: "",
    status: "pending" as Task["status"],
    priority: "medium" as Task["priority"],
    dueDate: "",
};

const tasksPerPage = 10;

const priorityBadgeClass: Record<Task["priority"], string> = {
    low: "bg-neutral-100 text-neutral-700",
    medium: "bg-lime-200 text-black",
    high: "bg-black text-white",
};

const statusBadgeClass: Record<Task["status"], string> = {
    pending: "bg-orange-100 text-orange-700",
    completed: "bg-emerald-100 text-emerald-700",
};

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskTotal, setTaskTotal] = useState(0);
    const [totalTaskPages, setTotalTaskPages] = useState(1);

    const [taskForm, setTaskForm] = useState(emptyTaskForm);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [viewTask, setViewTask] = useState<Task | null>(null);
    const [taskModalOpen, setTaskModalOpen] = useState(false);

    const [taskPage, setTaskPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const completedCount = useMemo(
        () => tasks.filter((task) => task.status === "completed").length,
        [tasks]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const loadTasks = async (page = 1) => {
        try {
            setLoading(true);
            setError("");

            const tasksRes = await api.get("/tasks", {
                params: {
                    page,
                    limit: tasksPerPage,
                    status: statusFilter,
                    search: debouncedSearch,
                },
            });

            setTasks(tasksRes.data.data?.tasks || []);
            setTaskTotal(tasksRes.data.data?.pagination?.total || 0);
            setTaskPage(tasksRes.data.data?.pagination?.page || page);
            setTotalTaskPages(tasksRes.data.data?.pagination?.totalPages || 1);
        } catch (err: any) {
            setError(err.response?.data?.error || "Could not load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks(1);
    }, [statusFilter, debouncedSearch]);

    const resetTaskForm = () => {
        setTaskForm(emptyTaskForm);
        setEditingTaskId(null);
        setTaskModalOpen(false);
    };

    const openCreateTask = () => {
        setTaskForm(emptyTaskForm);
        setEditingTaskId(null);
        setTaskModalOpen(true);
    };

    const handleTaskSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const nextPage = editingTaskId ? taskPage : 1;

            if (editingTaskId) {
                await api.patch(`/tasks/${editingTaskId}`, taskForm);
                setMessage("Task updated successfully");
            } else {
                await api.post("/tasks", taskForm);
                setMessage("Task created successfully");
            }

            resetTaskForm();
            await loadTasks(nextPage);
        } catch (err: any) {
            setError(err.response?.data?.error || "Could not save task");
        } finally {
            setSaving(false);
        }
    };

    const startEditTask = (task: Task) => {
        setEditingTaskId(task._id);
        setTaskForm({
            title: task.title,
            description: task.description || "",
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
        });
        setTaskModalOpen(true);
    };

    const toggleTaskStatus = async (task: Task) => {
        try {
            await api.patch(`/tasks/${task._id}`, {
                status: task.status === "completed" ? "pending" : "completed",
            });
            await loadTasks(taskPage);
        } catch (err: any) {
            setError(err.response?.data?.error || "Could not update task");
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            await loadTasks(taskPage);
        } catch (err: any) {
            setError(err.response?.data?.error || "Could not delete task");
        }
    };

    return (
        <div className="min-h-[calc(100vh-40px)]">
            <header className="border-b border-black/10 bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="mt-1 text-3xl font-black tracking-tight text-black sm:text-4xl">
                            Task Manager
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-neutral-500">
                            Organize, update and track all your tasks from one clean place.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <div className="rounded-md border border-black/10 bg-neutral-50 p-2 text-center">
                            <p className="text-sm font-bold tracking-wider text-neutral-400">Total</p>
                            <p className="mt-1 text-xl font-black text-black">{taskTotal}</p>
                        </div>

                        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-center">
                            <p className="text-sm font-bold tracking-wider text-emerald-600">Done</p>
                            <p className="mt-1 text-xl font-black text-emerald-600">
                                {completedCount}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={openCreateTask}
                            className="col-span-2 flex h-12 items-center justify-center gap-3 rounded-md bg-black px-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-neutral-800"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            Add Task
                        </button>
                    </div>
                </div>
            </header>

            {(error || message) && (
                <div className="px-5 pt-5 sm:px-6">
                    {error && (
                        <p className="rounded-[4px] bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="rounded-[4px] bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                            {message}
                        </p>
                    )}
                </div>
            )}

            <div className="grid gap-3 bg-neutral-50 px-3 pt-3 sm:grid-cols-[1fr_220px]">
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by task ID, title or description..."
                        className="h-12 w-full rounded-md border border-black/10 bg-white pl-11 pr-4 text-sm font-medium outline-none focus:border-black"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value as "all" | "pending" | "completed")
                    }
                    className="h-12 rounded-md border border-black/10 bg-white px-4 text-sm font-bold capitalize outline-none focus:border-black"
                >
                    <option value="all">All Tasks</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <main className="flex-1 overflow-y-auto bg-neutral-50 p-3">
                {loading ? (
                    <div className="grid min-h-[300px] place-items-center rounded-[4px] border border-dashed border-black/10 bg-white">
                        <p className="font-semibold text-neutral-500">Loading tasks...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="grid min-h-[300px] place-items-center rounded-[4px] border border-dashed border-black/10 bg-white text-center">
                        <div>
                            <p className="text-xl font-black">No tasks found</p>
                            <p className="mt-2 text-sm text-neutral-500">
                                Try changing search or status filter.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tasks.map((task, index) => (
                            <div
                                key={task._id}
                                className="group rounded-[4px] border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                <div className="grid gap-4 lg:grid-cols-[70px_1fr_300px_130px] lg:items-center">
                                    <div className="grid h-12 w-12 place-items-center rounded-[4px] bg-black text-white">
                                        <span className="text-lg font-black">
                                            {String((taskPage - 1) * tasksPerPage + index + 1).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>
                                    </div>

                                    <div className="min-w-0">
                                        <h3
                                            className={`truncate text-lg font-black text-black ${task.status === "completed"
                                                ? "line-through decoration-2 opacity-60"
                                                : ""
                                                }`}
                                        >
                                            {task.title}
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-neutral-500">
                                            {task.description
                                                ? task.description.length > 150
                                                    ? `${task.description.slice(0, 150)}.....`
                                                    : task.description
                                                : "No description"}
                                        </p>
                                        <p className="mt-1 text-xs text-neutral-400">ID: {task._id}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusBadgeClass[task.status]}`}
                                        >
                                            {task.status}
                                        </span>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${priorityBadgeClass[task.priority]}`}
                                        >
                                            {task.priority}
                                        </span>

                                        {task.dueDate && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600">
                                                <CalendarDays size={13} />
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-3 lg:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setViewTask(task)}
                                            className="grid place-items-center rounded-full border border-black/10 bg-white p-2 transition hover:bg-lime-50 hover:text-lime-700"
                                        >
                                            <Eye size={17} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => toggleTaskStatus(task)}
                                            className="grid place-items-center rounded-full border border-black/10 bg-white p-2 transition hover:bg-emerald-50 hover:text-emerald-600"
                                        >
                                            <Check size={17} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => startEditTask(task)}
                                            className="grid place-items-center rounded-full border border-black/10 bg-white p-2 transition hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => deleteTask(task._id)}
                                            className="grid place-items-center rounded-full border border-black/10 bg-white p-2 text-red-600 transition hover:bg-red-50"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="border-t border-black/10 bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-bold text-neutral-500">
                            Page {taskPage} of {totalTaskPages}
                        </p>
                        <p className="text-xs text-neutral-400">
                            Showing {tasks.length} tasks on this page
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 rounded-full bg-black px-3 py-2">
                        <button
                            type="button"
                            onClick={() => loadTasks(Math.max(taskPage - 1, 1))}
                            disabled={taskPage === 1}
                            className="grid h-10 w-10 place-items-center rounded-full bg-neutral-800 text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ArrowLeft size={17} />
                        </button>

                        <div className="grid h-12 min-w-12 place-items-center rounded-full bg-lime-300 px-4 text-xl font-black text-black">
                            {taskPage}
                        </div>

                        <button
                            type="button"
                            onClick={() => loadTasks(Math.min(taskPage + 1, totalTaskPages))}
                            disabled={taskPage === totalTaskPages}
                            className="grid h-10 w-10 place-items-center rounded-full bg-neutral-800 text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ArrowRight size={17} />
                        </button>
                    </div>
                </div>
            </footer>

            {viewTask && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-md bg-white shadow-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between bg-black px-5 py-4">
                            <h3 className="text-xl font-black text-white sm:text-2xl">
                                Task Details
                            </h3>

                            <button
                                type="button"
                                onClick={() => setViewTask(null)}
                                className="grid h-11 w-11 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
                            >
                                <X size={20} className="text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-5">

                            {/* Title */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 sm:text-xs">
                                    Title
                                </p>

                                <h2 className="mt-2 break-words text-xl font-black text-black sm:text-3xl">
                                    {viewTask.title}
                                </h2>
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 sm:text-xs">
                                    Description
                                </p>

                                <div className="mt-2 min-h-[180px] rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-neutral-700 sm:text-[15px]">
                                        {viewTask.description || "No description added."}
                                    </p>
                                </div>
                            </div>

                            {/* Information */}
                            <div className="mt-6 grid grid-cols-2 gap-3">

                                {/* Status */}
                                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 sm:p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 sm:text-xs">
                                        Status
                                    </p>

                                    <p className="mt-2 text-lg font-black capitalize text-black sm:text-xl">
                                        {viewTask.status}
                                    </p>
                                </div>

                                {/* Priority */}
                                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 sm:p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 sm:text-xs">
                                        Priority
                                    </p>

                                    <p className="mt-2 text-lg font-black capitalize text-black sm:text-xl">
                                        {viewTask.priority}
                                    </p>
                                </div>

                                {/* Due Date */}
                                <div className="col-span-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 sm:p-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400 sm:text-xs">
                                        Due Date
                                    </p>

                                    <p className="mt-2 text-base font-black text-black sm:text-xl">
                                        {viewTask.dueDate
                                            ? new Date(viewTask.dueDate).toLocaleDateString()
                                            : "No due date"}
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <button
                                type="button"
                                onClick={() => setViewTask(null)}
                                className="mt-6 h-12 w-full rounded-md bg-black text-base font-semibold text-white transition hover:bg-neutral-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {taskModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6 backdrop-blur-sm">
                    <form
                        onSubmit={handleTaskSubmit}
                        className="w-full max-w-xl overflow-hidden rounded-[4px] bg-white shadow-lg"
                    >
                        <div className="flex items-center justify-between bg-lime-300 px-5 py-4">
                            <h3 className="text-xl font-black text-black">
                                {editingTaskId ? "Edit Task" : "Create Task"}
                            </h3>

                            <button
                                type="button"
                                onClick={resetTaskForm}
                                className="grid h-10 w-10 place-items-center rounded-full bg-black/30 text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4 p-5">
                            <input
                                value={taskForm.title}
                                onChange={(e) =>
                                    setTaskForm({ ...taskForm, title: e.target.value })
                                }
                                placeholder="Task title"
                                className="h-12 w-full rounded-[4px] border border-black/10 bg-neutral-50 px-4 outline-none focus:border-black"
                                required
                            />

                            <textarea
                                value={taskForm.description}
                                onChange={(e) =>
                                    setTaskForm({ ...taskForm, description: e.target.value })
                                }
                                placeholder="Task description"
                                rows={4}
                                className="w-full rounded-[4px] border border-black/10 bg-neutral-50 px-4 py-3 outline-none focus:border-black"
                            />

                            <div className="grid gap-3 sm:grid-cols-2">
                                <select
                                    value={taskForm.status}
                                    onChange={(e) =>
                                        setTaskForm({
                                            ...taskForm,
                                            status: e.target.value as Task["status"],
                                        })
                                    }
                                    className="h-12 rounded-[4px] border border-black/10 bg-neutral-50 px-4 outline-none focus:border-black"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>

                                <select
                                    value={taskForm.priority}
                                    onChange={(e) =>
                                        setTaskForm({
                                            ...taskForm,
                                            priority: e.target.value as Task["priority"],
                                        })
                                    }
                                    className="h-12 rounded-[4px] border border-black/10 bg-neutral-50 px-4 outline-none focus:border-black"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <input
                                type="date"
                                value={taskForm.dueDate}
                                onChange={(e) =>
                                    setTaskForm({ ...taskForm, dueDate: e.target.value })
                                }
                                className="h-12 w-full rounded-[4px] border border-black/10 bg-neutral-50 px-4 outline-none focus:border-black"
                            />

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={resetTaskForm}
                                    className="h-12 rounded-[4px] border border-black px-6 font-bold"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex h-12 items-center justify-center gap-2 rounded-[4px] bg-black px-6 font-bold text-white disabled:opacity-60"
                                >
                                    <Plus size={18} />
                                    {saving ? "Saving..." : editingTaskId ? "Update" : "Create"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Tasks;