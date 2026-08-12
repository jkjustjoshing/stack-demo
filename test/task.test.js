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

test('list filters by priority', () => {
  resetIds();
  const service = new TaskService();
  service.add('One', 'todo', 'low');
  service.add('Two', 'todo', 'high');

  const urgent = service.list({ priority: 'high' });
  assert.deepEqual(
    urgent.map((task) => task.title),
    ['Two']
  );
});

test('list sorts high priority first, then by id', () => {
  resetIds();
  const service = new TaskService();
  service.add('Low one', 'todo', 'low');
  service.add('High one', 'todo', 'high');
  service.add('High two', 'todo', 'high');
  service.add('Med one', 'todo', 'med');

  assert.deepEqual(
    service.list().map((task) => task.title),
    ['High one', 'High two', 'Med one', 'Low one']
  );
});

test('summary counts every status and priority', () => {
  resetIds();
  const service = new TaskService();
  service.add('One');
  service.add('Two', 'doing', 'high');

  assert.deepEqual(service.summary(), {
    total: 2,
    todo: 1,
    doing: 1,
    done: 0,
    high: 1,
    med: 1,
    low: 0,
  });
});
