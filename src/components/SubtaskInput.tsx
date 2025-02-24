
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface SubtaskInputProps {
  value: Subtask[];
  onChange: (subtasks: Subtask[]) => void;
}

export function SubtaskInput({ value, onChange }: SubtaskInputProps) {
  const [newSubtask, setNewSubtask] = useState("");

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const newSubtaskItem: Subtask = {
      id: crypto.randomUUID(),
      title: newSubtask.trim(),
      completed: false
    };
    
    onChange([...value, newSubtaskItem]);
    setNewSubtask("");
  };

  const handleRemoveSubtask = (id: string) => {
    onChange(value.filter(subtask => subtask.id !== id));
  };

  const handleToggleSubtask = (id: string) => {
    onChange(value.map(subtask => 
      subtask.id === id 
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubtask();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Add a subtask..."
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button 
          type="button"
          variant="outline" 
          size="icon"
          onClick={handleAddSubtask}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add subtask</span>
        </Button>
      </div>
      
      <div className="space-y-1.5">
        {value.map((subtask, index) => (
          <div
            key={subtask.id}
            className={cn(
              "group relative flex items-center gap-2 py-1.5 px-2.5 pr-8 rounded-md",
              "bg-neutral-50/80 backdrop-blur-sm border border-neutral-200",
              "hover:border-neutral-300 transition-all duration-200",
              "animate-in fade-in-50 slide-in-from-top-1"
            )}
          >
            <button
              type="button"
              className="cursor-grab touch-none p-0.5 text-neutral-400 hover:text-neutral-600 active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
              <span className="sr-only">Drag to reorder</span>
            </button>

            <Checkbox
              checked={subtask.completed}
              onCheckedChange={() => handleToggleSubtask(subtask.id)}
              className="h-4 w-4"
            />
            
            <span className={cn(
              "text-sm text-neutral-700",
              subtask.completed && "line-through text-neutral-400"
            )}>
              {subtask.title}
            </span>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveSubtask(subtask.id)}
              className="absolute right-1.5 opacity-0 group-hover:opacity-100 h-5 w-5 p-0 hover:bg-neutral-200"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove subtask</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
