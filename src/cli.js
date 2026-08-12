#!/usr/bin/env node
// Layer 4: the user-facing surface. Depends on everything below it.

import { TaskService } from './service.js';
import { formatTask } from './task.js';

const USAGE = `Usage: task <command> [args]

Commands:
  add <title>        Add a new task
  list               List all tasks
  done <id>          Mark a task complete
  summary            Show counts by status
`;

function run(argv) {
  const [command, ...args] = argv;
  const service = new TaskService();

  // Seed data so the demo prints something interesting.
  service.add('Write the design doc');
  service.add('Review the API changes', 'doing');
  service.add('Ship the release', 'done');

  switch (command) {
    case 'add': {
      const task = service.add(args.join(' '));
      console.log(`Added ${formatTask(task)}`);
      break;
    }
    case 'list': {
      for (const task of service.list()) {
        console.log(formatTask(task));
      }
      break;
    }
    case 'done': {
      const task = service.complete(Number(args[0]));
      console.log(`Completed ${formatTask(task)}`);
      break;
    }
    case 'summary': {
      const counts = service.summary();
      console.log(
        `total=${counts.total} todo=${counts.todo} doing=${counts.doing} done=${counts.done}`
      );
      break;
    }
    default:
      console.log(USAGE);
  }
}

run(process.argv.slice(2));
