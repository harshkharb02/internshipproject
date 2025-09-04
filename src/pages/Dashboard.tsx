import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  LogOut,
  User,
  CheckCircle,
} from "lucide-react";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { useToast } from "@/hooks/use-toast";
import {
  fetchTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "@/utils/api"; // ✅ added updateTask

export interface Task {
  _id: string; // from MongoDB
  title: string;
  description: string;
  status: "pending" | "working" | "done";
  createdAt: string;
  deadline?: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<{ username: string; email: string } | null>(
    null
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "working" | "done">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // ✅ Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));

    // ✅ Fetch tasks from backend
    fetchTasks().then((data) => {
      if (data.message) {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      } else {
        setTasks(data);
      }
    });
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast({ title: "Logged out", description: "See you next time!" });
    navigate("/login");
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter !== "all" && task.status !== filter) return false;
      if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // ✅ Create new task
  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    status?: string;
    deadline?: string;
  }) => {
    const newTask = await createTask(taskData.title, taskData.description);
    if (newTask.message) {
      toast({
        title: "Error",
        description: newTask.message,
        variant: "destructive",
      });
      return;
    }
    setTasks((prev) => [newTask, ...prev]);
    setIsTaskFormOpen(false);
    toast({
      title: "Task created!",
      description: "Your new task has been added successfully.",
    });
  };

  // ✅ Edit task (permanent changes)
  const handleEditTask = async (taskData: {
    title: string;
    description: string;
    status?: string;
    deadline?: string;
  }) => {
    if (!editingTask) return;

    const updated = await updateTask(editingTask._id, taskData);

    if (updated.message) {
      toast({
        title: "Error",
        description: updated.message,
        variant: "destructive",
      });
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t._id === editingTask._id ? updated : t))
    );

    setEditingTask(null);
    toast({
      title: "Task updated!",
      description: "Your task has been updated permanently.",
    });
  };

  // ✅ Delete task
  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
    });
  };

  // ✅ Toggle status
  const handleToggleStatus = async (taskId: string) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    const newStatus =
      task.status === "pending"
        ? "working"
        : task.status === "working"
        ? "done"
        : "pending";

    const updated = await updateTaskStatus(taskId, newStatus);
    if (updated.message) {
      toast({
        title: "Error",
        description: updated.message,
        variant: "destructive",
      });
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    toast({
      title:
        newStatus === "done"
          ? "Task completed!"
          : newStatus === "working"
          ? "Task in progress"
          : "Task reopened",
      description:
        newStatus === "done"
          ? "Great job on finishing this task!"
          : newStatus === "working"
          ? "Keep going!"
          : "Moved back to pending.",
    });
  };

  const taskStats = {
    total: tasks.length,
    done: tasks.filter((task) => task.status === "done").length,
    pending: tasks.filter((task) => task.status === "pending").length,
    working: tasks.filter((task) => task.status === "working").length,
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-glow">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                TaskMate
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.username}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* <Button variant="outline" size="sm" className="hidden sm:flex">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button> */}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-4 rounded-xl shadow-task border">
            <p className="text-2xl font-bold">{taskStats.total}</p>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </div>
          <div className="bg-card p-4 rounded-xl shadow-task border">
            <p className="text-2xl font-bold">{taskStats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="bg-card p-4 rounded-xl shadow-task border">
            <p className="text-2xl font-bold">{taskStats.working}</p>
            <p className="text-sm text-muted-foreground">Working</p>
          </div>
          <div className="bg-card p-4 rounded-xl shadow-task border">
            <p className="text-2xl font-bold">{taskStats.done}</p>
            <p className="text-sm text-muted-foreground">Done</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            {["all", "pending", "working", "done"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status as any)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
            <Button
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              onClick={() => setIsTaskFormOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Tasks */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => setEditingTask(task)}
              onDelete={() => handleDeleteTask(task._id)}
              onToggleStatus={() => handleToggleStatus(task._id)}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first task to get started"}
            </p>
            {!searchQuery && (
              <Button
                className="bg-gradient-primary hover:shadow-glow"
                onClick={() => setIsTaskFormOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Task
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Task Form */}
      {isTaskFormOpen && (
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          onSubmit={handleCreateTask}
        />
      )}
      {editingTask && (
        <TaskForm
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleEditTask}
          initialTask={editingTask}
          mode="edit"
        />
      )}
    </div>
  );
};

export default Dashboard;
