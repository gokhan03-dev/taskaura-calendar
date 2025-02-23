
import { Bell, Moon, LogOut } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-neutral-200">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-medium">
          Welcome back, {user?.email}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <Bell className="w-5 h-5 text-neutral-600" />
        </button>
        <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <Moon className="w-5 h-5 text-neutral-600" />
        </button>
        <button 
          onClick={handleSignOut}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <LogOut className="w-5 h-5 text-neutral-600" />
        </button>
      </div>
    </header>
  );
};
