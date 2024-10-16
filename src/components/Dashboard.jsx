import React from "react";
import { useAppContext } from "../context/AppContext";
import CurrentDateTime from "./CurrentDateTime";

const Dashboard = () => {
  const { employee, attendance, totalHours, clockInOut } = useAppContext();

  const handleClockInOut = () => {
    const newStatus = attendance.status === "out" ? "in" : "out";
    clockInOut(newStatus); // Triggers the clock in/out action in context
  };

  return (
    <div className="mb-8 p-4 bg-customBgBox text-white shadow-md rounded-lg">
      {/* Display current date and time */}
      <CurrentDateTime />{" "}
      <div className="flex flex-col items-center justify-between xs:flex-row xs:items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {employee.name}
          </h1>

          {/* Display employee info */}
          <p className="text-gray-800">Email: {employee.email}</p>
        </div>
        <p className="text-gray-800">
          Status:
          <span className="text-[#003262] font-bold">
            {attendance.status === "in" ? " Clocked In" : " Clocked Out"}
          </span>
        </p>
      </div>
      {/* Clock In/Out button */}
      <button
        onClick={handleClockInOut}
        className={`mt-4 py-2 px-4 w-[110px] rounded ${
          attendance.status === "out"
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-red-500 hover:bg-red-600"
        } text-white`}
      >
        {attendance.status === "out" ? "Clock In" : "Clock Out"}
      </button>
      {/* Display total hours worked today */}
      <p className="mt-2 text-gray-800">
        Total Hours Worked Today:{" "}
        <span className="text-[#003262] font-bold">
          {totalHours?.toFixed(2)} hours{" "}
        </span>
      </p>
    </div>
  );
};

export default Dashboard;
