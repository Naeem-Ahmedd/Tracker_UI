import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [employee, setEmployee] = useState({});
  const [attendance, setAttendance] = useState({});
  const [updates, setUpdates] = useState([]);
  const [totalHours, setTotalHours] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  }); // To track hours worked today

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

  const convertMillisecondsToTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  };

  const calculateWorkedHours = (clockInTime, clockOutTime) => {
    const inTime = new Date(clockInTime);
    const outTime = new Date(clockOutTime);
    const diffInMs = outTime - inTime; // difference in milliseconds
    return diffInMs; // return milliseconds
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

    if (clockInTime) {
      if (isSameDay(clockInTime, today)) {
        let totalMilliseconds = attendanceData.totalMilliseconds || 0; // Use milliseconds for total time
        if (!clockOutTime) {
          const workedMilliseconds = calculateWorkedHours(clockInTime, today);
          totalMilliseconds += workedMilliseconds; // add worked time
        } else {
          totalMilliseconds = attendanceData.totalMilliseconds || 0; // if already clocked out, retain total
        }
        setTotalHours(convertMillisecondsToTime(totalMilliseconds)); // convert and set
      } else {
        // Reset logic for different day
        const response = await axios.put("http://localhost:3001/attendance", {
          status: "out",
          clockInTime: null,
          clockOutTime: null,
          totalMilliseconds: 0,
        });
        setAttendance(response.data);
        setTotalHours({ hours: 0, minutes: 0, seconds: 0 });
      }
    } else {
      setTotalHours({ hours: 0, minutes: 0, seconds: 0 }); // No clock in
    }
  };

  const clockInOut = async (status) => {
    const currentTime = new Date();

    if (status === "in") {
      const response = await axios.put("http://localhost:3001/attendance", {
        status: "in",
        clockInTime: currentTime,
        clockOutTime: null,
        totalMilliseconds: attendance.totalMilliseconds || 0,
      });
      setAttendance(response.data);
      setTotalHours(convertMillisecondsToTime(response.data.totalMilliseconds)); // convert and set
    } else {
      const workedMilliseconds = calculateWorkedHours(
        attendance.clockInTime,
        currentTime
      );
      const totalMilliseconds =
        (attendance.totalMilliseconds || 0) + workedMilliseconds;

      const response = await axios.put("http://localhost:3001/attendance", {
        status: "out",
        clockInTime: attendance.clockInTime,
        clockOutTime: currentTime,
        totalMilliseconds: totalMilliseconds,
      });

      setAttendance(response.data);
      calculateTodayHours(response.data);
      setTotalHours(convertMillisecondsToTime(response.data.totalMilliseconds));
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
