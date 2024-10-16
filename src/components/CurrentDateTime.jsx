import React, { useEffect, useState } from "react";

const CurrentDateTime = () => {
  const [current, setCurrent] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(new Date());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };
  return (
    <div className="mb-8 p-4 bg-white text-[#003262] font-bold shadow-md rounded-lg text-center">
      <p>{formatDateTime(current)}</p>
    </div>
  );
};

export default CurrentDateTime;
