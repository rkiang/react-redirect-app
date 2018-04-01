import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

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
          <Link to="/protected">Protected Page</Link>
        </li>
      </ul>
      <Route path="/public" component={Public} />
      <Route path="/login" component={Login} />
      <PrivateRoute path="/protected" component={Protected} />
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
const Protected = () => <h3>Protected</h3>;

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

  login = () => {
    userAuth.authenticate((event) => {
      event.preventDefault();
      const user_data = {
        username: this.state.username,
        password: this.state.password,
      }
      const request = new Request(`${url}/login`, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(user_data)
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
            // this.props.history.push('/home');
          } else {
            console.log(`failure error: ${response}`);
          }
        },
      ).catch(error => console.log(`Fetch failed on addUsers Post: ${error}`)
      )
      this.setState({ redirectToReferrer: true });
    });
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

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <form onSubmit={this.login}>
          <label>Username:
                    <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
          </label>
          <label>Password:
                    <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
          </label>
          <button>Login</button>
        </form>
        {/* <button onClick={this.login}>Log in</button> */}
      </div>
    );
  }
}

export default AuthTest;