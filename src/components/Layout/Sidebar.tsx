
import { useState } from 'react';
import { ChevronLeft, Home, Calendar, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'All Tasks', count: 7, path: '/' },
    { icon: Calendar, label: 'Today', count: 1, path: '/today' },
    { icon: Calendar, label: 'This Week', count: 2, path: '/week' },
    { icon: Calendar, label: 'Upcoming', count: 1, path: '/upcoming' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
  ];

  return (
    <aside className={`h-screen fixed left-0 top-0 z-20 flex flex-col bg-white border-r border-neutral-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-6">
        <h1 className={`text-xl font-semibold ${collapsed ? 'hidden' : 'block'}`}>Task Manager</h1>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
            onClick={() => navigate(item.path)}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <span className="text-sm px-2 py-1 rounded-md bg-neutral-100">
                    {item.count}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-200">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
};
