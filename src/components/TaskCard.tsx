
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

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    date: string;
    category: string;
    completed: boolean;
    priority: "high" | "medium" | "low";
    tags?: { id: string; label: string }[];
    subtasks?: { id: string; title: string; completed: boolean }[];
    recurrencePattern?: { frequency: string; interval: number };
  };
  onEdit: () => void;
}

const priorityColors = {
  high: "#ea384c", // Red
  medium: "#FEF7CD", // Yellow
  low: "#0EA5E9" // Blue
} as const;

export const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const visibleTags = task.tags?.slice(0, 3) || [];
  const remainingTags = (task.tags?.length || 0) - visibleTags.length;

  return (
    <div 
      className="bg-white rounded-xl p-4 shadow-glass hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onEdit}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={task.completed}
          className="mt-1"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement toggle completion
          }}
        />
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <Star 
                className="h-4 w-4" 
                style={{ 
                  color: priorityColors[task.priority],
                  fill: priorityColors[task.priority],
                  opacity: task.priority === "low" ? 0.5 : 1
                }}
              />
              <h4 className={`font-medium ${task.completed ? 'line-through text-neutral-400' : ''}`}>
                {task.title}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {task.recurrencePattern && (
                <Repeat className="h-4 w-4 text-neutral-400" />
              )}
              <span className="text-sm text-neutral-500">
                {format(new Date(task.date), 'MMM dd')}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement delete
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className={`text-sm text-neutral-500 mb-3 ${task.completed ? 'line-through' : ''}`}>
            {task.description}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-1 text-xs rounded-md bg-neutral-100">
              {task.category}
            </span>
            
            {visibleTags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-3 w-3 text-neutral-400" />
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
              <div className="flex items-center gap-1 text-xs text-neutral-600">
                <List className="h-3 w-3 text-neutral-400" />
                {completedSubtasks}/{totalSubtasks}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
