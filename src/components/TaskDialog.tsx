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
import { Bell, Plus, RepeatIcon, Settings2 } from "lucide-react";
import { TagInput, type TagType } from "./TagInput";

export function TaskDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("work");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState<TagType[]>([]);
  const [showRecurrence, setShowRecurrence] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>();
  const [showReminder, setShowReminder] = useState(false);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>();
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { id: "work", name: "Work", color: "#0EA5E9" },
    { id: "personal", name: "Personal", color: "#8B5CF6" },
  ]);

  const tagSuggestions: TagType[] = [
    { id: "1", label: "Important" },
    { id: "2", label: "Urgent" },
    { id: "3", label: "Follow-up" },
    { id: "4", label: "Review" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      title,
      description,
      category,
      date,
      tags,
      recurrencePattern,
      reminderSettings,
    });
    onOpenChange(false);
  };

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
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="tags" className="text-right pt-2.5">
                  Tags
                </Label>
                <div className="col-span-3">
                  <TagInput
                    value={tags}
                    onChange={setTags}
                    suggestions={tagSuggestions}
                  />
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
