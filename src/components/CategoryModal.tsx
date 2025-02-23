
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Tag, Trash2 } from "lucide-react";

export type Category = {
  id: string;
  name: string;
  color: string;
};

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSave: (categories: Category[]) => void;
}

const colors = [
  "#8B5CF6", // Purple
  "#D946EF", // Pink
  "#F97316", // Orange
  "#0EA5E9", // Blue
  "#10B981", // Green
  "#F43F5E", // Red
];

export function CategoryModal({
  open,
  onOpenChange,
  categories,
  onSave,
}: CategoryModalProps) {
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (!newCategory) return;
    
    const category: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCategory,
      color: colors[localCategories.length % colors.length],
    };

    setLocalCategories([...localCategories, category]);
    setNewCategory("");
  };

  const handleDeleteCategory = (id: string) => {
    setLocalCategories(localCategories.filter((cat) => cat.id !== id));
  };

  const handleSave = () => {
    onSave(localCategories);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-card p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Tag className="h-4 w-4" />
            Manage Categories
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add New Category */}
          <div className="flex items-center gap-3">
            <Input
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 h-9 text-sm"
            />
            <Button
              type="button"
              size="icon"
              onClick={handleAddCategory}
              disabled={!newCategory}
              className="h-9 w-9"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            {localCategories.map((category) => (
              <div key={category.id} className="flex items-center gap-2 text-sm">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <span className="flex-1">{category.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="h-8 w-8 hover:bg-neutral-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
