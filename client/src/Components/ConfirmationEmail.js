import React from "react";
import emailjs from "emailjs-com";

export default function ConfirmationEmail(email, desk_num, room, date, am, pm, time) {

  var templateParameters = {
    to_email: email,
    seat_number: desk_num,
    booking_location: room,
    date: date,
    time_first: "9:00" === time.split(" ")[0] ? "9:00" : "1:30",
    time_second: "13:00" === time.split(" ")[2] ? "1:00" : "5:30",
    am_pm_1: "9:00" === time.split(" ")[0] ? "am" : "pm",
    am_pm_2: "pm",
  };

  function sendEmail(e) {

    console.log(e);

    //emailjs.send('service_v5sua9l', 'template_jym7drh', e, 'user_Hcgw9XLPLBz7iL1Bm4Tq6')
    emailjs.send("service_r50ifu8", "template_jym7drh", e, "user_XvsnLDmMIB7ZBM1jhkEnR").then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
  }

  sendEmail(templateParameters);

  return (
    <div />
    // <form className="contact-form" onSubmit={sendEmail}>

    //   <input type="hidden" name ="email" />
    //   <input type="hidden" name="to_name" value= "${email}"/>
    //   <input type="email" name="to_email" />

    //   <input type="hidden" name="seat_number"/>
    //   <input type="hidden" name="booking_location" />
    //   <input type="hidden" name="date_time" />

    //   <input type="submit" value="Send" />
    // </form>
  );
}
