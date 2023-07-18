// eslint-disable-next-line
import React from "react";
import logo from './logo.svg';
import './App.css';
import UploadToS3 from './components/UploadToS3';
import { Authenticator } from '@aws-amplify/ui-react';
import fileUpload from './components/UploadToS3';
import Recordaudio  from './components/recordaudio';
import Login from './components/login';
import selectScale from './components/selectscale';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import result from "./components/result";

function App() {

  // const redirect = (auth) => {
  //   let redirect = '/'
  //   if(auth) {
  //     redirect = '/fileUpload'
  //   }

  //   return redirect
  // }
  return (
    <div>
      <Router>
        <Switch> 

          <Route exact path='/' component={Login} />
          <Route exact path='/UploadToS3' component={UploadToS3} />

        </Switch>
      </Router>

    </div>
  );
}

export default App;
