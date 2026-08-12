#!/usr/bin/env node
// Layer 4: the user-facing surface. Depends on everything below it.

import { TaskService } from './service.js';
import { formatTask } from './task.js';

const USAGE = `Usage: task <command> [args]

Commands:
  add <title> [--priority <low|med|high>]   Add a new task
  list                                      List all tasks, urgent first
  top                                       List only high priority tasks
  done <id>                                 Mark a task complete
  summary                                   Show counts by status and priority
`;

// Pulls "--priority high" out of the args and returns the rest as the title.
function extractPriority(args) {
  const flag = args.indexOf('--priority');
  if (flag === -1) {
    return { priority: undefined, rest: args };
  }
  return {
    priority: args[flag + 1],
    rest: [...args.slice(0, flag), ...args.slice(flag + 2)],
  };
}

function run(argv) {
  const [command, ...args] = argv;
  const service = new TaskService();

  // Seed data so the demo prints something interesting.
  service.add('Write the design doc', 'todo', 'low');
  service.add('Review the API changes', 'doing', 'high');
  service.add('Ship the release', 'done', 'med');

  switch (command) {
    case 'add': {
      const { priority, rest } = extractPriority(args);
      const task = service.add(rest.join(' '), 'todo', priority);
      console.log(`Added ${formatTask(task)}`);
      break;
    }
    case 'top': {
      for (const task of service.list({ priority: 'high' })) {
        console.log(formatTask(task));
      }
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
      console.log(`high=${counts.high} med=${counts.med} low=${counts.low}`);
      break;
    }
    default:
      console.log(USAGE);
  }
}

run(process.argv.slice(2));
