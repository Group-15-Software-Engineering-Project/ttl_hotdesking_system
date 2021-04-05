import React, { Component } from "react";
import "../public/css/main.css";

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
          email: props.email,
        };
      }
    
      render() {
        return (
          <div className="wrapper TCD-BG">
            <div className="flex-container-1" />
            <div className="flex-container-5 main-body">
              <div className="space" />
              <h1 className="page-divider-header" style={{ marginLeft: "2.5%" }}>
                Admin
              </h1>
              <div className="space" />
              <h2
                style={{
                  textAlign: "left",
                  marginLeft: "5%",
                  textDecoration: "underline",
                }}
              >
               #TO-DO - Add restrictions
              </h2>
              <div className="space" />
              <div />
            </div>
    
            <div className="flex-container-1" />
          </div>
        );
      }
    }

export default Admin
