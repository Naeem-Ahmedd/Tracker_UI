import React from "react";
import { AppProvider } from "./context/AppContext";
import Dashboard from "./components/Dashboard";
import DailyUpdate from "./components/DailyUpdate";

const App = () => {
  return (
    <AppProvider>
      <div className="bg-customBg text-white min-h-screen">
        <div className="p-4 max-w-2xl mx-auto ">
          <h1 className="text-center text-2xl font-bold pb-4 font-poppins">
            ClockIn: Your Daily Work Tracker
          </h1>
          <Dashboard />
          <DailyUpdate />
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
