// Layer 1: the Task model. Everything else builds on this shape.

export const STATUSES = ['todo', 'doing', 'done'];
export const PRIORITIES = ['low', 'med', 'high'];

let nextId = 1;

export function createTask(title, status = 'todo', priority = 'med') {
  if (!title || !title.trim()) {
    throw new Error('Task title is required');
  }
  if (!STATUSES.includes(status)) {
    throw new Error(`Unknown status: ${status}`);
  }
  if (!PRIORITIES.includes(priority)) {
    throw new Error(`Unknown priority: ${priority}`);
  }

  return {
    id: nextId++,
    title: title.trim(),
    status,
    priority,
    createdAt: new Date().toISOString(),
  };
}

export function formatTask(task) {
  const marker = task.status === 'done' ? 'x' : ' ';
  return `[${marker}] #${task.id} ${task.title} (${task.priority})`;
}

export function resetIds() {
  nextId = 1;
}
