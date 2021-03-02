import "./App.css";
import BookingPage from "./pages/BookingPage";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import tempHomePage from "./pages/tempHomePage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTitle: "",
    };
  }

  render() {
    return (
      <>
        <Router>
          <Sidebar currentPageTitle={this.state.pageTitle} />
          <Switch>
            <Route path="/home" exact component={tempHomePage}></Route>
            <Route path="/booking-page">
              <BookingPage
                getPageTitle={(e) => {
                  if (e !== this.state.pageTitle) {
                    this.setState({ pageTitle: e });
                  }
                }}
              />
            </Route>
          </Switch>
          <footer className="header">FOOTER</footer>
        </Router>
      </>
    );
  }
}

export default App;
