# Campus Notifications Microservice

This repository contains the solution for the Frontend Track of the Campus Notifications Microservice.

## Repository Structure

- `logging_middleware/`: Reusable Node.js package for handling evaluation server authentication and asynchronous logging.
- `notification_app_fe/`: Next.js Web Application providing the main user interface.
- `notification_app_be/`: Empty directory for backend track structure compliance.
- `notification_system_design.md`: Markdown document detailing the priority queue algorithm and time complexities for handling real-time incoming notification streams.
- `stage1.js`: Standalone script for testing the priority-based sorting logic against the evaluation server.

## Features
- **All Notifications Dashboard**: Displays notifications with client-side pagination and type-based filtering.
- **Priority Inbox**: Implements a min-heap inspired priority sorting algorithm (`Placement` > `Result` > `Event`) breaking ties by recency to show the top 'n' most critical unread notifications.
- **State Management**: Persists read/unread states locally.
- **Logging Integration**: Intercepts user interactions (filters, clicks, page mounts) and logs them asynchronously to the evaluation service strictly within payload constraints.
- **Responsive UI**: Built with Material UI featuring glassmorphic designs, CSS transitions, gradients, and subtle hover animations for a premium look and feel.

## Getting Started

1. Set up the `.env.local` inside `notification_app_fe` with your API credentials.
2. Run `npm install` inside `notification_app_fe`.
3. Run `npm run dev` to start the frontend.
