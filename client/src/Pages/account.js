import React, {Component} from 'react';
import account from './account.json';
import '../public/css/Account.css';
import accountPic from '../public/media/accountPic.png'
import user from '../Components/User'



class Account extends Component {
 render() {
    return (
    
        <div>
        {account.map((accountDetail, index)=>{
           return <div className='account pic' style={{position: 'absolute', top: 130, right: 600}}>
            <h0 style={{position: 'absolute', top: 180, left: -150,color:"#060b26",fontSize:50}}>First Name :</h0>
            <h1 style={{position: 'absolute', top: 180, left: 120,color:"#060b26",fontSize:50}}>{accountDetail.firstName}</h1>
            <h0 style={{position: 'absolute', top: 240, left: -150,color:"#060b26",fontSize:50}}>Last Name :</h0>
            <h2 style={{position: 'absolute', top: 240, left: 120,color:"#060b26",fontSize:50}}>{accountDetail.lastName}</h2>
            <h7 style={{position: 'absolute', top: 300, left: -150,color:"#060b26",fontSize:50}}>ID :</h7>
            <h3 style={{position: 'absolute', top: 300, left: 120,color:"#060b26",fontSize:50}}>{accountDetail.ID}</h3>
            <h8 style={{position: 'absolute', top: 360, left: -150,color:"#060b26",fontSize:50}}>Email :</h8>
            <h4 style={{position: 'absolute', top: 360, left: 120,color:"#060b26",fontSize:50}}>{accountDetail.EmailID}</h4></div>
        })}
        </div>
    )
}
}


export default Account
