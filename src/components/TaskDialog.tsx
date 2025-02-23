
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
  const [priority, setPriority] = useState("medium");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("work");
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
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [recurrencyType, setRecurrencyType] = useState("");
  const [hasReminder, setHasReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([
    "work", "personal", "shopping", "health"
  ]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: description,
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[100px] apple-style-editor',
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
      category,
      tags,
      dependencies,
      subTasks,
      isRecurrent,
      recurrencyType,
      hasReminder,
      reminderTime,
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

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setCategory(newCategory);
      setNewCategory("");
      setShowCategoryForm(false);
    }
  };

  const filteredDependencies = availableDependencies.filter(
    dep => !dependencies.includes(dep.id)
  );

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
            <div className="flex items-center gap-3">
              <Heading className="h-4 w-4 text-gray-500 shrink-0" />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="flex-1"
                required
              />
            </div>

            {/* Task Description */}
            <div className="flex gap-3">
              <Text className="h-4 w-4 text-gray-500 shrink-0 mt-2" />
              <div className="flex-1 border rounded-md p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-white">
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Task Settings Row */}
            <div className="flex items-center gap-3">
              <div className="flex gap-2 flex-1">
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="w-[120px]">
                    <ArrowUp className="h-4 w-4 text-gray-500 mr-2" />
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
                
                <div className="flex items-center gap-2 w-[150px]">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex flex-col">
                  <Button
                    type="button"
                    variant={isRecurrent ? "default" : "outline"}
                    size="icon"
                    onClick={() => setIsRecurrent(!isRecurrent)}
                    className="mb-2"
                  >
                    <RepeatIcon className="h-4 w-4" />
                  </Button>
                  {isRecurrent && (
                    <Select value={recurrencyType} onValueChange={setRecurrencyType}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <Button
                    type="button"
                    variant={hasReminder ? "default" : "outline"}
                    size="icon"
                    onClick={() => setHasReminder(!hasReminder)}
                    className="mb-2"
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                  {hasReminder && (
                    <Select value={reminderTime} onValueChange={setReminderTime}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Reminder" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="5min">5 minutes before</SelectItem>
                          <SelectItem value="15min">15 minutes before</SelectItem>
                          <SelectItem value="30min">30 minutes before</SelectItem>
                          <SelectItem value="1hour">1 hour before</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-3">
              <Folder className="h-4 w-4 text-gray-500 shrink-0" />
              <div className="flex gap-2 flex-1">
                {!showCategoryForm ? (
                  <>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowCategoryForm(true)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2 flex-1">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category name"
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddCategory}>
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCategoryForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags Input */}
            <div className="flex items-start gap-3">
              <Tags className="h-4 w-4 text-gray-500 shrink-0 mt-2" />
              <div className="flex-1">
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
            <div className="flex items-start gap-3">
              <List className="h-4 w-4 text-gray-500 shrink-0 mt-2" />
              <div className="flex-1">
                {filteredDependencies.length > 0 && (
                  <Select onValueChange={(value) => setDependencies([...dependencies, value])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add dependencies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {filteredDependencies.map((dep) => (
                          <SelectItem key={dep.id} value={dep.id}>
                            {dep.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {dependencies.map((dep, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center text-xs bg-accent/10 text-accent px-2 py-1 rounded-full"
                    >
                      {availableDependencies.find(d => d.id === dep)?.title}
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
            <div className="flex items-start gap-3">
              <List className="h-4 w-4 text-gray-500 shrink-0 mt-2" />
              <div className="flex-1">
                <Input
                  value={newSubTask}
                  onChange={(e) => setNewSubTask(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'subtask')}
                  placeholder="Add a subtask and press Enter"
                  className="mb-2"
                />
                <div className="space-y-1 text-sm">
                  {subTasks.map((subtask, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between gap-2 p-2 rounded ${
                        index % 2 === 0 ? 'bg-accent/5' : 'bg-background'
                      }`}
                    >
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
                        className="hover:text-accent transition-colors"
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
