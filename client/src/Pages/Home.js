import React, { Component } from 'react'
import tcd from'../public/media/tcd.jpg';
import image1 from'../public/media/landing_page_images/image1.jpg';
import image2 from'../public/media/landing_page_images/image2.jpg';
import image3 from'../public/media/landing_page_images/image3.jpg';
import image4 from'../public/media/landing_page_images/image4.jpg';
import image5 from'../public/media/landing_page_images/image5.jpg';
import '../public/css/Home.css';
import Bookbutton from '../Components/Bookbutton';
import {Link} from 'react-router-dom';
//import {Header} from '../Components/Header';


class Home extends Component {
    render() {
        return (
            <div className="home b" >
                <img src={image5} />
            </div>
            
    )};
}

export default Home

//<img src={image5} justify-content= "center" align-items= "center"/>

// <div>
// <div className='image2' style={{position: 'absolute', top: '50%', left: '50%'}}>
//     <img src={require('../public/media/landing_page_images/image1.jpg')} />
//     <h1  style={{position: 'absolute', top: 140, left: -430,color:"#060b26",fontSize:50}}> Welcome</h1>
//     <h2  style={{position: 'absolute', top: 210, left: -460,color:"#060b26",fontSize:50}}> Book a desk </h2>
//     <Bookbutton onClick={() => {console.log("You clicked on me!")}} type="button"
//     buttonStyle="btn--primary--solid"> <Link to="/booking-page">Book</Link> </Bookbutton>
// </div>
// </div>

