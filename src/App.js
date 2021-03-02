import './App.css';
import Navbar from './components/Navbar'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Home from './pages/Home.js'
import Reports from './pages/Reports.js'
import Desks from './pages/Desks.js'

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/reports' component={Reports} />
          <Route path='/desks' component={Desks} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
