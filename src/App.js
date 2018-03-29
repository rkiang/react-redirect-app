import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

// pages
import Login from './Pages/Login/Login';

class App extends Component {
  render() {
    return (
      <div className="App">
      <Router>
          <div className="Links">
            <ul>
              <li><Link to='/'>Login</Link></li>
            </ul>
            <Switch>
              <Route exact path='/' component={Login} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
