import React from 'react';
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

//const endpoint=`${window.location.protocol}//${window.location.hostname}:5000`
const endpoint = baseInfo.endpoint
console.log(endpoint)
let tok=null;

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

function redirectDestination(){
  const cookieStr = document.cookie;
  let cookies=cookieStr.split("; ");
  let destination=window.location.origin;
  
  cookies.forEach(elem=>{
    if(elem.includes("throughme_redirection_url")){
      destination=elem.substring(elem.indexOf("=")+1);
    } 
  })
  window.location.href=destination;
  
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
  },
}));

function PwChange() {

  let handleSendRequestNumber=()=>{
    let email=document.getElementById("email").value
    if(!email){
      alert("임시 비밀번호를 발급 받을 이메일 주소를 입력해주세요.")
      return;
    }
    axios.post(`${endpoint}/users/pwChange/requestTempPw`, {
      "email": email
    }).then((res)=>{
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    })    
  }
  

    let handleClick=()=>{
    // console.log('hello')
    let email=document.getElementById("email").value
    let tmpPw=document.getElementById("tmpPassword").value
    let pw=document.getElementById("password").value
    let pwRpt=document.getElementById("passwordRepeat").value
    if(!email){
      alert("이메일 주소를 입력해주세요.")
      return;
    }
    else if(!tmpPw){
      alert("임시 비밀번호를 입력해주세요.")
      return;
    } else if(!pw){
      alert("새 비밀번호를 입력해주세요.")
      return;
    } else if(!pwRpt){
      alert("새 비밀번호 확인을 입력해주세요.")
      return;
    } else if(pwRpt!==pw){
      alert("비밀번호와 비밀번호 확인 값이 일치하지 않습니다.")
      return;
    }
    axios.post(`${endpoint}/users/pwChange`,{
      email:email, 
      tmpPw:tmpPw, 
      pw:pw, 
      pwRpt:pwRpt, 
    }).then((res)=>{
      tok=res.data
      console.log(tok)
      console.log(res)
      if(res.data.result && res.data.result==='success'){
        alert('비밀번호가 변경되었습니다.')
        window.location.href=`${window.location.origin}`
      }

    }).catch((err)=>{
      console.log("err:")
      console.log(err)
      alert("계정 정보를 확인해주세요")
    });
    }
    let handleEnter=(event)=>{
      if(event.key==="Enter"){
        handleClick();
      }

    }
    let handleSignup=(event)=>{
    // console.log('hello')
    let email=document.getElementById("email").value
    let pw=document.getElementById("password").value;
    // console.log(email)
    // console.log(pw)
    axios.post(`${endpoint}/users/signup`,{
     email:email, pw:pw
    },{withCredentials:true}).then((res)=>{
      tok=res.data
      console.log(tok)
      console.log(res)
      window.location.href="/"
//      document.cookie=res.headers["Set-Cookie"]
    }).catch((err)=>{
      console.log("err:")
      console.log(err)
      alert("계정 정보를 확인해주세요")
    })
  }
  const classes = useStyles();
  return (
    <div className="App">
      {/* <header className="App-header">
	  <div>Auth</div>
	  <div>Email<input id="email"/></div>
          <div>Password<input type="password" id="password"/></div>
          <div><button onClick={handleClick}>signin</button><button onClick={handleSignup} disabled  >signup</button></div>
          <div>{tok}</div>
      </header> */}
    <ThemeProvider theme={theme}>
    <React.Fragment>
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
          <Button fullWidth variant="contained"
            style={{color:"white", backgroundColor: "slategray"}}onClick={handleSendRequestNumber}>임시 비밀번호 발급</Button>
        <CssBaseline />
            <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onInvalid="true"
            id="tmpPassword"
            label="임시 비밀번호"
            placeholder="이메일로 전송된 임시 비밀번호를 입력해주세요."
            name="tmpPassword"
            type="password"
            autoFocus
          />
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="새 비밀번호"
            type="password"
            id="password"
            autoComplete="current-password"
            onKeyDown={handleEnter}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="passwordRepeat"
            label="새 비밀번호 확인"
            type="password"
            id="passwordRepeat"
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
            style={{color:"white", backgroundColor: "salmon"}}
            className={classes.submit}
            onClick={handleClick}
          >
            비밀번호 변경
          </Button>
        </form>
      </div>
    </Container>
    </React.Fragment>
    </ThemeProvider>
    </div>
  );
}

export default PwChange;
