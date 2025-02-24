
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Tag, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  name: string;
  color: string;
  user_id: string | null;
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
  const { toast } = useToast();
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = async () => {
    if (!newCategory) return;
    
    try {
      const { data: category, error } = await supabase
        .from('categories')
        .insert({
          name: newCategory,
          color: colors[localCategories.length % colors.length],
        })
        .select()
        .single();

      if (error) throw error;

      setLocalCategories([...localCategories, category]);
      setNewCategory("");
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add category",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    // Don't allow deleting if it's the last category
    if (localCategories.length <= 1) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "At least one category must remain",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLocalCategories(localCategories.filter((cat) => cat.id !== id));
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCategory();
    }
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
          <div className="flex items-center gap-3">
            <Input
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={handleKeyDown}
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
                  disabled={localCategories.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
