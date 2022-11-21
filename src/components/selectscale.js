import React, { Component } from 'react';
import { fetchData, docClient } from './importdbdata';
import { Link } from 'react-router-dom';
import { type } from '@testing-library/user-event/dist/type';
import logo from '../images/logo.png'


class selectscale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            id: [],
            type: ''
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
                }
            }
            else {
                console.log("error ", err)
            }
        })
    }

    handleChange = (id, type) => {
        this.setState({
            id: [id, ...this.state.id]
        })
    }

    removePeople(id, type) {
        var array = [...this.state.id];
        var index = array.indexOf(id);
        if (index !== -1) {
            array.splice(index, 1);
            return this.setState({ id: array });
        }
        if (array.length > 5) {
            return alert("Please select upto 6 options");
        }
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({ id: array });
        } else {
            this.setState({
                id: [id, ...this.state.id]
            })
        }
    }

    checkStatus = (status, type) => {
        if (this.state.id.includes(status)) {
            if (type === 'Negative') {
                return `btn btn-danger`
            } else {
                return `btn btn-success`
            }
        }
    }

    saveLocal = () => {
        localStorage.setItem('array', this.state.id)
    }
    signOut = () => {
        localStorage.clear();
        this.props.history.push('/')
      }

    render() {
        const { data, loading, id } = this.state;
        console.log("id", id);

        const userName = localStorage.getItem('user_name')

        let list = (
            <div className="container">
                <div className="header">
                    <img src={logo} className="logo" height={'50px'} width={"100px"} />
                    <div className="header-right">
                        <h1> Welcome, {userName} </h1>
                        <button type='button' className="btn btn primary mb-5 uploadIN uploadCss" style={{ float: 'right', marginTop: '-15px' }} onClick={this.signOut}>Sign out</button>
                    </div>
                </div>
                <div class="row">
                    {loading === false && data.Items.sort((a, b) => a.Factor_ID > b.Factor_ID ? 1 : -1).map((x, i) => (
                        <div>

                            {x.type === "Negative" ?
                                <div class="col-sm-6">

                                    <span className='m-5' >
                                        <button type="button" className={`${status(x.Type)} btn-lg ${this.checkStatus(x.Factor_ID, x.Type)}`} aria-pressed="true" key={i} onClick={() => this.removePeople(x.Factor_ID, x.Type)}> {x.Factor} </button>
                                    </span>
                                </div>
                                :
                                <div class="col-sm-6">

                                    <span className='m-5' >
                                        <button type="button" className={`${status(x.Type)} btn-lg ${this.checkStatus(x.Factor_ID, x.Type)}`} aria-pressed="true" key={i} onClick={() => this.removePeople(x.Factor_ID, x.Type)}> {x.Factor} </button>
                                    </span>
                                </div>}
                        </div>
                        //id.includes(x.Factor_ID)
                    ))}
                </div>
                <div className='text-right-cust '>

                    {this.state.id.length > 0 && <Link
                        to={{
                            pathname: `/result/${id.length}`,
                            state: { data: id }
                        }}
                        className="btn btn-primary text-light"
                        onClick={this.saveLocal}
                    > Submit </Link>}
                </div>
            </div >

        )
        return (
            <div>
                {list}
            </div>
        )
    }
}
//${status === 'active' ? "" : ""}

// export function active(id , status) {
//     console.log('id.includes(x.Factor_ID)', id.includes(status));
//     if (id.includes(status)) {
//         return 'active'
//     }else{
//         return 'active'
//     }
// switch (id.includes(status)) {
//     case true:
//         return `btn btn-outline-danger btn-danger-red`
//     default:
//         return 'btn btn-outline-success btn-green';
// }
// }

export function status(path, status) {
    switch (path) {
        case "Negative":
            return `btn-danger-red`
        default:
            return 'btn-green';
    }
}

export default (selectscale);