// Layer 2: in-memory storage. Depends on the Task model.

import { createTask } from './task.js';

export class TaskStore {
  constructor() {
    this.tasks = [];
  }

  add(title, status, priority) {
    const task = createTask(title, status, priority);
    this.tasks.push(task);
    return task;
  }

  byPriority(level) {
    return this.tasks.filter((task) => task.priority === level);
  }

  get(id) {
    return this.tasks.find((task) => task.id === id);
  }

  update(id, changes) {
    const task = this.get(id);
    if (!task) {
      throw new Error(`No task with id ${id}`);
    }
    Object.assign(task, changes);
    return task;
  }

  remove(id) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      return false;
    }
    this.tasks.splice(index, 1);
    return true;
  }

  all() {
    return [...this.tasks];
  }
}
