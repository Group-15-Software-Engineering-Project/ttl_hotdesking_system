import React from 'react'
import emailjs from 'emailjs-com'

export default function ConfirmationEmail() {

  
    // this.state = {
    //     currentDateTime: Date().toLocaleString()
    // }
      
    var currentDateTime = "Sun May 24 2020 09:59:56 GMT+0530 (India Standard Time)"
    //service_v5sua9l
    function sendEmail(e) {
        e.preventDefault();
        console.log(e);
        emailjs.sendForm('service_v5sua9l', 'template_s13j1oi', e.target, 'user_Hcgw9XLPLBz7iL1Bm4Tq6')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
        e.target.reset()
    }
    /*
    Hi {{{to_name}}},

    The following booking has been confirmed:
    Seat Number: {{seat_number}}
    Booking Location: {{{booking_location}}}
    Date and Time:{{{date_time}}}
    */


    return (
        <form className="contact-form" onSubmit={sendEmail}>
          <input type="hidden" name="contact_number" />
          <input type="hidden" name="to_name"/>
          <label>Email</label>
          <input type="email" name="to_email" />
          
          <input type="hidden" name="seat_number"/>
          <input type="hidden" name="booking_location" />
          <input type="hidden" name="date_time" /> 
   
          <input type="submit" value="Send" />
        </form>
    );
}

{/* <form className="contact-form" onSubmit={sendEmail}>
<input type="hidden" name="contact_number" />
<input type="hidden" name="to_name" value= "Johnny boy"/>
<label>Email</label>
<input type="email" name="to_email" />

<input type="hidden" name="seat_number" value= "19"/>
<input type="hidden" name="booking_location" value= "Foster Place"/>
<input type="hidden" name="date_time" value= '${currentDateTime}'/> 

<input type="submit" value="Send" />
</form> */}