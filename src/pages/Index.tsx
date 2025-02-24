import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { Clock, Calendar, List, Plus, CalendarPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TaskDialog } from "@/components/TaskDialog";
import { ScheduleDialog } from "@/components/ScheduleDialog";
import { TaskCard } from "@/components/TaskCard";
import { MeetingCard } from "@/components/MeetingCard";

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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  const mockTasks = [
    {
      id: "1",
      title: "House Works",
      description: "Do the house works properly.",
      date: "2024-02-11",
      category: "Personal",
      completed: false,
      priority: "high",
      tags: [{ id: "1", label: "Home" }],
      subtasks: [
        { id: "1", title: "Clean kitchen", completed: true },
        { id: "2", title: "Vacuum living room", completed: false }
      ],
      recurrencePattern: { frequency: "weekly", interval: 1 }
    },
    {
      id: "2",
      title: "Meeting with Mike",
      description: "About the new website",
      date: "2024-02-22",
      category: "Work",
      completed: false,
      priority: "medium",
      tags: [{ id: "2", label: "Website" }],
      subtasks: []
    }
  ];

  const mockMeetings = [
    {
      id: "1",
      title: "Team Sync",
      description: "Weekly team sync meeting",
      date: "2024-02-15",
      time: "10:00",
      attendees: [
        { email: "john@example.com", rsvp: "accepted" },
        { email: "jane@example.com", rsvp: "pending" }
      ],
      meetingType: "online" as const,
      location: "Google Meet"
    }
  ];

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
                onClick={() => {
                  setSelectedTaskId(null);
                  setTaskDialogOpen(true);
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add a task
              </Button>
              <Button 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent hover:text-white"
                onClick={() => {
                  setSelectedMeetingId(null);
                  setScheduleDialogOpen(true);
                }}
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
                {mockTasks
                  .filter(task => !task.completed)
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => {
                        setSelectedTaskId(task.id);
                        setTaskDialogOpen(true);
                      }}
                    />
                  ))}
                {mockMeetings.map(meeting => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onEdit={() => {
                      setSelectedMeetingId(meeting.id);
                      setScheduleDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">In Progress</h3>
              <div className="space-y-4">
                {/* Add in-progress tasks and meetings here */}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Completed</h3>
              <div className="space-y-4">
                {mockTasks
                  .filter(task => task.completed)
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => {
                        setSelectedTaskId(task.id);
                        setTaskDialogOpen(true);
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>

          <TaskDialog 
            open={taskDialogOpen} 
            onOpenChange={setTaskDialogOpen}
          />
          <ScheduleDialog 
            open={scheduleDialogOpen} 
            onOpenChange={setScheduleDialogOpen}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
