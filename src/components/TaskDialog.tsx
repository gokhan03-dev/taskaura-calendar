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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecurrenceModal, type RecurrencePattern } from "./RecurrenceModal";
import { ReminderModal, type ReminderSettings } from "./ReminderModal";
import { CategoryModal, type Category } from "./CategoryModal";
import { Bell, Plus, RepeatIcon, Settings2, Link2, X } from "lucide-react";
import { TagInput, TagType } from "./TagInput";

interface Task {
  id: string;
  title: string;
}

export function TaskDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("work");
  const [date, setDate] = useState("");
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>();
  const [showReminder, setShowReminder] = useState(false);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>();
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { id: "work", name: "Work", color: "#0EA5E9" },
    { id: "personal", name: "Personal", color: "#8B5CF6" },
  ]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [dependencies, setDependencies] = useState<Task[]>([]);

  const availableTasks: Task[] = [
    { id: "1", title: "Setup Project" },
    { id: "2", title: "Design UI" },
    { id: "3", title: "Implement Backend" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      description,
      category,
      date,
      recurrencePattern,
      reminderSettings,
      tags,
      dependencies,
    });
    onOpenChange(false);
  };

  const handleAddDependency = (taskId: string) => {
    const taskToAdd = availableTasks.find(task => task.id === taskId);
    if (taskToAdd && !dependencies.some(dep => dep.id === taskId)) {
      setDependencies([...dependencies, taskToAdd]);
    }
  };

  const handleRemoveDependency = (taskId: string) => {
    setDependencies(dependencies.filter(dep => dep.id !== taskId));
  };

  const remainingTasks = availableTasks.filter(task => !dependencies.some(dep => dep.id === task.id));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task to add to your list.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2.5">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3 min-h-[100px]"
                  placeholder="Task description..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: cat.color }}
                              />
                              {cat.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowCategories(true)}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Due Date
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant={recurrencePattern ? "default" : "outline"}
                    size="icon"
                    onClick={() => setShowRecurrence(true)}
                    className="relative"
                  >
                    <RepeatIcon className="h-4 w-4" />
                    {recurrencePattern && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant={reminderSettings ? "default" : "outline"}
                    size="icon"
                    onClick={() => setShowReminder(true)}
                    className="relative"
                  >
                    <Bell className="h-4 w-4" />
                    {reminderSettings && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right">Dependencies</Label>
                <div className="col-span-3">
                  <div className="space-y-2">
                    <Select onValueChange={handleAddDependency}>
                      <SelectTrigger className="w-full border-dashed">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add dependency</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {remainingTasks.map(task => (
                            <SelectItem key={task.id} value={task.id}>
                              <div className="flex items-center gap-2">
                                <Link2 className="h-3.5 w-3.5 text-neutral-400" />
                                {task.title}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    
                    <div className="space-y-1.5">
                      {dependencies.map(dep => (
                        <div
                          key={dep.id}
                          className="group relative flex items-center gap-2 py-1.5 px-2.5 pr-8 rounded-md bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-colors"
                        >
                          <Link2 className="h-3.5 w-3.5 text-neutral-400" />
                          <span className="text-sm font-medium text-neutral-700">{dep.title}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDependency(dep.id)}
                            className="absolute right-1.5 opacity-0 group-hover:opacity-100 h-5 w-5 p-0 hover:bg-neutral-200"
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove dependency</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="tags" className="text-right pt-2.5">
                  Tags
                </Label>
                <div className="col-span-3">
                  <TagInput
                    value={tags}
                    onChange={setTags}
                    maxTags={5}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <RecurrenceModal
        open={showRecurrence}
        onOpenChange={setShowRecurrence}
        onSave={setRecurrencePattern}
        initialPattern={recurrencePattern}
      />

      <ReminderModal
        open={showReminder}
        onOpenChange={setShowReminder}
        onSave={setReminderSettings}
        initialSettings={reminderSettings}
      />

      <CategoryModal
        open={showCategories}
        onOpenChange={setShowCategories}
        categories={categories}
        onSave={setCategories}
      />
    </>
  );
}
