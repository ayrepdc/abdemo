import React, { Component } from 'react'
import { fetchData, docClient } from './importdbdata';
import NegativeImg from '../images/Negative.png';
import PositiveImg from '../images/Positive.png';
import MedianImg from '../images/Median.jpeg';


const mailer = require("./mailer");


export const toAbsoluteUrl = pathname => window.location.origin + pathname;

export default class result extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true
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
            return `/img/Median.png`
        } else if (data > 3) {
            const imgData = (`/img/Positive.png`);
            localStorage.setItem('outputimage',imgData);
            return `/img/Positive.png`
        } else {
            const imgData = (`/img/Negative.png`);
            localStorage.setItem('outputimage',imgData);
            return `/img/Negative.png`
        }
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
        console.log("Output image URL in send email function ", image_url);
        // build the request payload which includes the url of the end-point we want to hit
        const payload = {
          details: JSON.stringify(selected_data),
          result_image: image_url
        };

        return mailer.sendMail('ayrepoojasocial90@gmail.com', ['reciever@email.com'], payload)

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

                    <a
                        href={toAbsoluteUrl(this.status(this.props.match.params.total))}
                        download
                        onClick={() => this.download()}
                    >
                       <button className="btn btn-primary text-light">Download</button> 
                    </a>
                    <span>&nbsp; &nbsp;</span>
                    <button className="btn btn-primary text-light" onClick={() => this.sendEMail()}> Send Email</button>
                    <span>&nbsp; &nbsp;</span>
                    <button  className="btn btn-primary text-light" onClick={this.props.history.goBack}>Go back</button>
                </div>
            </div>
        )
    }
}
