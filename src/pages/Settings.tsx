
import { useState } from "react";
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Sun, 
  Moon,
  Video, 
  Mail, 
  Calendar,
  CheckCircle,
  XCircle,
  Link,
  Settings as SettingsIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const IntegrationCard = ({ 
  title, 
  description, 
  icon: Icon, 
  isConnected, 
  onConnect, 
  onDisconnect 
}: IntegrationCardProps) => (
  <div className="glass-card p-6 rounded-xl hover:shadow-lg transition-all">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-accent/10">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isConnected ? (
          <CheckCircle className="w-5 h-5 text-success-DEFAULT animate-fade-in" />
        ) : (
          <XCircle className="w-5 h-5 text-neutral-400 animate-fade-in" />
        )}
        <Button
          variant={isConnected ? "outline" : "default"}
          size="sm"
          onClick={isConnected ? onDisconnect : onConnect}
          className="animate-fade-in"
        >
          <Link className="w-4 h-4 mr-2" />
          {isConnected ? "Disconnect" : "Connect"}
        </Button>
      </div>
    </div>
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  const [integrations, setIntegrations] = useState({
    zoom: false,
    google: false,
    microsoft: false
  });

  const handleConnect = (service: keyof typeof integrations) => {
    setIntegrations(prev => ({ ...prev, [service]: true }));
    // TODO: Implement actual integration
  };

  const handleDisconnect = (service: keyof typeof integrations) => {
    setIntegrations(prev => ({ ...prev, [service]: false }));
    // TODO: Implement actual disconnection
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-neutral-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-neutral-500">Manage your account preferences and integrations</p>
          </div>
        </div>

        {/* General Settings */}
        <section className="space-y-6 animate-fade-in animation-delay-200">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            General Settings
          </h2>
          
          <div className="glass-card p-6 rounded-xl space-y-6">
            {/* User Profile */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-accent/10">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <Label>User Profile</Label>
                  <p className="text-sm text-neutral-500">Update your personal information</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Bell className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <Label>Notifications</Label>
                  <p className="text-sm text-neutral-500">Manage your notification preferences</p>
                </div>
              </div>
              
              <div className="ml-12 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="in-app-notifications">In-app Notifications</Label>
                  <Switch
                    id="in-app-notifications"
                    checked={inAppNotifications}
                    onCheckedChange={setInAppNotifications}
                  />
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-accent/10">
                  {isDarkMode ? (
                    <Moon className="w-5 h-5 text-accent" />
                  ) : (
                    <Sun className="w-5 h-5 text-accent" />
                  )}
                </div>
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-neutral-500">Toggle dark mode theme</p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="space-y-6 animate-fade-in animation-delay-400">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Link className="w-5 h-5" />
            Integrations
          </h2>
          
          <div className="space-y-4">
            <IntegrationCard
              title="Zoom"
              description="Connect your Zoom account to schedule video meetings"
              icon={Video}
              isConnected={integrations.zoom}
              onConnect={() => handleConnect('zoom')}
              onDisconnect={() => handleDisconnect('zoom')}
            />

            <IntegrationCard
              title="Google Calendar"
              description="Sync with Google Calendar and Google Meet"
              icon={Calendar}
              isConnected={integrations.google}
              onConnect={() => handleConnect('google')}
              onDisconnect={() => handleDisconnect('google')}
            />

            <IntegrationCard
              title="Microsoft 365"
              description="Connect with Outlook Calendar and Microsoft Teams"
              icon={Mail}
              isConnected={integrations.microsoft}
              onConnect={() => handleConnect('microsoft')}
              onDisconnect={() => handleDisconnect('microsoft')}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
