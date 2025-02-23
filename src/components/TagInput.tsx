
import { useState, useRef, useCallback } from "react";
import { Command, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tag, X, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export type TagType = {
  id: string;
  label: string;
  color?: string;
};

interface TagInputProps {
  value: TagType[];
  onChange: (tags: TagType[]) => void;
  suggestions?: TagType[];
  maxTags?: number;
}

export function TagInput({ value = [], onChange, suggestions = [], maxTags = 5 }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget;

      if (e.key === "Enter") {
        e.preventDefault();
        if (inputValue && value.length < maxTags) {
          // Check if tag already exists
          if (!value.some((tag) => tag.label.toLowerCase() === inputValue.toLowerCase())) {
            const newTag: TagType = {
              id: Math.random().toString(36).substring(2),
              label: inputValue,
            };
            onChange([...value, newTag]);
          }
          setInputValue("");
          setOpen(false);
        }
      } else if (e.key === "Backspace" && !input.value && value.length > 0) {
        onChange(value.slice(0, -1));
      }
    },
    [inputValue, value, onChange, maxTags]
  );

  const removeTag = useCallback(
    (tagToRemove: TagType) => {
      onChange(value.filter((tag) => tag.id !== tagToRemove.id));
    },
    [onChange, value]
  );

  const filteredSuggestions = (suggestions || []).filter(
    (suggestion) =>
      !value.some((tag) => tag.id === suggestion.id) &&
      suggestion.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        className="flex min-h-[40px] w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag.id}
            className={cn(
              "inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-sm text-neutral-800 transition-all hover:bg-neutral-200",
              "animate-fade-in"
            )}
          >
            <Tag className="h-3 w-3" />
            {tag.label}
            <button
              type="button"
              className="ml-1 rounded-full p-0.5 hover:bg-neutral-300 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (!open) setOpen(true);
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px] inline-flex h-8"
              placeholder={value.length < maxTags ? "Add tag..." : ""}
              disabled={value.length >= maxTags}
            />
          </PopoverTrigger>
          {filteredSuggestions.length > 0 && (
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandGroup>
                  {filteredSuggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.id}
                      value={suggestion.id}
                      onSelect={() => {
                        onChange([...value, suggestion]);
                        setInputValue("");
                        setOpen(false);
                      }}
                      className="gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      {suggestion.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandEmpty>No results found.</CommandEmpty>
              </Command>
            </PopoverContent>
          )}
        </Popover>
      </div>
    </div>
  );
}
