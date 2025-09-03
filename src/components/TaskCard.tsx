import {
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/pages/Dashboard";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskCardProps) => {
  const deadlineDate = task.deadline ? new Date(task.deadline) : null;
  const isOverdue =
    task.deadline &&
    task.status === "pending" &&
    new Date(task.deadline) < new Date();

  const getStatusColor = () => {
    if (task.status === "done") return "success";
    if (task.status === "working") return "warning";
    if (isOverdue) return "destructive";
    return "secondary";
  };

  const getStatusIcon = () => {
    if (task.status === "done") return <CheckCircle className="h-4 w-4" />;
    if (task.status === "working") return <Loader className="h-4 w-4" />;
    if (isOverdue) return <AlertTriangle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (task.status === "done") return "Done";
    if (task.status === "working") return "Working";
    if (isOverdue) return "Overdue";
    return "Pending";
  };

  return (
    <Card
      className={`shadow-task border transition-all duration-300 hover:shadow-glow ${
        isOverdue ? "border-destructive/20" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-tight flex-1">{task.title}</h3>
          <Badge
            variant={getStatusColor() as any}
            className="shrink-0 flex items-center gap-1"
          >
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {task.description}
        </p>

        {task.deadline && (
          <div className="flex items-center gap-2 mt-4 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span
              className={
                isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
              }
            >
              Due: {deadlineDate?.toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleStatus}
          className="flex-1"
        >
          {task.status === "done"
            ? "Mark Pending"
            : task.status === "working"
            ? "Mark Done"
            : "Start Working"}
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
