import React, { Component } from 'react';

const url = 'http://localhost:5000/api';

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
          username: '',
        }
      }



    userInfo() {
        fetch(`${url}/dashboard`)
            .then(response => response.json())
            //     if (response.userInfo) {
            //         const { userInfo } = this.username;
            //         console.log('userInfo: ', this.userInfo);
            //     }
            // })
            .then(userInfo => {
                console.log(userInfo);
                this.setState({
                    users: userInfo
                });
            })
            .catch(error => console.log(`Error with Fetch getUsers: ${error}`));
    }

    componentDidMount() {
        console.log('component has mounted');
        this.userInfo();
    }

    render() {
        return (
            <div>
                <h2>Welcome</h2>
            </div>
        );
    }
}


export default Dashboard;