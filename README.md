# ClockIn: Your Daily Work Tracker

This application is designed as an easy-to-use web interface for employees to keep track of their attendance and submit daily updates.

## 💻 How to clone & run this project ?

To run this project locally, follow these steps:

1. Clone the repository:
   
   ```bash
   git clone https://github.com/Naeem-Ahmedd/Tracker_UI.git
   ```
2. Navigate to the project directory:
   
   ```bash
   cd tracker-ui
   ```
3. Install dependencies
   
   ```bash 
   npm install
   ```
4. Start the frontend development server

    ```bash 
   npm run dev
   ```
5.  Open your web browser and visit http://localhost:5173 to access the app or click the link provided in the terminal after starting frontend development server.

### Core Features

1. **Dashboard**
   - Display the current date and time.
   - Show employee name and basic info (assumed logged-in user).
   - Quick access to main features (Clock In/Out, Daily Update).

2. **Attendance Tracking**
   - "Clock In" and "Clock Out" buttons.
   - Display current status (Clocked In/Out).
   - Show total hours worked for the current day.

3. **Daily Update**
   - Text area for employees to submit a brief daily update.
   - Display previous updates (last 5 days).

### Any Assumptions

1. **Assumed logged-in user**

## What I Would Improve with More Time

1. **Timesheet Feature**: 
   - Implement a comprehensive timesheet system that allows employees to log hours worked on different projects.

2.  **Date and Time Formatting Libraries**: 
    - Utilize libraries such as **date-fns** or **moment.js** to format and manipulate date and time more efficiently.

3.  **Enhanced Responsiveness**: 
    - Implement additional utility classes from Tailwind CSS to support more breakpoints and enhance the responsiveness of the application.
