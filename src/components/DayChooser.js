import React, { useState } from "react";
import { render } from "react-dom";
import Calendar from "react-calendar";

const DayChooser = () => {
  const [date, setDate] = useState(new Date());

  const onChange = date => {
    setDate(date);
  };

  return (
    <div className="small-calendar">
      <Calendar onChange={onChange} value={date} />
      {date.toString()}
    </div>
  );
};

export default DayChooser