import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

import Dashboard from '../Dashboard/Dashboard';
import Register from '../Register/Register';
import userService from '../../services/';

const url = 'http://localhost:5000/api';

const AuthTest = () => (
  <Router>
    <div>
      <AuthButton />
      <ul>
        <li>
          <Link to="/public">Public Page</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
      <Route path="/public" component={Public} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
    </div>
  </Router>
);

const userAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const AuthButton = withRouter(
  ({ history }) =>
    userAuth.isAuthenticated ? (
      <p>
        Welcome!{" "}
        <button
          onClick={() => {
            userAuth.signout(() => history.push("/"));
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
        <p>You are not logged in.</p>
      )
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      userAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
    }
  />
);

const Public = () => <h3>Public</h3>;
// const Protected = () => <h3>Protected</h3>;

class Login extends Component {
  // state = {
  //   redirectToReferrer: false;
  // };
  constructor() {
    super();
    this.state = {
      users: [],
      username: '',
      password: '',
      redirectToReferrer: false,
    }
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  login = (event) => {
    event.preventDefault();
    const user_data = {
      username: this.state.username,
      password: this.state.password,
    }
    const request = new Request(`${url}/login`, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(user_data),
      // data: `{
      //   userInfo(login: "${this.props.username}")`
    });
    fetch(request)
      .then(response => {
        console.log(`post was successful: ${response}`);
        this.setState({
          username: '',
          password: '',
        })
        if (response.status === 200) {
          console.log(`success:  ${response}`);
          console.log(`user_data: ${user_data}`);
          console.log("username: ", this.state.username);
          // this.props.history.push('/home');
          // userAuth.authenticate((event) => {
          //   this.setState({ redirectToReferrer: true });
          // })
        } else {
          console.log(`failure error: ${response}`);
        }
      },
    ).catch(error => console.log(`Fetch failed on addUsers Post: ${error}`)
    )
  };
  // Handler for username input
  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value
    });
  }

  // Handler for password input
  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value
    });
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;
    const { username, password, submitted } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <form onSubmit={this.login}>
          <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
            <label>Username:
                    <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
            </label>
            {submitted && !username &&
              <div className="help-block">Username is required</div>}
          </div>
          <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
            <label>Password:
                    <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
            </label>
            {submitted && !password &&
              <div className="help-block">Password is required</div>}
          </div>
          <button>Login</button>
        </form>
        <Link to="/register">Register for an account</Link>
        {/* <button onClick={this.login}>Log in</button> */}
      </div>
    );
  }
}

export default AuthTest;