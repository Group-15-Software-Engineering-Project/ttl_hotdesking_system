import React from "react";
import "../public/css/PillSliderButton.css";
function PillSlider(props) {
    const [state, setState] = React.useState("pill-slider-off");
    const [width, setWidth] = React.useState(0);

    React.useEffect(() => {
        if (props.off && props.on) {
            let off = document.createElement("div");
            off.style.display = "inline-block";
            off.innerHTML = props.off;
            document.body.appendChild(off);
            let offWidth = off.offsetWidth;
            document.body.removeChild(off);

            let on = document.createElement("div");
            on.style.display = "inline-block";
            on.innerHTML = props.on;
            document.body.appendChild(on);
            let onWidth = on.offsetWidth;
            document.body.removeChild(on);
            setWidth(offWidth > onWidth ? offWidth : onWidth);
        }
    }, [props]);
    return (
        <div className="pill-slider-wrapper">
            {props.off && (
                <div className="pill-left-text" style={{ minWidth: `${width}px` }}>
                    {props.off}
                </div>
            )}
            <div
                tabIndex="0"
                className={`pill-slider-button ${state}`}
                onKeyPress={(e) => {
                    if (e.key === "Enter") e.target.click();
                }}
                onClick={(e) => {
                    if (props.onClick) props.onClick(state.includes("off") ? "on" : "off");
                    if (state === "pill-slider-off") setState("pill-slider-on");
                    else setState("pill-slider-off");
                }}
            />
            {props.on && (
                <div className="pill-right-text">
                    <div>{props.on}</div>
                </div>
            )}
        </div>
    );
}

export default PillSlider;
