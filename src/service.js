// Layer 3: business logic over the store. Filtering, sorting, summaries.

import { TaskStore } from './store.js';

// Highest first, so a descending sort puts urgent work at the top.
const PRIORITY_RANK = { high: 3, med: 2, low: 1 };

export class TaskService {
  constructor(store = new TaskStore()) {
    this.store = store;
  }

  add(title, status, priority) {
    return this.store.add(title, status, priority);
  }

  complete(id) {
    return this.store.update(id, { status: 'done' });
  }

  list({ status, priority } = {}) {
    let tasks = this.store.all();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (priority) {
      tasks = tasks.filter((task) => task.priority === priority);
    }
    return tasks.sort(
      (a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] || a.id - b.id
    );
  }

  summary() {
    const tasks = this.store.all();
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      doing: tasks.filter((t) => t.status === 'doing').length,
      done: tasks.filter((t) => t.status === 'done').length,
      high: this.store.byPriority('high').length,
      med: this.store.byPriority('med').length,
      low: this.store.byPriority('low').length,
    };
  }
}
