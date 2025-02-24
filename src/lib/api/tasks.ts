
import { supabase } from '@/integrations/supabase/client';
import { CreateTaskInput, UpdateTaskInput } from '@/lib/types/task';

export async function fetchTasks(userId: string) {
  const { data: tasksData, error: tasksError } = await supabase
    .from('tasks')
    .select(`
      *,
      categories (*),
      subtasks (
        id,
        title,
        completed
      ),
      task_tags!inner (
        tags (
          id,
          name
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (tasksError) {
    console.error('Error fetching tasks:', tasksError);
    throw tasksError;
  }

  // Transform the data to match the Task type
  const transformedData = tasksData?.map(task => ({
    ...task,
    tags: task.task_tags.map(tt => tt.tags)
  }));

  return transformedData;
}

export async function createTask(userId: string, newTask: CreateTaskInput & { tags?: string[] }) {
  const { tags, ...taskData } = newTask;
  
  // 1. Create the task first
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .insert([{
      ...taskData,
      user_id: userId,
      status: 'pending',
    }])
    .select()
    .single();

  if (taskError) throw taskError;

  // 2. Handle tags if provided
  if (tags && tags.length > 0) {
    await handleTaskTags(userId, task.id, tags);
  }

  return task;
}

export async function updateTask(userId: string, { id, ...updates }: UpdateTaskInput & { id: string }) {
  const { data: existingTask } = await supabase
    .from('tasks')
    .select('user_id')
    .eq('id', id)
    .single();

  if (existingTask?.user_id !== userId) {
    throw new Error('Unauthorized to update this task');
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
      completed_at: updates.status === 'completed' 
        ? new Date().toISOString() 
        : updates.completed_at,
    })
    .eq('id', id)
    .select(`
      *,
      categories (*),
      subtasks (*),
      task_tags (
        tags (*)
      )
    `)
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }
  return data;
}

export async function deleteTask(userId: string, taskId: string) {
  const { data: existingTask } = await supabase
    .from('tasks')
    .select('user_id')
    .eq('id', taskId)
    .single();

  if (existingTask?.user_id !== userId) {
    throw new Error('Unauthorized to delete this task');
  }

  // First delete related records
  const deleteRelatedPromises = [
    supabase.from('subtasks').delete().eq('task_id', taskId),
    supabase.from('task_tags').delete().eq('task_id', taskId),
    supabase.from('task_dependencies').delete().eq('dependent_task_id', taskId),
    supabase.from('task_dependencies').delete().eq('dependency_task_id', taskId),
  ];

  await Promise.all(deleteRelatedPromises);

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

async function handleTaskTags(userId: string, taskId: string, tags: string[]) {
  // First ensure all tags exist
  const existingTagsPromises = tags.map(tagName => 
    supabase
      .from('tags')
      .select('id, name')
      .eq('name', tagName)
      .eq('user_id', userId)
      .single()
      .then(({ data }) => data)
  );

  const existingTagsResults = await Promise.all(existingTagsPromises);
  const existingTags = existingTagsResults.filter(Boolean);
  const existingTagNames = new Set(existingTags.map(t => t.name));

  // Create new tags that don't exist
  const newTagNames = tags.filter(tag => !existingTagNames.has(tag));
  
  let allTagIds = existingTags.map(t => t.id);

  if (newTagNames.length > 0) {
    const { data: newTags, error: newTagsError } = await supabase
      .from('tags')
      .insert(newTagNames.map(name => ({
        name,
        user_id: userId
      })))
      .select('id');

    if (newTagsError) throw newTagsError;
    
    allTagIds = [...allTagIds, ...(newTags?.map(t => t.id) || [])];
  }

  // Create task-tag associations
  const { error: taskTagsError } = await supabase
    .from('task_tags')
    .insert(allTagIds.map(tagId => ({
      task_id: taskId,
      tag_id: tagId
    })));

  if (taskTagsError) throw taskTagsError;
}

