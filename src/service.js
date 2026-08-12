// Layer 3: business logic over the store. Filtering, sorting, summaries.

import { TaskStore } from './store.js';

export class TaskService {
  constructor(store = new TaskStore()) {
    this.store = store;
  }

  add(title, status) {
    return this.store.add(title, status);
  }

  complete(id) {
    return this.store.update(id, { status: 'done' });
  }

  list({ status } = {}) {
    let tasks = this.store.all();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    return tasks.sort((a, b) => a.id - b.id);
  }

  summary() {
    const tasks = this.store.all();
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      doing: tasks.filter((t) => t.status === 'doing').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };
  }
}
