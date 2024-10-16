import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [employee, setEmployee] = useState({});
  const [attendance, setAttendance] = useState({});
  const [updates, setUpdates] = useState([]);
  const [totalHours, setTotalHours] = useState(0); // To track hours worked today

  useEffect(() => {
    const fetchData = async () => {
      const employeeResponse = await axios.get(
        "http://localhost:3001/employee"
      );
      setEmployee(employeeResponse.data);

      const attendanceResponse = await axios.get(
        "http://localhost:3001/attendance"
      );
      setAttendance(attendanceResponse.data);

      const updatesResponse = await axios.get(
        "http://localhost:3001/dailyUpdates"
      );
      const sortedUpdates = updatesResponse.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setUpdates(sortedUpdates); // Set sorted updates

      // Initialize today's worked hours if already clocked in/out
      calculateTodayHours(attendanceResponse.data);
    };
    fetchData();
  }, []);

  const calculateWorkedHours = (clockInTime, clockOutTime) => {
    const inTime = new Date(clockInTime);
    const outTime = new Date(clockOutTime);
    const diffInMs = outTime - inTime; // difference in milliseconds
    const diffInHours = diffInMs / (1000 * 60 * 60); // convert to hours
    return diffInHours.toFixed(2); // format to 2 decimal places
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const calculateTodayHours = async (attendanceData) => {
    const clockInTime = attendanceData.clockInTime
      ? new Date(attendanceData.clockInTime)
      : null;
    const clockOutTime = attendanceData.clockOutTime
      ? new Date(attendanceData.clockOutTime)
      : null;
    const today = new Date();

    // If clockInTime exists
    if (clockInTime) {
      // Check if the clockInTime is from today
      if (isSameDay(clockInTime, today)) {
        if (!clockOutTime) {
          // Employee is still clocked in, calculate hours from clockInTime to now
          const workedHoursSoFar = calculateWorkedHours(clockInTime, today);
          const totalWorkedHours =
            (attendanceData.totalHours || 0) + parseFloat(workedHoursSoFar);
          setTotalHours(totalWorkedHours);
        } else {
          // Employee has already clocked out, use the stored totalHours
          setTotalHours(attendanceData.totalHours || 0);
        }
      } else {
        // ClockInTime is from a different day, reset values
        const response = await axios.put("http://localhost:3001/attendance", {
          status: "out",
          clockInTime: null,
          clockOutTime: null,
          totalHours: 0,
        });
        setAttendance(response.data);
        setTotalHours(0);
      }
    } else {
      // No clockInTime means no hours worked today, set totalHours to 0
      setTotalHours(0);
    }
  };

  const clockInOut = async (status) => {
    const currentTime = new Date();

    if (status === "in") {
      // Clocking in
      const response = await axios.put("http://localhost:3001/attendance", {
        status: "in",
        clockInTime: currentTime,
        clockOutTime: null, // Reset clockOutTime
        totalHours: attendance.totalHours, // Retain previous total hours
      });
      setAttendance(response.data);
      setTotalHours(response.data.totalHours);
    } else {
      // Clocking out
      const clockInTime = attendance.clockInTime;
      const clockOutTime = currentTime;

      // Calculate worked hours for the day
      const workedHours = calculateWorkedHours(clockInTime, clockOutTime);
      const totalHours = (attendance.totalHours || 0) + parseFloat(workedHours);

      const response = await axios.put("http://localhost:3001/attendance", {
        status: "out",
        clockInTime: attendance.clockInTime,
        clockOutTime: clockOutTime,
        totalHours: totalHours,
      });

      setAttendance(response.data);
      calculateTodayHours(response.data); // Update today’s hours
      setTotalHours(response.data.totalHours);
    }
  };

  const submitUpdate = async (update) => {
    await axios.post("http://localhost:3001/dailyUpdates", update);
    setUpdates((prev) => [update, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        employee,
        attendance,
        updates,
        totalHours,
        clockInOut,
        submitUpdate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
