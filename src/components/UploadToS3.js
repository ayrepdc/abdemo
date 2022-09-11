// eslint-disable-next-line
import React, { Component } from 'react';
import Dropzone, { IDropzoneProps } from 'react-dropzone-uploader';
import ILayoutProps from 'react-dropzone-uploader';
import "react-dropzone-uploader/dist/styles.css";
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import axios from 'axios';
import Files from 'react-files'
import logo from '../images/logo.png'
import { Recorder } from 'react-voice-recorder';
import moment from 'moment'
import swal from 'sweetalert'
import Recordaudio from './recordaudio';
import { Redirect } from 'react-router';
const UserPoolId = "ca-central-1_hVd1zBClK";
const ClientId = "67mpvg0pkbqdhr30fj8lno8ehb";
const ApiGatewayUrl = 'https://edkchnowzk.execute-api.ca-central-1.amazonaws.com/dev/geturl';

const userPool = new CognitoUserPool({
  UserPoolId: UserPoolId,
  ClientId: ClientId,
});

export default class fileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      accessToken: localStorage.getItem('token'),
      isAuthenticated: localStorage.getItem('token'),
      isLoginFailed: false,
      img_preview: '',
    };
  };

  // this.getTime();
  componentDidMount() {
    const intervalId = setInterval(() => {
      if (moment().format('YYYY-MM-DD HH:mm') > moment.unix(localStorage.getItem('ExpTime')).format('YYYY-MM-DD HH:mm')) {
        this.signOut();
      }

    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.getTime);
  }
  getTime = () => {

  }

  handleChangeStatus = ({ meta }, status) => {
    console.log(status, meta)
  };

  onFilesSucces = (files) => {
    this.setState({
      file: files[0],
      img_preview: URL.createObjectURL(files[0]),
    })
  }
  clear = () => {
    this.setState({
      file: "",
      img_preview: '',
    })
  }

  handleSubmit = async () => {

    // * GET request: presigned URL
    const response = await axios({
      method: "GET",
      url: ApiGatewayUrl,
      headers: {
        Authorization: this.state.accessToken,
      },
    });

    console.log("Response: ", response.data.body);

    // * PUT request: upload file to S3
    const result = await fetch(response.data.body, {
      method: "PUT",
      body: this.state.file,
    })
      .then((res) => {
        // alert("submit succes")
        swal("File is uploaded succesfully!", "", "success");
      }).catch((err) => {
        console.log("err", err);
        throw "ERROR AFTER THEN";
      });
    console.log("Result: ", result);
  };

  Layout = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }: ILayoutProps) => {
    return (
      <div>
        {previews}

        <div {...dropzoneProps}>{files.length < maxFiles && input}</div>

        {files.length > 0 && submitButton}
      </div>
    )
  };

  signOut = () => {
    localStorage.clear();
    this.props.history.push('/')
  }

  onFilesError = () => {

  }



  render() {
    const location = {
      pathname: '/',
    }

    return (
      <div className="container " >
        {!this.state.accessToken &&
          <Redirect to={location} />
        }
        {/*          
         {({ signOut, user }) => (
        <div className="App">
          <button onClick={signOut}>Sign out</button>
        </div>
      )} */}
        <div className="header">
          <img src={logo} className="logo" height={'50px'} width={"100px"} />
          <div className="header-right">
            <button type='button' className='btn btn primary p-5' style={{ float: 'right' }} onClick={this.signOut}>Sign out</button>
          </div>
        </div>



        <div className='col-md-12'>
          {/* <div className="card custom2" style={{ display: this.state.isAuthenticated ? 'block' : 'none', padding: "15px ", height: '150px' }}>


            <div className="files">
              <Files
                className='files-dropzone'
                onChange={this.onFilesSucces}
                onError={this.onFilesError}
                accepts={['.mp4', '.mp3']}
                maxFileSize={10000000}
                minFileSize={0}
                clickable
              >
                {this.state.img_preview ?
                  <video width="320" height="80" controls>
                    <source src={this.state.img_preview} type="video/mp4" />
                    <source src={this.state.img_preview} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                  : <>

                    <span style={{ border: '1px solid black', marginTop: "15px" }}>   Drop files here or click to upload </span>
                  </>}

              </Files>  <div className="row">
                <div className="col-sm-6"> </div>
                <div className="col-sm-5" style={{ float: "right" }}>
               {this.state.file &&  <button type="button" className={`btn btn primary mb-5 `} disabled={!this.state.file} onClick={this.clear}> remove</button> }

                  <button type="button" className={`btn btn primary mb-5 ${this.state.file ? 'uploadOut' : 'uploadIN'}`} disabled={!this.state.file} onClick={this.handleSubmit}>Upload</button>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div className="row ">
          <div className="col-sm-6 margenTop">
            <div className="card custom2" style={{ display: this.state.isAuthenticated ? 'block' : 'none', background:"#212121",  padding: "15px ", height: '400px', margin: '29px 0 0 23px ' }}>
              <div className="files">
                <Files
                  className='files-dropzone'
                  onChange={this.onFilesSucces}
                  onError={this.onFilesError}
                  accepts={['.mp4', '.mp3']}
                  maxFileSize={10000000}
                  minFileSize={0}
                  clickable
                >
                  {this.state.img_preview ?
                    <div className='box'>
                      <span style={{ position: " relative", top: "87px" }}>
                        <video width="320" height="80" controls>
                          <source src={this.state.img_preview} type="video/mp4" />
                          <source src={this.state.img_preview} type="video/ogg" />
                          Your browser does not support the video tag.
                        </video>
                      </span>
                    </div>
                    : <>
                      <div className='box text-light'>
                        <span className='text-light h3' style={{ position: " relative", top: "87px", color: 'white' }}>
                          Drop files here or click to upload
                        </span>
                      </div>
                    </>}

                </Files>
                {/* <div className="col-sm-6"> </div> */}
                <div className="col-sm-5 " style={{ float: "right" }}>
                  &nbsp;
                  <button type="button" className={`btn btn primary mb-5 uploadIN uploadCss ${this.state.file && 'activeUpload'}`} disabled={!this.state.file} onClick={this.handleSubmit} style={{borderRadius:'20px' , height:"20px" }}>Upload</button>
                  &nbsp;
                  {this.state.file && <button type="button" className={`btn btn primary mb-5 uploadIN uploadCss removeBtn`} disabled={!this.state.file} onClick={this.clear} style={{ marginRight: '5px'}}> remove</button>}
                  &nbsp;

                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-5 margenTop" >
            <Recordaudio />
          </div>
        </div>
      </div>
    );
  };
};

