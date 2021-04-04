import React from 'react'
import emailjs from 'emailjs-com'

export default function ConfirmationEmail(email, desk_num, room, date, am, pm) {

    console.log("sup");
    var templateParameters = {
        to_email: email,
        seat_number: desk_num, 
        booking_location: room, 
        date_time: date, 
        am_pm: (am == true) ? "am" : "pm" 
    }

    function sendEmail(e) {
        console.log("haha");
        //e.preventDefault();
        console.log(e);

        //emailjs.send('service_v5sua9l', 'template_jym7drh', e, 'user_Hcgw9XLPLBz7iL1Bm4Tq6')
        emailjs.send('service_r50ifu8', 'template_jym7drh', e, 'user_XvsnLDmMIB7ZBM1jhkEnR')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
        //e.target.reset()
        console.log("hehe");
    }



    sendEmail(templateParameters);
    /*
    Hi {{{to_name}}},

    The following booking has been confirmed:
    Seat Number: {{seat_number}}
    Booking Location: {{{booking_location}}}
    Date and Time:{{{date_time}}}

    //email, desk_num, room, date, am, pm
    */


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

