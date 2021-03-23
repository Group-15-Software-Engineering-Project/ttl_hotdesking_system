import React from 'react'
import tcd from'../public/media/tcd.jpg';
import '../public/css/Home.css';
import Bookbutton from '../Components/Bookbutton';
import {Link} from 'react-router-dom';

function Home() {
    return (
        <div className='home Tcd' style={{position: 'absolute', top: 90, right: 8}}>
                <h1  style={{position: 'absolute', top: 140, left: -430,color:"#060b26",fontSize:50}}> Welcome</h1>
                <h2  style={{position: 'absolute', top: 210, left: -460,color:"#060b26",fontSize:50}}> Book a desk </h2>
                <Bookbutton onClick={() => {console.log("You clicked on me!")}} type="button"
            buttonStyle="btn--primary--solid"> <Link to="/chooseDesk">Book</Link> </Bookbutton>
        </div>
    );
}

export default Home
