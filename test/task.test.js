import test from 'node:test';
import assert from 'node:assert/strict';

import { createTask, formatTask, resetIds } from '../src/task.js';
import { TaskService } from '../src/service.js';

test('createTask rejects an empty title', () => {
  assert.throws(() => createTask('   '), /title is required/);
});

test('createTask rejects an unknown priority', () => {
  assert.throws(() => createTask('Ship it', 'todo', 'urgent'), /Unknown priority/);
});

test('createTask defaults to medium priority', () => {
  resetIds();
  assert.equal(createTask('Ship it').priority, 'med');
});

test('formatTask marks completed tasks and shows priority', () => {
  resetIds();
  const task = createTask('Ship it', 'done', 'high');
  assert.equal(formatTask(task), '[x] #1 Ship it (high)');
});

test('list filters by status', () => {
  resetIds();
  const service = new TaskService();
  service.add('One');
  service.add('Two', 'done');

  assert.equal(service.list({ status: 'done' }).length, 1);
  assert.equal(service.list().length, 2);
});

test('summary counts every status', () => {
  resetIds();
  const service = new TaskService();
  service.add('One');
  service.add('Two', 'doing');

  assert.deepEqual(service.summary(), { total: 2, todo: 1, doing: 1, done: 0 });
});
