import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';

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
import baseInfo from '../env/baseInfo'


//const endpoint = `${window.location.protocol}//${window.location.hostname}:5000`
const endpoint = baseInfo.endpoint
console.log(endpoint)
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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color:"white",
    backgroundColor: "salmon"
  },
  text:{
    margin: theme.spacing(1, 2, 2),
    color:"darkslateblue",
  }
}));

function redirectDestination() {
  const cookieStr = document.cookie;
  let cookies = cookieStr.split("; ");
  let destination = "http://devportal.opsinno.cloud";

  cookies.forEach(elem => {
    if (elem.includes("throughme_redirection_url")) {
      destination = elem.substring(elem.indexOf("=") + 1);
    }
  })
  window.location.href = destination;

}

function checkProfile() {
  let rst=false;
  let tokenVal;
  if( document.cookie!=="" && document.cookie.includes("token=")){
    const cookies = document.cookie.split("; ");
    cookies.forEach((e)=>{
      if(e.includes("token=")){
        tokenVal=e.split("=")[1];
      }
    })
  }

  console.log(tokenVal);

  axios.post(`${endpoint}/users/validate`,{
    token:tokenVal
  }).then((res)=>{
    let tok=res.data
    console.log(tok)
    if(res.data.result && tok.result==='ok'){
      //alert('토큰 맞음 ㅇㅇ')
      //this.rst=true;
      console.log(window.location.origin)
      window.location.href=`${window.location.origin}/profile`
    }

  }).catch((err)=>{
    console.log("err:")
    console.log(err)
    //alert("짭토큰")
  });
  //return rst;

}

function Home() {
  // const [profileExist, setProfileExist]=useState(false);
  checkProfile()
      
  
  let handleClickChangePw = () => {
    window.location.href = `${window.location.href}pwChange`
  }
  let handleClick = () => {
    // console.log('hello')
    let email = document.getElementById("email").value
    let pw = document.getElementById("password").value;
    // console.log(email)
    // console.log(pw)
    axios.post(`${endpoint}/users/signin`, {
      email: email, pw: pw
    }, { withCredentials: true }).then((res) => {
      tok = res.data
      console.log(tok)
      console.log(res)
      //window.location.href="http://devportal.opsinno.cloud/"
      if(res.data.result && res.data.result==='success')
        redirectDestination() 
    }).catch((err) => {
      console.log("err:")
      console.log(err)
      alert("계정 정보를 확인해주세요")
    });
  }
  let handleEnter = (event) => {
    if (event.key === "Enter") {
      handleClick();
    }

  }
  let handleClickSignUp = () => {
    window.location.href=`${window.location.href}signup`
  }
  let handleSignup = (event) => {
    // console.log('hello')
    let email = document.getElementById("email").value
    let pw = document.getElementById("password").value;
    // console.log(email)
    // console.log(pw)
    axios.post(`${endpoint}/users/signup`, {
      email: email, pw: pw
    }, { withCredentials: true }).then((res) => {
      tok = res.data
      console.log(tok)
      console.log(res)
      
      //      document.cookie=res.headers["Set-Cookie"]
    }).catch((err) => {
      console.log("err:")
      console.log(err)
      alert("계정 정보를 확인해주세요")
    })
  }
  const classes = useStyles();

  return (
    <div className="Home">

      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">

          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일 주소"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              onKeyDown={handleEnter}
            />
            {/*<FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />*/}
            <Button
              //type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={handleClick}
            >
              로그인
          </Button>
          <Container disableGutters >
            <div style={{"float": "right"}}>
            <Button
              //type="submit"
              size="small"
              variant="text"
              className={classes.text}
              onClick={handleClickSignUp}
            >
              회원가입
          </Button>
          <Button
              //type="submit"
              size="small"
              variant="text"
              className={classes.text}
              onClick={handleClickChangePw}
            >
              비밀번호 초기화
          </Button>
          </div>
          </Container>
          </form>
        </div>
      </Container>

    </div>
  );
}

export default Home;
