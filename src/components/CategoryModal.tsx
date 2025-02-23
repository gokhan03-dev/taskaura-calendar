
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Plus, Tag, Trash2 } from "lucide-react";

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

const defaultColors = [
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
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: defaultColors[0],
  });

  const handleAddCategory = () => {
    if (!newCategory.name) return;
    
    const category: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCategory.name,
      color: newCategory.color,
    };

    setLocalCategories([...localCategories, category]);
    setNewCategory({ name: "", color: defaultColors[0] });
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
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Tag className="h-4 w-4" />
            Manage Categories
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add New Category */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-sm text-right">New</Label>
            <div className="col-span-3 flex gap-2">
              <Input
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="flex-1 h-9"
              />
              <div className="flex gap-1">
                {defaultColors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded ${
                      newCategory.color === color ? "ring-2 ring-offset-2 ring-neutral-900" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                  />
                ))}
              </div>
              <Button
                type="button"
                size="icon"
                onClick={handleAddCategory}
                disabled={!newCategory.name}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            {localCategories.map((category) => (
              <div key={category.id} className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm text-right opacity-50">Category</div>
                <div className="col-span-3 flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="flex-1">{category.name}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
