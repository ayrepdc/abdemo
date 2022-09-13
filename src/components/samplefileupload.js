// eslint-disable-next-line
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Storage from "@aws-amplify/storage";
//import {SetS3Config } from "./services";
//import "./styles.css";


export default class sampleaudio extends Component {
  state = {
    imageName: "",
    imageFile: "",
    response: ""
  };

  SetS3Config = (bucket, level) =>{
    Storage.configure({ 
           bucket: "abdemo-audio",
           level: "public",
           region: 'ca-central-1',  
           identityPoolId: "67mpvg0pkbqdhr30fj8lno8ehb"
    });
}


  uploadImage = () => {
    this.SetS3Config("abdemo-audio", "public");
    Storage.put(this.upload.files[0].name,
                this.upload.files[0],
                { contentType: this.upload.files[0].type })
      .then(result => {
        this.upload = null;
        this.setState({ response: "Success uploading file!" });
      })
      .catch(err => {
        this.setState({ response: "Cannot uploading file: ${err}" });
      });
  };

  render() {
    return (
      <div className="App">
        <h2>S3 Upload example...</h2>
        <input
          type="file"
          accept="audio/mp3,audio/mp4"
          style={{ display: "none" }}
          ref={ref => (this.upload = ref)}
          onChange={e =>
            this.setState({
              imageFile: this.upload.files[0],
              imageName: this.upload.files[0].name
            })
          }
        />
        <input value={this.state.imageName} placeholder="Select file" />
        <button
          onClick={e => {
            this.upload.value = null;
            this.upload.click();
          }}
          loading={this.state.uploading}
        >
          Browse
        </button>

        <button onClick={this.uploadImage}> Upload File </button>

        {!!this.state.response && <div>{this.state.response}</div>}
      </div>
    );
  }
}
