import test from 'node:test';
import assert from 'node:assert/strict';

import { TaskStore } from '../src/store.js';
import { resetIds } from '../src/task.js';

test('add passes priority through to the model', () => {
  resetIds();
  const store = new TaskStore();
  const task = store.add('Fix the build', 'doing', 'high');

  assert.equal(task.priority, 'high');
});

test('add still defaults priority when it is omitted', () => {
  resetIds();
  const store = new TaskStore();

  assert.equal(store.add('Write notes').priority, 'med');
});

test('byPriority returns only tasks at that level', () => {
  resetIds();
  const store = new TaskStore();
  store.add('Fix the build', 'todo', 'high');
  store.add('Rename a variable', 'todo', 'low');
  store.add('Page the on-call', 'doing', 'high');

  const urgent = store.byPriority('high');
  assert.equal(urgent.length, 2);
  assert.deepEqual(
    urgent.map((task) => task.title),
    ['Fix the build', 'Page the on-call']
  );
});
