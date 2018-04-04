import React, { Component } from 'react';

const url = 'http://localhost:5000/api';

class Register extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
        }
        this.registerUser = this.registerUser.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleUsernameChange = (event) => {
        this.setState({
            username: event.target.value
        });
    }

    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value
        });
    }

    registerUser(event) {
        event.preventDefault();
        const user_data = {
            username: this.state.username,
            password: this.state.password,
        }
        const request = new Request(`${url}/register`, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(user_data)
        });
        fetch(request)
            .then(response => {
                // console.log(`post was successful: ${response}`);
                this.setState({
                    username: '',
                    password: '',
                });
            })
            .catch(error => console.log(`Fetch failed on registerUser Post: ${error}`)
            )
    }

    render() {
        return (
            // const Register = () => (
            <div>
                <h2>Sign up to for an account below</h2>
                <form onSubmit={this.registerUser}>
                    <label>Username:
                    <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
                    </label>
                    <label>Password:
                    <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
                    </label>
                    <button>Register</button>
                </form>
            </div>
        )
    }
}

export default Register;