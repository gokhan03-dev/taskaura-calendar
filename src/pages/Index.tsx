
import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { Clock, Calendar, List, Plus, CalendarPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskDialog } from "@/components/TaskDialog";
import { MeetingDialog } from "@/components/MeetingDialog";

const ProgressCard = ({ title, value, icon: Icon }: { title: string; value: string; icon: any }) => (
  <div className="bg-white rounded-xl p-6 shadow-glass">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-2 rounded-lg bg-neutral-100">
        <Icon className="w-5 h-5 text-neutral-600" />
      </div>
      <h3 className="text-sm font-medium text-neutral-600">{title}</h3>
    </div>
    <p className="text-3xl font-semibold">{value}</p>
  </div>
);

const TaskCard = ({ title, description, date, category, priority }: any) => (
  <div className="bg-white rounded-xl p-4 shadow-glass hover:shadow-lg transition-shadow">
    <div className="flex items-start gap-3">
      <input type="checkbox" className="mt-1" />
      <div className="flex-1">
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm text-neutral-500 mb-3">{description}</p>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs rounded-md bg-neutral-100">{category}</span>
          <span className="text-xs text-neutral-500">{date}</span>
        </div>
      </div>
    </div>
  </div>
);

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <ProgressCard title="Weekly Progress" value="0%" icon={Clock} />
            <ProgressCard title="Monthly Progress" value="29%" icon={Calendar} />
            <ProgressCard title="Overall Tasks" value="2/7" icon={List} />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <div className="flex gap-3">
              <Button 
                className="bg-accent text-white hover:bg-accent-hover"
                onClick={() => setTaskDialogOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add a task
              </Button>
              <Button 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent hover:text-white"
                onClick={() => setMeetingDialogOpen(true)}
              >
                <CalendarPlus className="w-5 h-5 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-4">To Do</h3>
              <div className="space-y-4">
                <TaskCard
                  title="House Works"
                  description="Do the house works properly."
                  date="Feb 11"
                  category="Personal"
                />
                <TaskCard
                  title="Meeting with Mike"
                  description="About the new website"
                  date="Feb 22"
                  category="Work"
                />
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">In Progress</h3>
              <div className="space-y-4">
                <TaskCard
                  title="2nd Task"
                  description="task of the 2nd one"
                  date="Feb 20"
                  category="Work"
                />
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Completed</h3>
              <div className="space-y-4">
                <TaskCard
                  title="First Task Ever"
                  description="Do the best ever"
                  date="Feb 27"
                  category="Personal"
                />
              </div>
            </div>
          </div>

          <TaskDialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen} />
          <MeetingDialog open={meetingDialogOpen} onOpenChange={setMeetingDialogOpen} />
        </main>
      </div>
    </div>
  );
};

export default Index;
