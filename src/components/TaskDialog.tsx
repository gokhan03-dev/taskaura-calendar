
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { CalendarIcon, Bell, RepeatIcon, Tags, Plus, X, ChevronDown, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function TaskDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("work");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [subTasks, setSubTasks] = useState<{ title: string; completed: boolean }[]>([]);
  const [newSubTask, setNewSubTask] = useState("");
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [hasReminder, setHasReminder] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      description,
      priority,
      date,
      category,
      tags,
      dependencies,
      subTasks,
      isRecurrent,
      hasReminder,
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

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const removeSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  const toggleSubTask = (index: number) => {
    const newSubTasks = [...subTasks];
    newSubTasks[index].completed = !newSubTasks[index].completed;
    setSubTasks(newSubTasks);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task with detailed information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Task Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            {/* Task Description */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right mt-2">
                Description
              </Label>
              <div className="col-span-3 border rounded-md p-2 min-h-[100px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Task Settings Row */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Task Settings</Label>
              <div className="col-span-3 flex gap-2">
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="w-[120px]">
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
                  className="w-[150px]"
                />
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={isRecurrent ? "default" : "outline"}
                      size="icon"
                    >
                      <RepeatIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="end">
                    <div className="grid gap-2 p-4">
                      <Select onValueChange={() => setIsRecurrent(true)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={hasReminder ? "default" : "outline"}
                      size="icon"
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="end">
                    <div className="grid gap-2 p-4">
                      <Select onValueChange={() => setHasReminder(true)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Remind me" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5min">5 minutes before</SelectItem>
                          <SelectItem value="15min">15 minutes before</SelectItem>
                          <SelectItem value="30min">30 minutes before</SelectItem>
                          <SelectItem value="1hour">1 hour before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Category */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <div className="col-span-3 flex gap-2">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a category" />
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
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowCategoryManager(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tags Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Tags</Label>
              <div className="col-span-3">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'tag')}
                  placeholder="Type a tag and press Enter"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center text-xs bg-accent/10 text-accent px-2 py-1 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-accent-hover"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Dependencies */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Dependencies</Label>
              <div className="col-span-3">
                <Select onValueChange={(value) => setDependencies([...dependencies, value])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add dependencies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="task1">Task 1</SelectItem>
                      <SelectItem value="task2">Task 2</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {dependencies.map((dep, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center text-xs bg-accent/10 text-accent px-2 py-1 rounded-full"
                    >
                      {dep}
                      <button
                        type="button"
                        onClick={() => setDependencies(dependencies.filter(d => d !== dep))}
                        className="ml-1 hover:text-accent-hover"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SubTasks */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Subtasks</Label>
              <div className="col-span-3">
                <Input
                  value={newSubTask}
                  onChange={(e) => setNewSubTask(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'subtask')}
                  placeholder="Add a subtask and press Enter"
                  className="mb-2"
                />
                <div className="space-y-2 text-sm">
                  {subTasks.map((subtask, index) => (
                    <div key={index} className="flex items-center justify-between gap-2 group">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => toggleSubTask(index)}
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <span className={subtask.completed ? "line-through text-gray-500" : ""}>
                          {subtask.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSubTask(index)}
                        className="opacity-0 group-hover:opacity-100 hover:text-accent transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="text-white">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
