import React from 'react';
import '../public/css/App.css';
import '../public/css/Bookbutton.css';

const STYLES =[
    "btn--primary--solid",
    "btn--warning--solid",
    "btn--danger--solid",
    "btn--success--solid",
    "btn--primary--outline",
    "btn--warning--outline",
    "btn--danger--solid",
    "btn--success--solid",
];

const SIZES =["btn--medium", "btn--small"];

export const Bookbutton=({
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize
}) =>{
   
   const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];

   const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

    return (
   <button className={"btn ${checkButtonStyle} ${checkButtonSize}"} onClick={onClick} type={type} style={{position: 'absolute', top: 300, right: 900}}>
        {children }
    </button>);
};

export default Bookbutton;
