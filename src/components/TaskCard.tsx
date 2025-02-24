
import { format } from "date-fns";
import { 
  X, 
  Tag, 
  List, 
  Repeat, 
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getAriaLabel } from "@/utils/accessibility";
import { memo } from "react";
import { useTasks } from "@/hooks/use-tasks";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    due_date: string | null;
    category: string;
    completed_at: string | null;
    priority: "high" | "medium" | "low";
    tags?: { id: string; label: string }[];
    subtasks?: { id: string; title: string; completed: boolean }[];
    recurrencePattern?: { frequency: string; interval: number };
  };
  onEdit: () => void;
}

export const priorityColors = {
  high: "#F97316", // Bright Orange
  medium: "#FFB800", // Golden Yellow
  low: "#0EA5E9" // Ocean Blue
} as const;

const TaskCardComponent = ({ task, onEdit }: TaskCardProps) => {
  const { deleteTask, toggleTaskCompletion } = useTasks();
  
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const visibleTags = task.tags?.slice(0, 3) || [];
  const remainingTags = (task.tags?.length || 0) - visibleTags.length;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask.mutate(task.id);
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskCompletion.mutate({
      id: task.id,
      completed: !task.completed_at
    });
  };

  return (
    <div 
      className="bg-white rounded-xl p-4 shadow-glass hover:shadow-lg transition-shadow cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
      onClick={onEdit}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onEdit();
        }
      }}
      aria-label={`${task.title} - ${getAriaLabel(task.priority)}`}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={!!task.completed_at}
          className="mt-1"
          onClick={handleToggleComplete}
          aria-label={`Mark ${task.title} as ${task.completed_at ? 'incomplete' : 'complete'}`}
          disabled={toggleTaskCompletion.isPending}
        />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <Star 
                className="h-4 w-4 transition-colors" 
                style={{ 
                  color: priorityColors[task.priority],
                  fill: priorityColors[task.priority],
                  opacity: task.priority === "low" ? 0.7 : 1
                }}
                aria-hidden="true"
              />
              <h4 className={`font-medium ${task.completed_at ? 'line-through text-neutral-400' : ''}`}>
                {task.title}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {task.recurrencePattern && (
                <Repeat 
                  className="h-4 w-4 text-neutral-400" 
                  aria-label="Recurring task"
                />
              )}
              <span className="text-sm text-neutral-500">
                {task.due_date ? format(new Date(task.due_date), 'MMM dd') : ''}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleDelete}
                aria-label="Delete task"
                disabled={deleteTask.isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className={`text-sm text-neutral-500 mb-3 ${task.completed_at ? 'line-through' : ''}`}>
            {task.description}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-1 text-xs rounded-md bg-neutral-100">
              {task.category}
            </span>
            
            {visibleTags.length > 0 && (
              <div className="flex items-center gap-2" aria-label={`Tags: ${task.tags?.map(t => t.label).join(', ')}`}>
                <Tag className="h-3 w-3 text-neutral-400" aria-hidden="true" />
                <div className="flex items-center gap-1">
                  {visibleTags.map((tag, index) => (
                    <span 
                      key={tag.id}
                      className="text-xs text-neutral-600"
                    >
                      {tag.label}
                      {index < visibleTags.length - 1 && ", "}
                    </span>
                  ))}
                  {remainingTags > 0 && (
                    <span className="text-xs text-neutral-400 ml-1">
                      +{remainingTags} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {task.subtasks && task.subtasks.length > 0 && (
              <div 
                className="flex items-center gap-1 text-xs text-neutral-600"
                aria-label={`${completedSubtasks} of ${totalSubtasks} subtasks completed`}
              >
                <List className="h-3 w-3 text-neutral-400" aria-hidden="true" />
                {completedSubtasks}/{totalSubtasks}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TaskCard = memo(TaskCardComponent);
