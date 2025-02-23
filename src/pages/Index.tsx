import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { Clock, Calendar, List, Plus, CalendarPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TaskDialog } from "@/components/TaskDialog";
import { ScheduleDialog } from "@/components/ScheduleDialog";
import { TaskCard } from "@/components/TaskCard";
import { MeetingCard } from "@/components/MeetingCard";
import { useTasks } from "@/hooks/useTasks";
import { useMeetings } from "@/hooks/useMeetings";

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

  const { tasks, isLoading: tasksLoading, subscribeToTasks } = useTasks();
  const { meetings, isLoading: meetingsLoading, deleteMeeting, subscribeToMeetings } = useMeetings();

  useEffect(() => {
    const unsubscribeTasks = subscribeToTasks();
    const unsubscribeMeetings = subscribeToMeetings();

    return () => {
      unsubscribeTasks();
      unsubscribeMeetings();
    };
  }, []);

  const filteredItems = [
    ...(tasks || []).map(task => ({ 
      ...task, 
      type: 'task' as const,
      completed: task.status === 'completed',
      date: task.due_date,
      category: task.category_id || 'Uncategorized',
    })),
    ...(meetings || []).map(meeting => ({ 
      ...meeting, 
      type: 'meeting' as const,
      attendees: meeting.attendees || [],
      location: meeting.location || '',
      description: meeting.description || '',
    })),
  ].filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingItems = filteredItems.filter(item => 
    (item.type === 'task' && item.status !== 'completed') ||
    (item.type === 'meeting' && item.status === 'scheduled')
  );

  const inProgressItems = filteredItems.filter(item =>
    (item.type === 'task' && item.status === 'in_progress') ||
    (item.type === 'meeting' && new Date(item.start_time) <= new Date() && new Date(item.end_time) >= new Date())
  );

  const completedItems = filteredItems.filter(item =>
    (item.type === 'task' && item.status === 'completed') ||
    (item.type === 'meeting' && item.status === 'completed')
  );

  if (tasksLoading || meetingsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <ProgressCard 
              title="Weekly Progress" 
              value={`${Math.round((completedItems.length / filteredItems.length) * 100 || 0)}%`} 
              icon={Clock} 
            />
            <ProgressCard 
              title="Monthly Progress" 
              value={`${completedItems.length}/${filteredItems.length}`} 
              icon={Calendar} 
            />
            <ProgressCard 
              title="Overall Tasks" 
              value={`${tasks?.length || 0}`} 
              icon={List} 
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Search tasks and meetings..."
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
                {pendingItems.map(item => (
                  item.type === 'task' ? (
                    <TaskCard
                      key={item.id}
                      task={{
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        date: item.due_date,
                        category: item.category_id || 'Uncategorized',
                        completed: item.status === 'completed',
                        tags: [],
                      }}
                      onEdit={() => {
                        setSelectedTaskId(item.id);
                        setTaskDialogOpen(true);
                      }}
                    />
                  ) : (
                    <MeetingCard
                      key={item.id}
                      meeting={{
                        id: item.id,
                        title: item.title,
                        description: item.description || '',
                        start_time: item.start_time,
                        end_time: item.end_time,
                        attendees: item.attendees || [],
                        meeting_type: item.meeting_type,
                        location: item.location || '',
                        recurrence_pattern: item.recurrence_pattern,
                      }}
                      onEdit={() => {
                        setSelectedMeetingId(item.id);
                        setScheduleDialogOpen(true);
                      }}
                      onDelete={() => deleteMeeting.mutate(item.id)}
                    />
                  )
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">In Progress</h3>
              <div className="space-y-4">
                {inProgressItems.map(item => (
                  item.type === 'task' ? (
                    <TaskCard
                      key={item.id}
                      task={{
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        date: item.due_date,
                        category: item.category_id || 'Uncategorized',
                        completed: item.status === 'completed',
                        tags: [],
                      }}
                      onEdit={() => {
                        setSelectedTaskId(item.id);
                        setTaskDialogOpen(true);
                      }}
                    />
                  ) : (
                    <MeetingCard
                      key={item.id}
                      meeting={{
                        id: item.id,
                        title: item.title,
                        description: item.description || '',
                        start_time: item.start_time,
                        end_time: item.end_time,
                        attendees: item.attendees || [],
                        meeting_type: item.meeting_type,
                        location: item.location || '',
                        recurrence_pattern: item.recurrence_pattern,
                      }}
                      onEdit={() => {
                        setSelectedMeetingId(item.id);
                        setScheduleDialogOpen(true);
                      }}
                      onDelete={() => deleteMeeting.mutate(item.id)}
                    />
                  )
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Completed</h3>
              <div className="space-y-4">
                {completedItems.map(item => (
                  item.type === 'task' ? (
                    <TaskCard
                      key={item.id}
                      task={{
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        date: item.due_date,
                        category: item.category_id || 'Uncategorized',
                        completed: item.status === 'completed',
                        tags: [],
                      }}
                      onEdit={() => {
                        setSelectedTaskId(item.id);
                        setTaskDialogOpen(true);
                      }}
                    />
                  ) : (
                    <MeetingCard
                      key={item.id}
                      meeting={{
                        id: item.id,
                        title: item.title,
                        description: item.description || '',
                        start_time: item.start_time,
                        end_time: item.end_time,
                        attendees: item.attendees || [],
                        meeting_type: item.meeting_type,
                        location: item.location || '',
                        recurrence_pattern: item.recurrence_pattern,
                      }}
                      onEdit={() => {
                        setSelectedMeetingId(item.id);
                        setScheduleDialogOpen(true);
                      }}
                      onDelete={() => deleteMeeting.mutate(item.id)}
                    />
                  )
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
