
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState, KeyboardEvent } from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CalendarIcon, Bell, RepeatIcon, Tags, Plus, X, ChevronDown, Settings, 
  Heading, Text, ArrowUp, List, Folder 
} from "lucide-react";

export function TaskDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [availableDependencies] = useState([
    { id: "task1", title: "Task 1" },
    { id: "task2", title: "Task 2" },
    { id: "task3", title: "Task 3" },
  ]);
  const [subTasks, setSubTasks] = useState<{ title: string; completed: boolean }[]>([]);
  const [newSubTask, setNewSubTask] = useState("");

  // Recurrency states
  const [recurrencyCount, setRecurrencyCount] = useState("1");
  const [recurrencyUnit, setRecurrencyUnit] = useState("days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Reminder state
  const [reminderTime, setReminderTime] = useState("15 minutes before");

  const editor = useEditor({
    extensions: [StarterKit],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[120px] prose prose-sm focus:outline-none apple-style-editor',
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      description,
      priority,
      date,
      recurrency: {
        count: recurrencyCount,
        unit: recurrencyUnit,
        startDate,
        endDate,
      },
      reminderTime,
      category,
      tags,
      dependencies,
      subTasks,
    });
    onOpenChange(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, type: 'tag' | 'subtask') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'tag' && newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setNewTag("");
      } else if (type === 'subtask' && newSubTask) {
        setSubTasks([...subTasks, { title: newSubTask, completed: false }]);
        setNewSubTask("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full text-lg"
            required
          />

          {/* Task Description */}
          <div className="rounded-lg border">
            <EditorContent editor={editor} className="p-3" />
          </div>

          {/* Priority and Date */}
          <div className="flex gap-2">
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1"
            />

            <Button type="button" size="icon" variant="outline">
              <RepeatIcon className="h-4 w-4" />
            </Button>
            
            <Button type="button" size="icon" variant="outline">
              <Bell className="h-4 w-4" />
            </Button>
          </div>

          {/* Recurrency Settings */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                value={recurrencyCount}
                onChange={(e) => setRecurrencyCount(e.target.value)}
                className="w-20"
              />
              <Select value={recurrencyUnit} onValueChange={setRecurrencyUnit}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Start date"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="End date (optional)"
                />
              </div>
            </div>
          </div>

          {/* Reminder Time */}
          <Select value={reminderTime} onValueChange={setReminderTime}>
            <SelectTrigger>
              <SelectValue placeholder="Reminder time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5 minutes before">5 minutes before</SelectItem>
              <SelectItem value="15 minutes before">15 minutes before</SelectItem>
              <SelectItem value="30 minutes before">30 minutes before</SelectItem>
              <SelectItem value="1 hour before">1 hour before</SelectItem>
            </SelectContent>
          </Select>

          {/* Tags */}
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'tag')}
              placeholder="Add new tag"
              className="flex-1"
            />
            <Button type="button" size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center text-xs bg-accent/10 text-accent px-2 py-1 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((_, i) => i !== index))}
                    className="ml-1 hover:text-accent-hover"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Subtasks */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'subtask')}
                placeholder="Add subtask"
                className="flex-1"
              />
              <Button type="button" size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {subTasks.length > 0 && (
              <div className="space-y-1">
                {subTasks.map((subtask, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded ${
                      index % 2 === 0 ? 'bg-accent/5' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => {
                        const newSubTasks = [...subTasks];
                        newSubTasks[index].completed = !newSubTasks[index].completed;
                        setSubTasks(newSubTasks);
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                      {subtask.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSubTasks(subTasks.filter((_, i) => i !== index))}
                      className="text-gray-500 hover:text-accent"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category */}
          <div className="flex items-center gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Add category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button type="button" size="icon" variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Dependencies */}
          <Select onValueChange={(value) => setDependencies([...dependencies, value])}>
            <SelectTrigger>
              <SelectValue placeholder="Related tasks (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableDependencies
                  .filter(dep => !dependencies.includes(dep.id))
                  .map(dep => (
                    <SelectItem key={dep.id} value={dep.id}>
                      {dep.title}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {dependencies.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {dependencies.map((depId, index) => {
                const dep = availableDependencies.find(d => d.id === depId);
                return (
                  <span
                    key={index}
                    className="inline-flex items-center text-xs bg-accent/10 text-accent px-2 py-1 rounded-full"
                  >
                    {dep?.title}
                    <button
                      type="button"
                      onClick={() => setDependencies(dependencies.filter(id => id !== depId))}
                      className="ml-1 hover:text-accent-hover"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="text-white">
              Create task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
