// Layer 1: the Task model. Everything else builds on this shape.

export const STATUSES = ['todo', 'doing', 'done'];

let nextId = 1;

export function createTask(title, status = 'todo') {
  if (!title || !title.trim()) {
    throw new Error('Task title is required');
  }
  if (!STATUSES.includes(status)) {
    throw new Error(`Unknown status: ${status}`);
  }

  return {
    id: nextId++,
    title: title.trim(),
    status,
    createdAt: new Date().toISOString(),
  };
}

export function formatTask(task) {
  const marker = task.status === 'done' ? 'x' : ' ';
  return `[${marker}] #${task.id} ${task.title}`;
}

export function resetIds() {
  nextId = 1;
}
