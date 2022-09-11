// eslint-disable-next-line
import React, { Component } from 'react';
import Dropzone, { IDropzoneProps } from 'react-dropzone-uploader';
import ILayoutProps from 'react-dropzone-uploader';
import "react-dropzone-uploader/dist/styles.css";
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import axios from 'axios';
import login_image from "../images/login_image.jpg"

const UserPoolId = "ca-central-1_hVd1zBClK";
const ClientId = "67mpvg0pkbqdhr30fj8lno8ehb";
const ApiGatewayUrl = 'https://edkchnowzk.execute-api.ca-central-1.amazonaws.com/dev/geturl';

const userPool = new CognitoUserPool({
  UserPoolId: UserPoolId,
  ClientId: ClientId,
});

export default class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      accessToken: '',
      isAuthenticated: false,
      isLoginFailed: false,
    };
  };

  // is used by both login and password reset
  onSuccess = (result) => {
    console.log("onSuccess");
    console.log(result);
    if (result.idToken.jwtToken ) {
        localStorage.setItem('token',result.idToken.jwtToken);
        localStorage.setItem('ExpTime',result.accessToken.payload.exp);

        this.setState({
          accessToken: result.idToken.jwtToken, // the token used for subsequent, authorized requests
          isAuthenticated: true,
          isLoginFailed: false,
        });
        this.props.history.push('/fileUpload')
    }
  };

  // is used by both login and password reset
  onFailure = (error) => {
    console.log("onFailure");
    console.log(error);
    this.setState({
      isAuthenticated: false,
      isLoginFailed: true,
      statusCode: '',
    });
  };

  onSubmit = (event) => {
    event.preventDefault();

    let cognitoUser = new CognitoUser({
      Username: this.state.username,
      Pool: userPool,
    });

    const authenticationDetails = new AuthenticationDetails({
      Username: this.state.username,
      Password: this.state.password,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: this.onSuccess,
        onFailure: this.onFailure,
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          console.log("newPasswordRequired");
          console.log(userAttributes);

          // not interesting for this demo - add a bogus e-mail and append an X to the initial password
          userAttributes['email'] = 'justtesting@email.com';
          cognitoUser.completeNewPasswordChallenge(this.state.password + 'X', userAttributes, this);
        },
    });
  };

  
  
  

  render() {
    return (
      <div>

<div  className="container " >
        {/*          
         {({ signOut, user }) => (
        <div className="App">
          <button onClick={signOut}>Sign out</button>
        </div>
      )} */}
        


        <div className='col-md-25'>
          <div className="card " style={{ padding: "15px " , height:'500px', margin:'170px -40px 0 327px',width:'600px', background:"#d6eef0" }}>
          <h1 style={{color:"#ff8d00" }}>Welcome to MTA Healthcare!</h1>
              <table>
                <tr>
                <td style={{ paddingright: "10px" }}>
                  <form onSubmit={this.onSubmit}>
                    <input className='form-control' type='text' value={this.state.username} onChange={(event) => this.setState({ username: event.target.value })} placeholder='username' /><br />
                    <input className='form-control' type='password' value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })} placeholder='password' /><br />
                    <input className='btn btn primary'style={{ marginLeft: "50px", background:"#ff8d00" }} type='button' onClick={this.onSubmit} value='LOGIN' />
                  </form>
                  <p style={{ color: 'red', display: this.state.isLoginFailed ? 'block' : 'none' }}>Invalid Username or Password</p>

                </td>
                <td>
                  <img src={login_image} height="350px" width="220px" style={{ marginLeft: "150px",marginTop: "30px" }} />
                </td>
                
                </tr>

              </table>
          
        

 </div>

          </div>
        </div>
      </div>
      
           
      
    );
  };
};

