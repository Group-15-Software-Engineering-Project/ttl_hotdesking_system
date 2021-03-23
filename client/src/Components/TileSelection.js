import React from "react";
import "../public/css/RadioTile.css";
import PropTypes from "prop-types";

TileSelection.propTypes = {
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  options: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string,
      value: PropTypes.string,
      desc: PropTypes.string,
    })
  ).isRequired,
  size: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func,
};

export default function TileSelection(props) {
  const [chosenOption, setChosenOption] = React.useState("");

  const getAllTiles = () => {
    let tiles = [];
    let options = props.options;
    for (let i in options) {
      tiles.push(
        <div key={options[i].id}>
          <input
            type="radio"
            checked={chosenOption === options[i].value}
            id={options[i].id}
            value={options[i].value}
            onChange={(e) => {
              console.log(chosenOption);
              setChosenOption(e.target.value);
              props.onSelect(e.target.value);
            }}
            className="hide-input"
          />
          <label htmlFor={options[i].id}>
            <div
              className={
                chosenOption === options[i].value
                  ? "radioTile-checked"
                  : "radioTile"
              }
              style={{
                width: props.size[0] + " !important",
                height: props.size[1],
              }}
            >
              <h1 style={{ fontSize: "18px", width: props.size[0] }}>
                {options[i].value}
              </h1>
              <span style={{ fontSize: "12px" }}>{options[i].desc}</span>
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
