# CheckMate

**CheckMate** is a versatile and collaborative task scheduler designed to help users organize tasks across 
different areas of their life, track completion status, and share responsibilities with others. 
With features tailored for flexible scheduling, notifications, and collaboration, 
CheckMate aims to simplify task management for individuals, roommates, and teams. 
The app is built with **React Native** using **Expo** for a smooth, cross-platform experience on both iOS and Android.
Certainly! Here’s an updated section to add near the beginning of the README, with a fitting title and revised explanation:


## About the Name: "CheckMate"


The name **CheckMate** is inspired by a blend of meanings that reflect the app’s purpose. 

In chess, *checkmate* signifies a winning position, which in the context of this app symbolizes "winning" at task management by staying organized and on top of responsibilities. 

Additionally, the name incorporates two key concepts:
- **Check**: Refers to the action of “checking off” tasks, highlighting the app’s function as a comprehensive to-do list where users can track completed items.
- **Mate**: Suggests the collaborative aspect of the app, as tasks can be shared with “mates” or friends who help complete and manage tasks together.

Checkmate is designed as a versatile tool to help users organize, assign, and complete tasks efficiently, whether they are managing tasks individually, with roommates, or as part of a team.

## Overview

CheckMate is ideal for users who want to track recurring and one-time tasks with options for detailed scheduling and collaboration.
The app allows users to:
- **Create collections** to categorize tasks by different areas of responsibility or concern.
- **Share collections** allowing members to participate in staying on top of the tasks.
- **Define recurring schedules** for each task, allowing multiple repetition patterns.
- **Track completion** with detailed logs and optional comments.
- **Assign tasks** to specific people and manage responsibilities within a shared collection.
- **Receive notifications** to ensure tasks are completed on time.

### Key Features

- **Collections**: Users can create collections to organize tasks by categories or projects 
(e.g., household chores, personal projects, or team tasks). 
Collections can be shared with others, allowing group members to collaboratively manage tasks.

- **Flexible Recurrence Options**:
    - Schedule tasks with specific rules, such as:
        - Repeating on a fixed day of the month or week (e.g., every 25th of the month or every Thursday).
        - Repeating based on intervals like every X days, weeks, months, or years.
        - Intervals that adjust according to the last completion date, ideal for maintenance tasks.
    - **Completion Window**: Specify a range of days before a task is due when it can be completed (useful for time-sensitive tasks like paying bills).

- **Assignment and Notifications**:
    - Tasks can be assigned to specific users within a collection.
    - Notifications are sent when a completion window opens, as well as on the due date.
    - Users receive reminders based on task assignment, ensuring everyone is aware of their responsibilities.

- **Task Logs and Comments**:
    - Each task includes a history log showing who completed it and when, as well as when the task was due.
    - Users can add comments on task completion to provide context or additional details.

- **Filtering and Sorting**:
    - View tasks by due date, assigned tasks, or unassigned tasks.
    - Easily see upcoming tasks and overdue items, keeping top-priority tasks visible.

- **Calendar View**:
    - CheckMate includes a dedicated calendar view to visualize upcoming tasks, which keeps important tasks visible while reducing clutter in users’ primary calendars.
    - The calendar view provides a filtering feature to have a better overview of tasks of interest (e.g., tasks that have been assigned to the user and tasks from a specific collection)

## Use Cases

### Household Task Management

CheckMate is ideal for households with roommates who share chores:
- One roommate can create a shared collection for the household.
- Tasks such as cleaning, maintenance, and bill reminders can be added with custom intervals (e.g., “vacuum every week,” “water plants every 5 days,” “pay utilities by the 25th with a 5-day completion window”).
- Members can assign tasks, receive notifications, and track who completed each task, ensuring fair task distribution and transparency.

### Personal Task Tracker

Individuals can use CheckMate to manage personal tasks:
- Create a private collection for car maintenance, with tasks like oil changes every 6 months, insurance payments monthly, and annual inspections.
- Users can also keep track of personal reminders such as file backups or bill payments, all within a separate collection from shared tasks.

### Shared Projects

Teams or small groups can use CheckMate to keep track of collective project tasks:
- Create collections for each project and invite members to contribute.
- Set tasks with deadlines and assign them to individuals, keeping everyone aligned on upcoming work.
- Enable notifications to keep team members aware of deadlines and responsibilities.

## Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/your-username/checkmate.git
    cd checkmate
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the Expo server:
    ```bash
    npx expo start
    ```

4. Scan the QR code with the Expo Go app (available on iOS and Android) to view the app on your device, or use an emulator.

## Technologies Used

- **React Native** and **Expo** for cross-platform mobile development


---

## Final Thoughts

The name **CheckMate** reflects the dual goals of staying on top of tasks (“winning” in task management) and the collaborative support provided by friends or “mates” in shared task lists. It’s a powerful tool for users to organize, assign, and complete tasks—whether in a shared living space, within a team, or for personal projects.