import React from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { makeStyles } from '@material-ui/core/styles';
import PwChange from './components/PwChange'
import Home from './components/Home'
import Profile from './components/Profile'
import Signup from './components/Signup'
import ClientApp from './components/ClientApp'
import Admin from './components/Admin'

import baseInfo from './env/baseInfo.js'

//const endpoint = `${window.location.protocol}//${window.location.hostname}:5000`
const endpoint = baseInfo.endpoint
//console.log(endpoint)
let tok = null;

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Jua',
      'Do Hyeon',
      'Nunito',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
        CloudNativeLab
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
function App(){
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <React.Fragment>
          <Router>
            <Switch>
              <Route exact={true} path="/" component={Home} />
              <Route exact={true} path="/profile" component={Profile} />
              <Route exact={true} path="/pwChange" component={PwChange} />
              <Route exact={true} path="/signup" component={Signup} />
              <Route exact={true} path="/admin/clientApp" component={ClientApp} />
              <Route exact={true} path="/admin" component={Admin} />
            </Switch>
          </Router>
          <Box mt={8}>
            <Copyright />
          </Box>
        </React.Fragment>
      </ThemeProvider>
    </div>


  );
}

export default App;
