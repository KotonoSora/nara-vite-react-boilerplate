---
title: "Package @kotonosora/scheduler Background Tasks"
description: "Background task scheduling and job queue management system"
date: "2026-02-22"
published: true
author: "Development Team"
tags: ["scheduler", "background-tasks", "jobs", "queue", "automation"]
---

# @kotonosora/scheduler Background Tasks

## Overview

`@kotonosora/scheduler` provides a robust system for scheduling background tasks, managing job queues, and automating recurring operations across the NARA application.

## Package Information

- **Name**: `@kotonosora/scheduler`
- **Version**: 0.0.1
- **Type**: Utility library
- **Location**: `packages/scheduler/`
- **Dependencies**: None (pure utility)

## Architecture

```
packages/scheduler/
├── src/
│   ├── core/
│   │   ├── Scheduler.ts           # Main scheduler class
│   │   ├── Job.ts                 # Job abstraction
│   │   ├── Queue.ts               # Job queue
│   │   └── Worker.ts              # Job execution
│   │
│   ├── strategies/
│   │   ├── CronStrategy.ts        # Cron scheduling
│   │   ├── TimeoutStrategy.ts     # Delayed execution
│   │   ├── IntervalStrategy.ts    # Repeated intervals
│   │   └── QueueStrategy.ts       # Queue-based
│   │
│   ├── plugins/
│   │   ├── PersistencePlugin.ts   # Save state
│   │   ├── ErrorHandlingPlugin.ts # Error recovery
│   │   ├── RetryPlugin.ts         # Retry failed jobs
│   │   └── LoggingPlugin.ts       # Job logging
│   │
│   ├── utils/
│   │   ├── cronParser.ts          # Parse cron expressions
│   │   ├── taskUtils.ts           # Task utilities
│   │   └── timeUtils.ts           # Time calculations
│   │
│   ├── types/
│   │   └── scheduler.types.ts     # Type definitions
│   │
│   └── index.ts
│
└── package.json
```

## Core Concepts

### Job

A unit of work to be executed:

```typescript
interface Job {
  id: string;
  name: string;
  handler: () => Promise<void> | void;
  schedule: string | number | Date;
  maxRetries: number;
  retryDelay: number;
  timeout: number;
  priority: "low" | "normal" | "high";
  status: "pending" | "running" | "completed" | "failed";
  lastRun?: Date;
  nextRun?: Date;
  result?: any;
  error?: Error;
}
```

### Scheduler

Main scheduler instance managing job lifecycle:

```typescript
const scheduler = new Scheduler({
  maxConcurrentJobs: 5,
  persistState: true,
  storageKey: "nara_scheduler_state",
});
```

### Queue

Job queue for ordered execution:

```typescript
interface Queue {
  add(job: Job): void;
  remove(jobId: string): void;
  process(): Promise<void>;
  clear(): void;
  status(): QueueStatus;
}
```

## Usage Examples

### One-Time Task

Execute a task once after a delay:

```typescript
import { Scheduler } from "@kotonosora/scheduler";

const scheduler = new Scheduler();

// Execute after 5 seconds
scheduler.schedule(
  "send_welcome_email",
  async () => {
    await sendWelcomeEmail(userId);
  },
  { delay: 5000 },
);

// Execute at specific time
scheduler.schedule(
  "daily_report",
  async () => {
    await generateReport();
  },
  { at: new Date("2026-02-22T09:00:00") },
);
```

### Repeated Tasks

Execute task at regular intervals:

```typescript
// Every 5 minutes
scheduler.repeat(
  "check_status",
  async () => {
    await checkApplicationStatus();
  },
  { interval: 300000 }, // 5 minutes in ms
);

// Every 24 hours starting now
scheduler.repeat(
  "daily_cleanup",
  async () => {
    await cleanupOldData();
  },
  { interval: "24h" }, // Human-readable
);
```

### Cron Jobs

Complex scheduling using cron expressions:

```typescript
import { Scheduler } from "@kotonosora/scheduler";

const scheduler = new Scheduler();

// Every morning at 8 AM
scheduler.cron(
  "morning_report",
  async () => {
    const report = await generateReport();
    await sendReport(report);
  },
  "0 8 * * *", // Cron expression
);

// Every Monday at 9 AM
scheduler.cron(
  "weekly_standup_reminder",
  async () => {
    await notifyTeam("Weekly standup in 1 hour");
  },
  "0 9 * * 1", // Monday at 9 AM
);

// Every 15 minutes
scheduler.cron(
  "sync_data",
  async () => {
    await syncData();
  },
  "*/15 * * * *",
);

// Twice daily (9 AM and 5 PM)
scheduler.cron(
  "daily_digest",
  async () => {
    await sendDigest();
  },
  "0 9,17 * * *",
);
```

## Advanced Scheduling

### Retry Policy

```typescript
import { RetryPolicy, Scheduler } from "@kotonosora/scheduler";

const scheduler = new Scheduler();

scheduler.schedule(
  "fetch_external_data",
  async () => {
    const data = await fetchFromAPI();
    return data;
  },
  {
    maxRetries: 3,
    retryDelay: 5000, // Start with 5 seconds
    backoff: "exponential", // Double delay each retry
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt}:`, error);
    },
  },
);
```

### Priority Queue

```typescript
const scheduler = new Scheduler({
  maxConcurrentJobs: 3,
});

// High priority job runs first
scheduler.schedule("urgent_task", urgentTask, { priority: "high" });

// Normal priority
scheduler.schedule("normal_task", normalTask, { priority: "normal" });

// Low priority (runs last)
scheduler.schedule("background_task", backgroundTask, { priority: "low" });
```

### Job Dependencies

```typescript
const scheduler = new Scheduler();

// Job B runs after Job A completes
scheduler
  .schedule("job_a", () => processData())
  .then(() => scheduler.schedule("job_b", () => uploadData()));

// Or using Promise
const jobA = scheduler.schedule("job_a", taskA);
jobA.then(() => {
  scheduler.schedule("job_b", taskB);
});
```

## Real-World Use Cases

### Email Queue

```typescript
import { Scheduler } from "@kotonosora/scheduler";

const emailScheduler = new Scheduler({
  maxConcurrentJobs: 2, // Send 2 emails at a time
  persistState: true,
});

// Queue email for later sending
export function scheduleEmail(email: Email) {
  emailScheduler.schedule(
    `email_${email.id}`,
    async () => {
      await sendEmail(email);
    },
    {
      delay: email.sendAt ? email.sendAt.getTime() - Date.now() : 0,
      maxRetries: 3,
      priority: email.priority || "normal",
    },
  );
}
```

### Data Processing Pipeline

```typescript
import { Scheduler } from "@kotonosora/scheduler";

const dataScheduler = new Scheduler();

async function processDataPipeline(dataId: string) {
  // Step 1: Extract
  await dataScheduler.schedule(`extract_${dataId}`, async () => {
    const data = await extractData(dataId);
    return data;
  });

  // Step 2: Transform (after extract)
  await dataScheduler.schedule(`transform_${dataId}`, async () => {
    const extracted = await getExtractedData(dataId);
    const transformed = transformData(extracted);
    return transformed;
  });

  // Step 3: Load (after transform)
  await dataScheduler.schedule(`load_${dataId}`, async () => {
    const transformed = await getTransformedData(dataId);
    await loadToDatabase(transformed);
  });
}
```

### Maintenance Tasks

```typescript
import { Scheduler } from "@kotonosora/scheduler";

const maintenanceScheduler = new Scheduler();

// Daily cleanup at 2 AM
maintenanceScheduler.cron(
  "daily_cleanup",
  async () => {
    await deleteExpiredSessions();
    await deleteOldLogs();
    await optimizeDatabaseIndexes();
  },
  "0 2 * * *",
);

// Weekly report generation
maintenanceScheduler.cron(
  "weekly_report",
  async () => {
    const report = await generateWeeklyReport();
    await archiveReport(report);
  },
  "0 0 * * 0", // Every Sunday at midnight
);

// Monthly backup
maintenanceScheduler.cron(
  "monthly_backup",
  async () => {
    const backup = await createBackup();
    await uploadToCloud(backup);
  },
  "0 0 1 * *", // First day of month at midnight
);
```

### Cache Management

```typescript
import { Scheduler } from "@kotonosora/scheduler";

const cacheScheduler = new Scheduler();

// Refresh cache every 30 minutes
cacheScheduler.repeat(
  "refresh_cache",
  async () => {
    const freshData = await fetchLatestData();
    updateCache(freshData);
  },
  { interval: "30m" },
);

// Clear expired cache entries every hour
cacheScheduler.repeat(
  "cleanup_cache",
  async () => {
    const expiredKeys = findExpiredCacheKeys();
    expiredKeys.forEach((key) => deleteFromCache(key));
  },
  { interval: "1h" },
);
```

### API Polling

```typescript
import { Scheduler } from "@kotonosora/scheduler";

const pollScheduler = new Scheduler();

// Poll external API every 5 minutes
pollScheduler.repeat(
  "poll_external_api",
  async () => {
    try {
      const data = await fetchExternalAPI();
      await processNewData(data);
    } catch (error) {
      console.error("Poll failed:", error);
      // Retry will happen automatically
    }
  },
  {
    interval: "5m",
    maxRetries: 3,
    backoff: "exponential",
  },
);
```

## Job Management

### Get Job Status

```typescript
const scheduler = new Scheduler();

const job = await scheduler.schedule("my_task", () => doWork());

// Check status
console.log(job.status); // 'pending', 'running', 'completed', 'failed'
console.log(job.nextRun); // Next execution time
console.log(job.lastRun); // Previous execution time
console.log(job.result); // Job result
console.log(job.error); // Error if failed
```

### Cancel Job

```typescript
const scheduler = new Scheduler();

const jobId = scheduler.schedule("my_task", () => doWork());

// Cancel execution
scheduler.cancel(jobId);

// Clear all jobs
scheduler.clear();
```

### List Jobs

```typescript
const scheduler = new Scheduler();

// Get all jobs
const allJobs = scheduler.getJobs();

// Get jobs by status
const pending = scheduler.getJobs({ status: "pending" });
const failed = scheduler.getJobs({ status: "failed" });

// Get jobs by priority
const high = scheduler.getJobs({ priority: "high" });
```

## Event Handling

```typescript
import { Scheduler } from "@kotonosora/scheduler";

const scheduler = new Scheduler();

// Listen to job events
scheduler.on("job:start", (job) => {
  console.log(`Job ${job.name} starting`);
});

scheduler.on("job:complete", (job) => {
  console.log(`Job ${job.name} completed`, job.result);
});

scheduler.on("job:error", (job, error) => {
  console.error(`Job ${job.name} failed:`, error);
});

scheduler.on("job:retry", (job, attempt) => {
  console.log(`Job ${job.name} retrying (attempt ${attempt})`);
});
```

## Persistence

Save scheduler state for recovery:

```typescript
const scheduler = new Scheduler({
  persistState: true,
  storageKey: "scheduler_state",
  storage: localStorage, // or your custom storage
});

// Automatically saves state on job completion
// Loads state on initialization for failed/pending jobs
```

## Cron Expression Reference

| Expression       | Meaning                    |
| ---------------- | -------------------------- |
| `0 0 * * *`      | Daily at midnight          |
| `0 8 * * *`      | Every day at 8 AM          |
| `0 0 * * 0`      | Weekly (Sunday midnight)   |
| `0 0 1 * *`      | Monthly (1st day midnight) |
| `*/30 * * * *`   | Every 30 minutes           |
| `0 */4 * * *`    | Every 4 hours              |
| `0 9-17 * * 1-5` | Weekdays 9 AM-5 PM hourly  |
| `30 2 * * *`     | Daily at 2:30 AM           |

## Performance Tips

1. **Limit concurrent jobs** to avoid overload
2. **Use appropriate intervals** (don't poll too frequently)
3. **Implement backoff** for retries
4. **Monitor job execution** time and failures
5. **Use priority queues** for important tasks
6. **Clean up** completed/failed jobs
7. **Persist state** for critical jobs

## Best Practices

1. **Idempotent tasks**: Jobs should handle duplicate execution safely
2. **Error handling**: Always handle potential errors with retries
3. **Logging**: Log job execution for debugging
4. **Monitoring**: Track job success/failure rates
5. **Timeouts**: Set reasonable timeouts to prevent hanging
6. **Dependencies**: Manage job dependencies clearly
7. **Documentation**: Document cron expressions clearly

---

The scheduler package provides flexible, robust job scheduling for automation and background task management in the NARA ecosystem.
