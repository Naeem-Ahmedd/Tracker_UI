import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const DailyUpdate = () => {
  const { updates, submitUpdate } = useAppContext();
  const [update, setUpdate] = useState("");

  const handleSubmit = () => {
    if (update.trim() === "") {
      alert("Please enter a daily update.");
      return;
    }
    const newUpdate = { date: new Date().toISOString().split("T")[0], update };
    submitUpdate(newUpdate);
    setUpdate("");
  };

  // Function to filter updates from the last 5 days
  const getLastFiveDaysUpdates = () => {
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5); // Go back 5 days

    // Filter updates that are within the last 5 days
    return updates.filter((u) => {
      const updateDate = new Date(u.date);
      return updateDate >= fiveDaysAgo && updateDate <= today;
    });
  };

  const recentUpdates = getLastFiveDaysUpdates();

  return (
    <div className="mt-8 p-4 bg-customBgBox text-black shadow-md rounded-lg ">
      <h2 className="text-lg font-semibold">Submit Daily Update</h2>
      <textarea
        placeholder="Daily Update"
        value={update}
        onChange={(e) => setUpdate(e.target.value)}
        className="border border-gray-300 p-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 px-4 w-[110px] rounded hover:bg-blue-600"
      >
        Submit
      </button>
      <h2 className="mt-4 text-lg font-semibold">Updates from Last 5 Days:</h2>
      {recentUpdates.length > 0 ? (
        recentUpdates.map((u) => (
          <p key={u.id} className="text-gray-700 mb-1">
            {u.date}: {u.update}
          </p>
        ))
      ) : (
        <p className="text-gray-600">No updates from the last 5 days.</p>
      )}
    </div>
  );
};

export default DailyUpdate;
