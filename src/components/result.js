import React, { Component } from 'react'
import { fetchData, docClient } from './importdbdata';
import NegativeImg from '../images/Negative.png';
import PositiveImg from '../images/Positive.png';
import MedianImg from '../images/Median.jpeg';
import S3 from 'react-aws-s3';

const mailer = require("./mailer");


export const toAbsoluteUrl = pathname => window.location.origin + pathname;

export default class result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            email:''
        };
    }

    componentDidMount() {
        //   const data =  fetchData('ScaleFactors');
        this.getdata('ScaleFactors');
    }

    getdata = (tableName) => {
        let _this = this
        var params = {
            TableName: tableName
        }
        docClient.scan(params, function (err, data) {
            if (!err) {
                console.log("data", data);
                if (data) {
                    _this.setState({
                        data: data,
                        loading: false
                    })
                    _this.getHosp(data)
                }
            }
            else {
                console.log("error ", err)
            }
        })
    }

    status = (data) => {
        console.log("data", data);
        if (["3", 3].includes(data)) {
            const imgData = (`/img/Median.png`);
            localStorage.setItem('outputimage',imgData);
            const splitstring = imgData.split("/");
            console.log("Split String text: ",splitstring[2] );
            this.upload(splitstring[2]);
            return `/img/Median.png`
        } else if (data > 3) {
            const imgData = (`/img/Positive.png`);
            localStorage.setItem('outputimage',imgData);
            const splitstring = imgData.split("/");
            console.log("Split String text: ",splitstring[2] );
            this.upload(splitstring[2]);
            return `/img/Positive.png`
        } else {
            const imgData = (`/img/Negative.png`);
            localStorage.setItem('outputimage',imgData);
            const splitstring = imgData.split("/");
            console.log("Split String text: ",splitstring[2] );
            this.upload(splitstring[2]);
            return `/img/Negative.png`
        }
    }

    upload = (file) => {
        const config = {
            bucketName: 'abdemo-audio',
            region: 'ca-central-1',
            accessKeyId: process.env.REACT_APP_ACCESS_ID,
            secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
        }

        console.log("Inside S3 Upload");
        const ReactS3Client = new S3(config);
        const filename = `${toAbsoluteUrl(localStorage.getItem('outputimage'))}`
        //console.log("Inside S3 Upload filename object value: ", filename );
        // the name of the file uploaded is used to upload it to S3
        ReactS3Client.uploadFile(filename,file)
        .then(data => console.log(data.location))
        .catch(err => console.error(err))

    }

    download = () => {
        var element = document.createElement("a");
        var file = new Blob(
            [
                `${toAbsoluteUrl(this.status(this.props.match.params.total))}`
            ],
            { type: "image/*" }
        );

        console.log("file", file);
        element.href = URL.createObjectURL(file);
        element.download = "image.jpg";
        element.click();
    };

    sendEMail= () => {
        console.log("Inside Send Email Beginning");
        const selected_data = localStorage.getItem('array');
        const image_url =  `${toAbsoluteUrl(localStorage.getItem('outputimage'))}`
        const email_address = this.state.email;
        console.log("Output image URL in send email function ", image_url);
        console.log("User Input Email Address ", email_address);
        // build the request payload which includes the url of the end-point we want to hit
        const payload = {
          details: JSON.stringify(selected_data),
          result_image: image_url
        };

        return mailer.sendMail('ayrepoojasocial90@gmail.com', [email_address], payload)

    };


    getHosp = ( ) => {
        let filter = [];
        const data = localStorage.getItem('array');
        console.log("----------" , JSON.stringify(data)); 
        // localStorage.getItem('array').forEach((element, i) => {
        //     if (g_nonDoctor?.edit?.data?.hospital_id.includes(element._id)) {
        //         filter.push({ value: element._id, displayValue: element.name });
        //     }
        // })
        return filter
    }

    render() {
        const {loading , id , data}=this.props;
       
        return (
            <div className="container">

                <img src={toAbsoluteUrl(this.status(this.props.match.params.total))} alt='' height={'500px'} />

                <div>

                    
                    <span>&nbsp; &nbsp;</span>
                    <input type="text" id="email" placeholder='Please enter email address' onChange={(e)=>{this.setState({email: e.target.value})}}/>
                    <span>&nbsp; &nbsp;</span>
                    <button className="btn btn-primary text-light" onClick={() => this.sendEMail()}> Send Email</button>
                    <span>&nbsp; &nbsp;</span>
                    <a
                        href={toAbsoluteUrl(this.status(this.props.match.params.total))}
                        download
                        onClick={() => this.download()}
                    >
                       <button className="btn btn-primary text-light">Download</button> 
                    </a>
                    <span>&nbsp; &nbsp;</span>
                    <button  className="btn btn-primary text-light" onClick={this.props.history.goBack}>Go back</button>
                </div>
            </div>
        )
    }
}
