
import { Bell, Moon } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-200">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-medium">Welcome back, User</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <Bell className="w-5 h-5 text-neutral-600" />
        </button>
        <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <Moon className="w-5 h-5 text-neutral-600" />
        </button>
      </div>
    </header>
  );
};
