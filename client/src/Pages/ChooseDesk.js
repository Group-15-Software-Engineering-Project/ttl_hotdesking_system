import React from "react";
import Button from "../Components/Button";

function ChooseDesk() {
  return (
    <>
      <div>
        {" "}
        <h0 style={{ position: "absolute", top: 180, left: 445, fontSize: 50 }}>
          Choose a Location
        </h0>
      </div>

      <div>
        {" "}
        <h1 style={{ position: "absolute", top: 280, left: 440, width: 800 }}>
          {" "}
          <Button type="button" buttonStyle="btn--primary--solid">
            {" "}
            Office 2.5 : West Theatre{" "}
          </Button>
        </h1>
      </div>

      <div>
        {" "}
        <h2
          style={{
            position: "absolute",
            top: 350,
            left: 440,
            width: 800,
            fontSize: 32,
          }}
        >
          {" "}
          <Button type="button" buttonStyle="btn--primary--solid">
            {" "}
            Office 3.2 : West Theatre{" "}
          </Button>
        </h2>
      </div>

      <div>
        {" "}
        <h3
          style={{
            position: "absolute",
            top: 420,
            left: 440,
            width: 800,
            fontSize: 32.2,
          }}
        >
          <Button type="button" buttonStyle="btn--primary--solid">
            {" "}
            Office 3.06 : Foster Place{" "}
          </Button>
        </h3>
      </div>
    </>
  );
}

export default ChooseDesk;
