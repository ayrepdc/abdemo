import React, { Component } from 'react'
import {Recorder} from 'react-voice-recorder'
import 'react-voice-recorder/dist/index.css'
import axios from 'axios';
import Files from 'react-files';
import swal from 'sweetalert';



const ApiGatewayUrl = 'https://edkchnowzk.execute-api.ca-central-1.amazonaws.com/dev/geturl';

export default class recordaudio extends Component {
    state = {
        audioDetails: {
            url: null,
            blob: null,
            chunks: null,
            duration: {
                h: null,
                m: null,
                s: null,
            }
        },
        accessToken: localStorage.getItem('token')
    }
   
   

    handleAudioStop = (data) => {
        console.log(data)
        this.setState({ audioDetails: data });
        
    }

    

    handleAudioUpload = async () =>  {
        console.log("audioDetails" , this.state.audioDetails);
        // const file = JSON.stringify(this.state.audioDetails);
        //const file = new File([this.state.audioDetails], "demo.mp4");
        // const myFile = new File([myBlob], 'image.jpeg', {
        //     type: myBlob.type,
        // });

        

        const mediaBlob = await fetch(this.state.audioDetails.url)
            .then(response => response.blob());

        console.log("Media Blob - ", mediaBlob);

        const myFile = new File([mediaBlob],{ type: 'video/mp4'  });



        console.log("--" , myFile);
        const response = await axios({
            method: "GET",
            url: ApiGatewayUrl,
            headers: {
                Authorization: this.state.accessToken,
            },
            crossDomain: true,
            overturn_count: true
        });

        console.log("Response: ", response.data.body);

        // * PUT request: upload file to S3
        const result = await fetch(response.data.body, {
            method: "PUT",
            body: myFile,
          })
            .then((res) => {
              // alert("submit succes")
              swal("File uploaded successfully!", "", "success");
            }).catch((err) => {
              console.log("err", err);
              throw "ERROR AFTER THEN";
            });
          console.log("Result: ", result);
        };
  
    
    handleRest() {
        const reset = {
            url: null,
            blob: null,
            chunks: null,
            duration: {
                h: null,
                m: null,
                s: null,
            }
        }
        this.setState({ audioDetails: reset });
    }

    handleOnChange = (v) => {
        console.log("v" , v);
        
    }

    render() {
        console.log("audioDetails" , this.state.audioDetails);
    return (
      <div>
            <Recorder
                record={true}
                //title={"New recording"}
                audioURL={this.state.audioDetails.url}
                //uploadButtonDisabled = {true}
                //mimeTypeToUseWhenRecording = {'audio/webm;codecs=opus'}
                showUIAudio
                handleAudioStop={data => this.handleAudioStop(data)}
                handleOnChange={(value) => this.handleOnChange(value, 'firstname')}
                handleAudioUpload={data => this.handleAudioUpload()}
                handleRest={() => this.handleRest()} />

                {/* <button type='button ' className='btn btn primary' onClick={this.handleAudioUpload}> Upload</button> */}
      </div>
    )
  }
}
