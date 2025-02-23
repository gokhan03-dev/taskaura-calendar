
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
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Bell, RepeatIcon, Tags, Plus } from "lucide-react";

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

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const addSubTask = () => {
    if (newSubTask) {
      setSubTasks([...subTasks, { title: newSubTask, completed: false }]);
      setNewSubTask("");
    }
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* Priority, Date, Recurrent, Reminder Row */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Options</Label>
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
                
                <Button
                  type="button"
                  variant={isRecurrent ? "default" : "outline"}
                  size="icon"
                  onClick={() => setIsRecurrent(!isRecurrent)}
                >
                  <RepeatIcon className="h-4 w-4" />
                </Button>
                
                <Button
                  type="button"
                  variant={hasReminder ? "default" : "outline"}
                  size="icon"
                  onClick={() => setHasReminder(!hasReminder)}
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Category */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="col-span-3">
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
            </div>

            {/* Tags */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Tags</Label>
              <div className="col-span-3">
                <div className="flex gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-accent/10 text-accent px-2 py-1 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Tags className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Dependencies */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Dependencies</Label>
              <Select onValueChange={(value) => setDependencies([...dependencies, value])}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select dependencies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="task1">Task 1</SelectItem>
                    <SelectItem value="task2">Task 2</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* SubTasks */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Subtasks</Label>
              <div className="col-span-3 space-y-2">
                {subTasks.map((subtask, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => {
                        const newSubTasks = [...subTasks];
                        newSubTasks[index].completed = !newSubTasks[index].completed;
                        setSubTasks(newSubTasks);
                      }}
                    />
                    <span>{subtask.title}</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newSubTask}
                    onChange={(e) => setNewSubTask(e.target.value)}
                    placeholder="Add a subtask"
                  />
                  <Button type="button" variant="outline" onClick={addSubTask}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
