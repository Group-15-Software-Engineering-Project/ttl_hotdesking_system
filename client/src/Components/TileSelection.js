import React from "react";
import "../public/css/RadioTile.css";
import PropTypes from "prop-types";

TileSelection.propTypes = {
    title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    options: PropTypes.arrayOf(
        PropTypes.exact({
            value: PropTypes.string,
            label: PropTypes.any,
            disabled: PropTypes.bool,
        })
    ).isRequired,
    size: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelect: PropTypes.func,
    showLabel: PropTypes.bool,
};

export default function TileSelection(props) {
    const [chosenOption, setChosenOption] = React.useState("");

    const getAllTiles = () => {
        let tiles = [];
        let options = props.options;
        for (let i in options) {
            tiles.push(
                <div key={options[i].value + props.elementID}>
                    <input
                        type="radio"
                        tabindex="-1"
                        checked={chosenOption === options[i].value}
                        id={options[i].value + props.elementID}
                        disabled={options[i].disabled}
                        value={options[i].value}
                        onChange={(e) => {
                            setChosenOption(e.target.value);
                            if (props.onSelect) props.onSelect(e.target.value);
                        }}
                        className="hide-input"
                    />
                    <label htmlFor={options[i].value + props.elementID}>
                        <div
                            tabIndex={
                                options[i].disabled || options[i].value === chosenOption
                                    ? "-1"
                                    : 0
                            }
                            onKeyPress={(e) => {
                                if (e.key === "Enter") e.target.click();
                            }}
                            className={
                                options[i].disabled
                                    ? "radioTile-disabled"
                                    : chosenOption === options[i].value
                                    ? "radioTile-checked"
                                    : "radioTile"
                            }
                            style={{
                                width: props.size[0] + " !important",
                                maxWidth: props.size[0] + " !important",
                                height: props.size[1],
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: " ellipsis !important",
                            }}>
                            <h1 style={{ fontSize: "18px", width: props.size[0] }}>
                                {options[i].value}
                            </h1>
                            {props.showLabel &&
                            options[i].label &&
                            options[i].label.length !== 0 ? (
                                <span
                                    style={{
                                        fontSize: "12px",
                                        margin: "0px",
                                        color: "#222",
                                        fontWeight: "bold",
                                    }}>
                                    {options[i].label}
                                </span>
                            ) : null}
                        </div>
                    </label>
                </div>
            );
        }
        return tiles;
    };
    return (
        <>
            {props.title}
            <div className="tile-container-row">{getAllTiles().map((x) => x)}</div>
        </>
    );
}
