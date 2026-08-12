import test from 'node:test';
import assert from 'node:assert/strict';

import { createTask, formatTask, resetIds } from '../src/task.js';
import { TaskService } from '../src/service.js';

test('createTask rejects an empty title', () => {
  assert.throws(() => createTask('   '), /title is required/);
});

test('formatTask marks completed tasks', () => {
  resetIds();
  const task = createTask('Ship it', 'done');
  assert.equal(formatTask(task), '[x] #1 Ship it');
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
